(() => {
  const key = "homepage-theme";
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const valid = (value) => ["system", "light", "dark"].includes(value);
  let preference = "system";
  try {
    const saved = localStorage.getItem(key);
    if (valid(saved)) preference = saved;
  } catch {}

  function apply() {
    const theme = preference === "system" ? (system.matches ? "dark" : "light") : preference;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.documentElement.dataset.themePreference = preference;
    document.querySelectorAll('#theme-segment [role="radio"]').forEach(item => {
      const selected = item.dataset.value === preference;
      item.setAttribute('aria-checked', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme, preference } }));
  }

  apply();
  system.addEventListener("change", () => {
    if (preference === "system") apply();
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== key && event.key !== null) return;
    preference = valid(event.newValue) ? event.newValue : "system";
    apply();
  });
  window.addEventListener('themepreference', event => {
    const next = event.detail?.preference;
    if (!valid(next)) return;
    preference = next;
    try { localStorage.setItem(key, preference); } catch {}
    apply();
  });
  document.addEventListener('DOMContentLoaded', apply);
})();
