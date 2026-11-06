export const EFFECT_IDS = [
  "argus", "relay", "flow", "ripple", "scan", "cloth",
  "landscape", "lidar", "filings", "growth", "blackhole",
];

export function chooseEffect(previous, random = Math.random) {
  const choices = EFFECT_IDS.filter((id) => id !== previous);
  const index = Math.min(choices.length - 1, Math.max(0, Math.floor(random() * choices.length)));
  return choices[index];
}

export async function loadEffect() {
  let previous;
  try { previous = sessionStorage.getItem("opening-effect"); } catch {}
  // A fixed allowlist also makes individual scenes easy to preview and verify.
  const requested = new URLSearchParams(location.search).get("effect");
  const id = EFFECT_IDS.includes(requested) ? requested : chooseEffect(previous);
  try {
    const module = id === "flow" ? await import("./flow.js") : await import(`./effects/${id}.js`);
    try { sessionStorage.setItem("opening-effect", id); } catch {}
    return { id, mount: module.mount };
  } catch (error) {
    console.warn("Opening effect unavailable; using flow.", error);
    const module = await import("./flow.js");
    return { id: "flow", mount: module.mount };
  }
}
