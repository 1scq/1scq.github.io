// Adapted at the site owner's request from https://ideal.cs.unc.edu/js/sim-hero.js
// Original scene: IDEAL Lab, 2026. Model and source provenance: docs/robot-background.md.
// Simulation-style 3D hero background (three.js + urdf-loader).
//
// Everything is loaded from assets/robots/, which holds decimated .glb link
// meshes plus rewritten URDFs baked by tools/bake_robots.py. Nothing streams
// from a CDN at runtime, so the scene appears once, fully formed — there are
// no primitive stand-ins to swap out mid-load.
//
//   Unitree G1 (29-DoF, Dex3-1 hands)  standing at frame left, waving
//   Unitree Go2 quadruped              in front of it
//   2x Franka FR3 + WUJI Hand          a bimanual cell at right, one hand of
//                                      each chirality
//
// All three are turned to face the viewer: every one of these URDFs points
// along its own +X, so a -PI/2 yaw on the wrapper aims it out of the screen.
import * as THREE from 'three';
import URDFLoader from 'urdf-loader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const ASSETS = new URL('../../assets/robots/', import.meta.url).href.replace(/\/$/, '');

// A phone held upright has nowhere to put a 6 m wide rig. The framing pass in
// resize() answers a narrowing frame by pulling the three groups toward the
// centre line, but that bottoms out at 0.42 well before portrait aspect, so the
// G1 and the Go2 end up standing in each other — and no amount of extra dolly
// fixes it without shrinking all three to specks. Below this aspect the scene
// is skipped outright: the hero keeps the CSS gradient it already falls back to
// when there is no WebGL, and none of the 5.9 MB of link meshes is requested.
const MIN_ASPECT = 0.75;

const host = document.getElementById('robot-background');

function roomForScene() {
  return (host.clientWidth || 1) / (host.clientHeight || 1) >= MIN_ASPECT;
}

if (host) {
  if (roomForScene()) {
    init(host);
  } else {
    // turning the phone sideways gives the rig the width it wanted, so build it
    // then rather than making the viewer reload
    const onResize = () => {
      if (!roomForScene()) return;
      window.removeEventListener('resize', onResize);
      init(host);
    };
    window.addEventListener('resize', onResize, { passive: true });
  }
}

function init(host) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) {
    return; // no WebGL — the CSS gradient behind us is the fallback
  }

  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const intro = document.getElementById('intro');
  const toggle = intro.querySelector('.flow-toggle');
  const paused = () => motionPreference.matches || document.hidden || intro.classList.contains('is-exited') || toggle.getAttribute('aria-pressed') === 'true';

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  // fades the darker floor back into the pale CSS gradient at the horizon
  scene.fog = new THREE.Fog(0xf2f6fa, 9, 26);

  // Image-based lighting: dark robot shells pick up specular breakup and read
  // as machined metal instead of flat silhouettes against this pale
  // background. RoomEnvironment is bright, so it carries most of the fill and
  // the discrete lights stay low — otherwise everything blows out to white.
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.32;

  // Low and close: the headline owns the middle of the hero, so the rig has to
  // live in the lower band of the frame and still read at a glance.
  const camera = new THREE.PerspectiveCamera(41, 1, 0.1, 120);
  const camTarget = new THREE.Vector3(0.1, 0.68, 0.85);
  const camBase = new THREE.Vector3(0, 1.96, 7.0);

  // ---- lights ----
  scene.add(new THREE.HemisphereLight(0xffffff, 0xc2d2e0, 0.28));
  const sun = new THREE.DirectionalLight(0xffffff, 1.35);
  sun.position.set(5, 9, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -5;
  sun.shadow.camera.right = 5;
  sun.shadow.camera.top = 5;
  sun.shadow.camera.bottom = -4;
  sun.shadow.camera.far = 24;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xdcebfa, 0.28);
  fill.position.set(-6, 4, 3);
  scene.add(fill);

  // ---- ground ----
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120),
    new THREE.MeshStandardMaterial({ map: checkerTexture(), roughness: 0.94, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---- materials ----
  const mat = (color, roughness, metalness) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });

  const TABLE_TOP = mat(0xdfe3e9, 0.65, 0.05);
  const TABLE_LEG = mat(0x767d88, 0.5, 0.45);

  const robots = [];  // { update(t) }
  // groups whose spacing tightens on narrow viewports, see layout()
  const placed = [];  // { group, base: Vector3 }

  function place(group, x, y, z) {
    group.position.set(x, y, z);
    placed.push({ group, base: new THREE.Vector3(x, y, z) });
    return group;
  }

  // ---------------- loading ----------------

  function loadURDF(url) {
    return new Promise((resolve, reject) => {
      let robot = null;
      const manager = new THREE.LoadingManager(
        () => (robot ? resolve(robot) : reject(new Error(`empty urdf: ${url}`))),
        undefined,
        (failed) => console.warn('mesh failed:', failed)
      );
      const loader = new URDFLoader(manager);
      // urdf-loader only knows STL and DAE out of the box; every link mesh
      // here is a baked .glb. Signature is (path, manager, material, done).
      loader.loadMeshCb = (path, mgr, material, done) =>
        new GLTFLoader(mgr).load(path, (gltf) => done(gltf.scene), undefined, (e) => done(null, e));
      loader.load(url, (r) => { robot = r; }, undefined, reject);
    });
  }

  // URDF is Z-up; three.js is Y-up.
  //
  // Colours are never chosen here. tools/bake_robots.py resolves each visual's
  // colour at bake time — from the mesh file's own material where it has one,
  // otherwise from the <material> the URDF assigns the link — and writes it into
  // the glb as vertex colours. All this does is give them a consistent finish.
  function dress(robot) {
    robot.rotation.x = -Math.PI / 2;
    for (const link of Object.values(robot.links)) {
      link.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = true;
        o.receiveShadow = true;
        o.material.roughness = 0.52;
        o.material.metalness = 0.18;
        o.material.envMapIntensity = 0.8;
      });
    }
    return robot;
  }

  Promise.all([
    loadURDF(`${ASSETS}/g1/g1.urdf`),
    loadURDF(`${ASSETS}/go2/go2.urdf`),
    loadURDF(`${ASSETS}/fr3_wuji_left/fr3_wuji_left.urdf`),
    loadURDF(`${ASSETS}/fr3_wuji_right/fr3_wuji_right.urdf`),
  ])
    .then(([g1, go2, fr3Left, fr3Right]) => {
      buildScene(g1, go2, fr3Left, fr3Right);
      reveal();
    })
    .catch((e) => {
      console.warn('hero scene unavailable:', e);
      host.remove();
    });

  function buildScene(g1, go2, fr3Left, fr3Right) {
    // ============ bimanual Franka cell (frame right) ============
    const cell = new THREE.Group();
    place(cell, 2.54, 0, 1.20);
    // The rig as a whole is angled back toward the middle of the frame rather
    // than square to the camera; the arms and blocks are children, so their
    // relative pose is untouched.
    cell.rotation.y = -0.34;
    scene.add(cell);

    const TABLE_W = 1.86, TABLE_D = 0.86, TABLE_H = 0.72;
    const top = new THREE.Mesh(new THREE.BoxGeometry(TABLE_W, 0.06, TABLE_D), TABLE_TOP);
    top.position.y = TABLE_H;
    top.castShadow = true;
    top.receiveShadow = true;
    cell.add(top);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, TABLE_H, 0.06), TABLE_LEG);
        leg.position.set(sx * (TABLE_W / 2 - 0.09), TABLE_H / 2, sz * (TABLE_D / 2 - 0.09));
        leg.castShadow = true;
        cell.add(leg);
      }
    }

    // A block under each hand, plus one between them. Positions come from where
    // the solved reach actually lands — 0.42 m out from a mount at +/-0.44 with
    // 0.28 rad of toe-in puts each palm near +/-0.32 — so the arms read as
    // working on something instead of reaching past it.
    for (const [cx, cz, size, rot, col] of [[-0.31, 0.15, 0.055, 0.35, 0xff7b54],
                                            [0.32, 0.19, 0.05, -0.2, 0x4b9cd3],
                                            [0.02, 0.10, 0.042, 0.8, 0xfee440]]) {
      const cube = new THREE.Mesh(new THREE.BoxGeometry(size, size, size),
                                  mat(col, 0.55, 0.05));
      cube.position.set(cx, TABLE_H + 0.03 + size / 2, cz);
      cube.rotation.y = rot;
      cube.castShadow = true;
      cube.receiveShadow = true;
      cell.add(cube);
    }

    // Two FR3 arms at the back edge, each ending in a WUJI Hand — a left hand on
    // the left station and a right hand on the right, so both thumbs face the
    // shared workspace the way a real two-hand rig is set up. The left composite
    // carries WUJI's own left-hand description; it is not a negatively scaled
    // copy of the right, which would invert every face normal.
    const arms = [];
    [[-1, fr3Left, 'left'], [1, fr3Right, 'right']].forEach(([side, robot, hand]) => {
      dress(robot);
      const mount = new THREE.Group();
      mount.position.set(side * 0.44, TABLE_H + 0.03, -0.24);
      // An FR3 reaches along its own base +X, so -PI/2 aims it at the viewer;
      // the extra term toes each station in over the blocks.
      mount.rotation.y = -Math.PI / 2 - side * 0.28;
      mount.add(robot);
      cell.add(mount);
      arms.push({ robot, side, hand });
    });

    // Solved with forward kinematics, and solved against the *lowest point of the
    // hand* rather than the palm: the WUJI hand is 0.2 m from wrist to fingertip,
    // so a palm sitting a comfortable-looking 0.19 m over the bench actually put
    // the fingers 29 mm underneath it, through the blocks and the table top. This
    // pose keeps the whole hand at least 0.11 m clear across the full animation
    // cycle — 55 mm of that being block — while still reaching 0.40 m out with the
    // elbow up at 0.66 m.
    const HOME = [0.0, -0.30, 0.0, -2.68, 0.0, 2.40, 0.785];
    // A 7-DoF arm mirrors by negating the joints that twist about their own link
    // axis, so the two stations reflect each other instead of one being a copy
    // rotated to face the wrong way.
    const MIRROR = [-1, 1, -1, 1, -1, 1, -1];

    robots.push({
      update(t) {
        arms.forEach(({ robot, side, hand }) => {
          // the two stations work out of phase, as if handing a part across
          const p = t * 0.65 + (side > 0 ? Math.PI : 0);
          const q = HOME.slice();
          // amplitudes kept modest so the swing never dips the hand back into
          // the bench; the clearance figure above assumes exactly these
          q[0] += Math.sin(p * 0.7) * 0.16;
          q[1] += Math.sin(p) * 0.11;
          q[3] += Math.sin(p * 0.9 + 0.6) * 0.13;
          q[5] += Math.sin(p * 0.8 + 0.3) * 0.12;
          q[6] += Math.sin(p * 1.3) * 0.45;
          if (side < 0) for (let i = 0; i < 7; i++) q[i] *= MIRROR[i];
          for (let i = 0; i < 7; i++) robot.setJointValue(`arm_fr3_joint${i + 1}`, q[i]);

          // the hand closes near the bottom of the reach and opens on the way
          // back up, with the curl rolling across the fingers
          const grasp = 0.5 + 0.5 * Math.cos(p);
          for (let f = 1; f <= 5; f++) {
            const curl = grasp * (0.72 + 0.28 * Math.sin(t * 1.4 - f * 0.5));
            // finger 1 is the thumb, whose joint1 range never reaches zero
            robot.setJointValue(`hand_${hand}_finger${f}_joint1`,
                                (f === 1 ? 0.10 : 0.0) + curl * 0.5);
            robot.setJointValue(`hand_${hand}_finger${f}_joint3`, curl * 1.0);
            robot.setJointValue(`hand_${hand}_finger${f}_joint4`, curl * 0.9);
          }
        });
      },
    });

    // ============ Unitree G1 (frame left) ============
    dress(g1);
    const g1Wrap = new THREE.Group();
    place(g1Wrap, -2.56, 0, 1.0);
    g1Wrap.rotation.y = -Math.PI / 2 + 0.22;
    scene.add(g1Wrap);
    g1Wrap.add(g1);

    // stand it on the floor: URDF origin is the pelvis, not the soles
    g1.updateMatrixWorld(true);
    g1.position.y = -new THREE.Box3().setFromObject(g1).min.y;
    const g1Rest = g1.position.y;

    const setG1 = (n, v) => g1.setJointValue(n, v);
    // a relaxed standing posture with a slight knee bend
    setG1('left_hip_pitch_joint', -0.16);
    setG1('right_hip_pitch_joint', -0.16);
    setG1('left_knee_joint', 0.34);
    setG1('right_knee_joint', 0.34);
    setG1('left_ankle_pitch_joint', -0.18);
    setG1('right_ankle_pitch_joint', -0.18);

    // It waves with its left arm — the one on the viewer's right, since it faces
    // us. Solved with forward kinematics rather than guessed: shoulder *pitch*
    // is what lifts the arm here (roll only abducts it into a horizontal point),
    // and -2.05 puts the palm about 16 cm above the shoulder.
    setG1('left_shoulder_pitch_joint', -2.05);
    setG1('left_shoulder_roll_joint', 0.75);
    setG1('left_shoulder_yaw_joint', 0.15);
    setG1('left_elbow_joint', 0.55);

    // The other arm hangs. Rolled further out than a natural stance so the
    // hand clears the thigh instead of swinging into it, and given only a
    // fraction of the travel it used to have.
    setG1('right_shoulder_pitch_joint', 0.10);
    setG1('right_shoulder_roll_joint', -0.34);
    setG1('right_elbow_joint', 0.30);

    robots.push({
      update(t) {
        // the wave itself: the raised arm rocks side to side from the shoulder
        const wave = Math.sin(t * 2.6);
        setG1('left_shoulder_roll_joint', 0.75 + wave * 0.24);
        setG1('left_shoulder_yaw_joint', 0.15 + wave * 0.18);
        setG1('left_wrist_roll_joint', wave * 0.40);
        setG1('left_elbow_joint', 0.55 - Math.abs(wave) * 0.10);

        // idle side: a small breath, nowhere near the leg
        const idle = Math.sin(t * 0.8);
        setG1('right_shoulder_pitch_joint', 0.10 + idle * 0.09);
        setG1('right_elbow_joint', 0.30 + idle * 0.07);

        // turn a little toward the arm it is waving with
        setG1('waist_yaw_joint', -0.12 + Math.sin(t * 0.4) * 0.10);

        // Dex3-1 fingers: the waving hand stays open, the idle one loosely
        // curled. Left and right finger axes are mirrored.
        for (const [side, sign, curl] of [['left', -1, 0.16], ['right', 1, 0.62]]) {
          setG1(`${side}_hand_index_0_joint`, sign * curl * 0.85);
          setG1(`${side}_hand_index_1_joint`, sign * curl);
          setG1(`${side}_hand_middle_0_joint`, sign * curl * 0.85);
          setG1(`${side}_hand_middle_1_joint`, sign * curl);
          setG1(`${side}_hand_thumb_1_joint`, -sign * curl * 0.4);
          setG1(`${side}_hand_thumb_2_joint`, sign * curl * 0.9);
        }
        g1.position.y = g1Rest + 0.012 * Math.sin(t * 1.7);
      },
    });

    // ============ Unitree Go2 (left, nearer the camera) ============
    dress(go2);
    const go2Wrap = new THREE.Group();
    place(go2Wrap, -1.52, 0, 2.5);
    go2Wrap.rotation.y = -Math.PI / 2 - 0.3;
    scene.add(go2Wrap);
    go2Wrap.add(go2);

    const setGo2 = (n, v) => go2.setJointValue(n, v);
    for (const leg of ['FL', 'FR', 'RL', 'RR']) {
      setGo2(`${leg}_thigh_joint`, 0.72);
      setGo2(`${leg}_calf_joint`, -1.42);
    }
    go2.updateMatrixWorld(true);
    go2.position.y = -new THREE.Box3().setFromObject(go2).min.y;
    const go2Rest = go2.position.y;

    robots.push({
      update(t) {
        // diagonal pairs, as in a trot held in place
        ['FL', 'FR', 'RL', 'RR'].forEach((leg, i) => {
          const ph = t * 1.9 + (i === 0 || i === 3 ? 0 : Math.PI);
          setGo2(`${leg}_thigh_joint`, 0.72 + 0.06 * Math.sin(ph));
          setGo2(`${leg}_calf_joint`, -1.42 - 0.09 * Math.sin(ph));
        });
        go2.position.y = go2Rest + 0.012 * Math.sin(t * 1.9);
      },
    });
  }

  // ---------------- framing ----------------

  // Keep the whole rig in frame from ultrawide down to a phone held upright.
  //
  // A portrait viewport has so little horizontal room that dollying back far
  // enough to fit a 6 m wide rig shrinks the robots to specks. So do half the
  // work by moving the robots instead: pull the three groups in toward the
  // centre line as the frame narrows, and only dolly back the rest of the way.
  let pull = 1;

  function resize() {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h);
    camera.aspect = w / h;

    const tighten = THREE.MathUtils.clamp(camera.aspect / 1.6, 0.42, 1);
    for (const { group, base } of placed) {
      group.position.x = base.x * tighten;
      group.position.z = base.z * (0.82 + 0.18 * tighten);
    }

    pull = THREE.MathUtils.clamp(1.6 / camera.aspect, 1, 1.55);
    camera.position.copy(camBase).multiplyScalar(pull);
    camera.position.y = camBase.y * (0.72 + 0.28 * pull);
    camera.updateProjectionMatrix();
    camera.lookAt(camTarget);
  }
  resize();
  window.addEventListener('resize', resize);

  // ---------------- interaction ----------------

  let mx = 0, my = 0;
  if (!motionPreference.matches && matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }

  // ---------------- loop ----------------

  const clock = new THREE.Clock();
  let elapsed = 0;
  let running = false;
  let rafId = 0;

  function animate(t) {
    for (const r of robots) r.update(t);
    camera.position.x = camBase.x * pull + Math.sin(t * 0.11) * 0.35 + mx * 1.2;
    camera.position.y = camBase.y * (0.72 + 0.28 * pull) - my * 0.6;
    camera.lookAt(camTarget);
  }

  let lastFrame = 0;
  function step(now) {
    rafId = 0;
    if (paused()) { stop(); return; }
    if (now - lastFrame >= 1000 / 30 - 2) {
      elapsed += Math.min(clock.getDelta(), 0.064);
      animate(elapsed);
      renderer.render(scene, camera);
      lastFrame = now;
    }
    rafId = requestAnimationFrame(step);
  }

  function start() {
    if (running || paused()) return;
    running = true;
    clock.getDelta();
    rafId = requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function synchronize() {
    if (paused()) stop();
    else start();
    if (motionPreference.matches) {
      animate(1.6);
      renderer.render(scene, camera);
    }
  }

  // Fade the finished scene in as one piece — the whole point of baking the
  // assets is that the viewer never sees it assemble itself.
  function reveal() {
    animate(1.6);
    renderer.render(scene, camera);
    host.classList.add('ready');
    document.addEventListener('visibilitychange', synchronize);
    motionPreference.addEventListener('change', synchronize);
    new MutationObserver(synchronize).observe(intro, { attributes: true, attributeFilter: ['class'] });
    new MutationObserver(synchronize).observe(toggle, { attributes: true, attributeFilter: ['aria-pressed'] });
    new IntersectionObserver(
      ([entry]) => entry.isIntersecting ? synchronize() : stop(),
      { threshold: 0.01 }
    ).observe(intro);
    synchronize();
  }

  // ---------------- helpers ----------------

  function checkerTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    const n = 8, sq = 256 / n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        // Deliberately several stops darker than the sky above. The Franka and
        // the Go2 are near-white machines; on a white floor they dissolve into
        // it and only their black joint rings and foot pads stay visible.
        g.fillStyle = (i + j) % 2 ? '#e3e9ef' : '#eff3f7';
        g.fillRect(i * sq, j * sq, sq, sq);
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(38, 38);
    t.anisotropy = 8;
    return t;
  }
}
