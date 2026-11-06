import { mount } from "./ripple.js";
import { introProgress, introAppearance } from "./intro-progress.js";

const intro = document.querySelector("#intro");
const canvas = document.querySelector("#ripple-canvas");
const toggle = intro?.querySelector(".flow-toggle");

if (intro && canvas && toggle && canvas.getContext("2d")) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  intro.classList.add("is-enhanced");
  const animation = mount(canvas);
  animation.setColors({ ink: "215 35% 18%", red: "345 83% 41%" });
  toggle.hidden = false;
  let paused = false;
  let scheduled = 0;

  function updateScroll() {
    scheduled = 0;
    const progress = reduced.matches ? 0 : introProgress(
      -intro.getBoundingClientRect().top,
      intro.offsetHeight
    );
    const appearance = introAppearance(progress);
    animation.setPaused(paused || progress >= 1);
    intro.classList.toggle("is-exited", progress >= 1);
    intro.inert = progress >= 1;
    intro.style.setProperty("--stage-opacity", appearance.stageOpacity);
    intro.style.setProperty("--copy-opacity", appearance.copyOpacity);
    intro.style.setProperty("--copy-offset", `${appearance.copyOffset}px`);
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
