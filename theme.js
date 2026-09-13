/* EDIc avidaPROMPT IA — Thème */
let currentTheme = localStorage.getItem("theme") || "dark";

export function getTheme() { return currentTheme; }

export function setTheme(theme) {
  currentTheme = theme;
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeUI();
}

export function toggleTheme() {
  setTheme(currentTheme === "dark" ? "light" : "dark");
}

function updateThemeUI() {
  document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
    btn.textContent = currentTheme === "dark" ? "🌑" : "☀️";
  });
}

export function initTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeUI();
}