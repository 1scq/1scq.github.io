const clamp = (value) => Math.min(1, Math.max(0, value));
const smooth = (value) => { const t = clamp(value); return t * t * (3 - 2 * t); };

export const introProgress = (scrolled, distance) =>
  clamp(scrolled / Math.max(1, distance));

export function introAppearance(progress) {
  const p = clamp(progress);
  return {
    stageOpacity: 1 - smooth((p - 0.2) / 0.8),
    copyOpacity: 1 - smooth(p / 0.65),
    copyOffset: -60 * smooth(p),
    effectOpacity: 1 - smooth((p - 0.65) / 0.35),
    hintOpacity: 1 - smooth(p / 0.25),
  };
}
