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
    const select = document.querySelector("#theme-select");
    if (select) select.value = preference;
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
  document.addEventListener("DOMContentLoaded", () => {
    const select = document.querySelector("#theme-select");
    if (!select) return;
    select.value = preference;
    select.addEventListener("change", () => {
      preference = valid(select.value) ? select.value : "system";
      try { localStorage.setItem(key, preference); } catch {}
      apply();
    });
  });
})();
