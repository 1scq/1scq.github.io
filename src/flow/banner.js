import { loadEffect } from "./effects.js";
import { introProgress, introAppearance } from "./intro-progress.js";

const intro = document.querySelector("#intro");
let canvas = document.querySelector("#flow-canvas");
const toggle = intro?.querySelector(".flow-toggle");

async function initialize() {
  if (!(intro && canvas && toggle)) return;
  let effect = await loadEffect();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let animation;
  try {
    animation = await effect.mount(canvas);
  } catch (error) {
    console.warn("Opening renderer unavailable; using flow.", error);
    // A canvas cannot change context type after WebGL initialization.
    const replacement = canvas.cloneNode(false);
    canvas.replaceWith(replacement);
    canvas = replacement;
    effect = { id: "flow", ...await import("./flow.js") };
    animation = effect.mount(canvas);
  }
  intro.classList.add("is-enhanced");
  intro.dataset.effect = effect.id;
  function updateColors() {
    const dark = document.documentElement?.dataset.theme === "dark";
    animation.setColors(dark
      ? { ink: "240 12% 88%", paper: "240 6% 7%", red: "345 93% 77%" }
      : { ink: "215 35% 18%", paper: "0 0% 100%", red: "345 83% 41%" });
  }
  updateColors();
  window.addEventListener("themechange", updateColors);
  toggle.hidden = false;
  let paused = false;
  let scheduled = 0;

  function updateScroll() {
    scheduled = 0;
    const scrolled = Math.max(0, -intro.getBoundingClientRect().top);
    const progress = introProgress(scrolled, intro.offsetHeight);
    intro.style.setProperty("--stage-clip", `${Math.min(scrolled, intro.offsetHeight)}px`);
    const appearance = introAppearance(progress);
    animation.setScatter?.(reduced.matches ? 0 : progress);
    animation.setPaused(paused || progress >= 1);
    intro.classList.toggle("is-exited", progress >= 1);
    intro.inert = progress >= 1;
    intro.style.setProperty("--stage-opacity", appearance.stageOpacity);
    intro.style.setProperty("--copy-opacity", appearance.copyOpacity);
    intro.style.setProperty("--copy-offset", `${reduced.matches ? 0 : appearance.copyOffset}px`);
    intro.style.setProperty("--effect-opacity", appearance.effectOpacity);
    intro.style.setProperty("--hint-opacity", appearance.hintOpacity);
  }

  const schedule = () => {
    if (!scheduled) scheduled = requestAnimationFrame(updateScroll);
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  reduced.addEventListener("change", schedule);
  updateScroll();

  toggle.addEventListener("click", () => {
    paused = !paused;
    animation.setPaused(paused);
    const label = paused ? "Play background animation" : "Pause background animation";
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.setAttribute("aria-label", label);
    toggle.title = paused ? "Play animation" : "Pause animation";
    toggle.firstElementChild.textContent = paused ? "▷" : "Ⅱ";
  });

  intro.querySelector(".intro-enter").addEventListener("click", () => {
    document.querySelector("#content").focus({ preventScroll: true });
  });
}

const ready = initialize().catch((error) => {
  console.error("Opening unavailable", error);
  intro?.classList.remove("is-enhanced");
});
