// Original implementation of a draggable spring-connected headline.
// Physics use font-relative units, so the feel stays consistent across breakpoints.
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createElasticBand(centers, { reduced = false } = {}) {
  const letters = centers.map(home => ({ home, x: 0, y: 0, vx: 0, vy: 0 }));
  let held = -1, target = { x: 0, y: 0 }, quiet = true;
  const reset = () => {
    held = -1; quiet = true;
    for (const letter of letters) letter.x = letter.y = letter.vx = letter.vy = 0;
  };
  function pull(index, x, y) {
    if (!letters[index] || !Number.isFinite(x + y)) return;
    held = index; quiet = false;
    const reach = 2.5, distance = Math.hypot(x, y);
    const resisted = distance <= reach ? distance : reach + (distance - reach) / (1 + (distance - reach) / 1.4);
    const ratio = distance ? resisted / distance : 1;
    target = { x: x * ratio, y: y * ratio };
    if (reduced) {
      letters.forEach((letter, i) => {
        const weight = Math.exp(-Math.abs(i - held) * 0.72);
        letter.x = target.x * weight; letter.y = target.y * weight;
        letter.vx = letter.vy = 0;
      });
    } else {
      Object.assign(letters[held], target, { vx: 0, vy: 0 });
    }
  }
  function release(vx = 0, vy = 0, pluck = false) {
    if (held < 0) return;
    if (reduced) { reset(); return; }
    const picked = letters[held];
    picked.vx = clamp(vx, -14, 14);
    picked.vy = pluck ? -5.5 : clamp(vy, -14, 14);
    held = -1;
    quiet = false;
  }
  function pluck(index = Math.floor(letters.length / 2), strength = 1) {
    if (!letters[index] || reduced) return;
    letters[index].vy -= 5.5 * clamp(strength, 0, 2);
    quiet = false;
  }
  function step(dt) {
    if (reduced || quiet) return false;
    dt = clamp(Number.isFinite(dt) ? dt : 0, 0, 0.05);
    const steps = Math.max(1, Math.ceil(dt * 120)), h = dt / steps;
    for (let s = 0; s < steps; s++) {
      const accelerations = letters.map((letter, i) => {
        const left = letters[i - 1], right = letters[i + 1];
        return {
          x: -85 * letter.x + 250 * ((left?.x || 0) + (right?.x || 0) - 2 * letter.x) - 11.5 * letter.vx,
          y: -85 * letter.y + 250 * ((left?.y || 0) + (right?.y || 0) - 2 * letter.y) - 11.5 * letter.vy
        };
      });
      letters.forEach((letter, i) => {
        if (i === held) { Object.assign(letter, target, { vx: 0, vy: 0 }); return; }
        letter.vx = clamp(letter.vx + accelerations[i].x * h, -25, 25);
        letter.vy = clamp(letter.vy + accelerations[i].y * h, -25, 25);
        letter.x = clamp(letter.x + letter.vx * h, -5, 5);
        letter.y = clamp(letter.y + letter.vy * h, -5, 5);
      });
    }
    quiet = held < 0 && letters.every(letter => Math.hypot(letter.x, letter.y) < 0.001 && Math.hypot(letter.vx, letter.vy) < 0.008);
    if (quiet) reset();
    return !quiet;
  }
  return {
    letters, pull, release, pluck, step, reset,
    get held() { return held; },
    get active() { return !quiet; },
    setReduced(value) { reduced = value; reset(); }
  };
}

export function mountElasticLettering(heading) {
  const text = heading.textContent;
  const originalTitle = heading.getAttribute('title');
  const sizer = document.createElement('span');
  sizer.className = 'elastic-lettering__sizer';
  sizer.textContent = text;
  sizer.setAttribute('aria-hidden', 'true');
  const overlay = document.createElement('span');
  overlay.className = 'elastic-lettering__letters';
  overlay.setAttribute('aria-hidden', 'true');
  const parts = typeof Intl.Segmenter === 'function'
    ? [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)].map(item => item.segment)
    : Array.from(text);
  const spans = parts.map(letter => {
    const span = document.createElement('span');
    span.className = 'elastic-lettering__letter';
    span.textContent = letter;
    overlay.append(span);
    return span;
  });
  heading.replaceChildren(sizer, overlay);
  heading.classList.add('elastic-lettering');
  heading.setAttribute('aria-label', text);
  heading.setAttribute('tabindex', '0');
  heading.setAttribute('title', '拖动字母，松手回弹 · Drag, stretch and release');
  heading.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight Space Enter Escape');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = [];
  let band, geometry = [], em = 64, drag = null, selected = Math.floor(parts.length / 2);
  let raf = 0, last = 0, visible = true, destroyed = false;
  const listen = (target, name, callback, options) => {
    target.addEventListener(name, callback, options);
    listeners.push(() => target.removeEventListener(name, callback, options));
  };
  function paint() {
    if (!band) return;
    band.letters.forEach((letter, i) => {
      const left = band.letters[Math.max(0, i - 1)], right = band.letters[Math.min(parts.length - 1, i + 1)];
      const dx = right.home + right.x - left.home - left.x;
      const angle = clamp(Math.atan2(right.y - left.y, Math.max(0.15, dx)), -0.65, 0.65) * 0.65;
      const lift = band.held === i ? 1.055 : 1;
      const sx = clamp(1 + Math.abs(letter.vx) * 0.007 - Math.abs(letter.vy) * 0.002, 0.93, 1.15) * lift;
      const sy = clamp(1 + Math.abs(letter.vy) * 0.007 - Math.abs(letter.vx) * 0.002, 0.93, 1.15) * lift;
      const strain = clamp(Math.hypot(letter.x, letter.y) / 1.65, 0, 0.88);
      spans[i].style.transform = `translate3d(${letter.x * em}px, ${letter.y * em}px, 0) rotate(${angle}rad) scale(${sx}, ${sy})`;
      spans[i].style.setProperty('--elastic-strain', `${strain * 100}%`);
      spans[i].toggleAttribute('data-key-selected', i === selected);
    });
  }
  function stop() { cancelAnimationFrame(raf); raf = 0; last = 0; }
  function frame(now) {
    raf = 0;
    if (destroyed || !visible || document.hidden) return;
    const dt = last ? (now - last) / 1000 : 1 / 60;
    last = now;
    const active = band.step(dt);
    paint();
    if (active && !media.matches) raf = requestAnimationFrame(frame);
    else { last = 0; heading.classList.remove('is-elastic-active'); }
  }
  function wake() {
    heading.classList.toggle('is-elastic-active', band.active);
    if (!raf && !destroyed && visible && !document.hidden && !media.matches && band.active) raf = requestAnimationFrame(frame);
  }
  function cancel() {
    if (drag) {
      const id = drag.id;
      drag = null;
      try { heading.releasePointerCapture(id); } catch {}
    }
    heading.classList.remove('is-elastic-held', 'is-elastic-active');
    stop(); band?.reset(); paint();
  }
  function measure() {
    if (destroyed) return;
    cancel();
    em = parseFloat(getComputedStyle(heading).fontSize) || 64;
    const rect = heading.getBoundingClientRect();
    const range = document.createRange();
    let offset = 0;
    geometry = parts.map((part, i) => {
      range.setStart(sizer.firstChild, offset);
      offset += part.length;
      range.setEnd(sizer.firstChild, offset);
      const bounds = range.getBoundingClientRect();
      const left = bounds.left - rect.left;
      spans[i].style.left = `${left}px`;
      return { left, center: left + bounds.width / 2 };
    });
    band = createElasticBand(geometry.map(item => item.center / em), { reduced: media.matches });
    paint();
  }
  function updateDrag(event) {
    if (!drag || drag.id !== event.pointerId) return;
    event.stopPropagation();
    drag.samples.push({ x: event.clientX, y: event.clientY, t: event.timeStamp });
    drag.samples = drag.samples.filter(sample => event.timeStamp - sample.t <= 100).slice(-8);
    const dx = (event.clientX - drag.x) / em, dy = (event.clientY - drag.y) / em;
    drag.travel = Math.max(drag.travel, Math.hypot(dx, dy));
    band.pull(drag.index, dx, dy);
    paint(); wake();
  }
  listen(heading, 'pointerdown', event => {
    if (drag || !band || !visible || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const rect = heading.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    const nearest = geometry.reduce((best, item, i) => {
      const distance = Math.hypot(item.center + band.letters[i].x * em - x, band.letters[i].y * em + rect.height / 2 - y);
      return distance < best.distance ? { index: i, distance } : best;
    }, { index: 0, distance: Infinity }).index;
    selected = nearest;
    stop();
    const letter = band.letters[nearest];
    drag = { id: event.pointerId, index: nearest,
      x: event.clientX - letter.x * em, y: event.clientY - letter.y * em,
      travel: 0, samples: [{ x: event.clientX, y: event.clientY, t: event.timeStamp }] };
    band.pull(nearest, letter.x, letter.y);
    heading.classList.add('is-elastic-held');
    try { heading.setPointerCapture(event.pointerId); } catch {}
    event.preventDefault();
    event.stopPropagation();
    paint(); wake();
  });
  listen(heading, 'pointermove', updateDrag);
  listen(heading, 'pointerup', event => {
    if (!drag || drag.id !== event.pointerId) return;
    updateDrag(event);
    const samples = drag.samples, first = samples[0], end = samples.at(-1);
    const elapsed = Math.max(8, end.t - first.t) / 1000;
    const pluck = drag.travel < 0.045;
    band.release((end.x - first.x) / elapsed / em, (end.y - first.y) / elapsed / em, pluck);
    drag = null;
    heading.classList.remove('is-elastic-held');
    try { heading.releasePointerCapture(event.pointerId); } catch {}
    paint(); wake();
  });
  listen(heading, 'pointercancel', cancel);
  listen(heading, 'lostpointercapture', () => { if (drag) cancel(); });
  listen(window, 'blur', cancel);
  listen(document, 'visibilitychange', () => { if (document.hidden) cancel(); });
  listen(media, 'change', () => { cancel(); band.setReduced(media.matches); paint(); });
  listen(heading, 'keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); cancel(); return; }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); selected = clamp(selected + (event.key === 'ArrowRight' ? 1 : -1), 0, parts.length - 1); paint();
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault(); band.pluck(selected); paint(); wake();
    }
  });
  const observer = new ResizeObserver(measure);
  observer.observe(heading);
  const intersection = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (!visible) cancel();
  });
  intersection.observe(heading);
  measure();
  document.fonts?.ready.then(measure);
  return {
    destroy() {
      destroyed = true; cancel(); observer.disconnect(); intersection.disconnect();
      listeners.forEach(remove => remove());
      heading.replaceChildren(document.createTextNode(text));
      heading.classList.remove('elastic-lettering');
      for (const attribute of ['aria-label', 'tabindex', 'aria-keyshortcuts']) heading.removeAttribute(attribute);
      if (originalTitle === null) heading.removeAttribute('title'); else heading.setAttribute('title', originalTitle);
    }
  };
}
