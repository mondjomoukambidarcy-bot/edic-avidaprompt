import { t, setLang, getLang, applyI18n } from "./i18n.js";
import { initTheme, toggleTheme, getTheme } from "./theme.js";
import { loadScripts, addScript, exportJSON, importJSON } from "./storage.js";
import { renderEditor, bindEditor } from "./editor.js";
import { renderSec, bindSec } from "./sec.js";
import { renderMind, openMindScript } from "./mind.js";
window.openMindScript = openMindScript;

/* ═══ ZONES ═══ */
const ZONES = {
  lab:  { fr: "Laboratoire",   en: "Laboratory",  icon: "🧪" },
  sec:  { fr: "Sécurité",      en: "Security",    icon: "🔐" },
  dev:  { fr: "Développement", en: "Development", icon: "⚙️" },
  mind: { fr: "Pensée",        en: "Mind",        icon: "🧠" },
  doc:  { fr: "Documentation", en: "Docs",        icon: "📖" }
};

let currentView = "home";
let currentZone = null;

/* ═══ ROUTEUR ═══ */
function navigate(view, zone = null) {
  currentView = view;
  currentZone = zone;

  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  document.querySelector(`[data-view="${view}"]${zone ? `[data-zone="${zone}"]` : ""}`)?.classList.add("active");

  const main = document.getElementById("main-content");
  if (!main) return;

  if (view === "home")     main.innerHTML = renderHome();
  else if (view === "zone") main.innerHTML = renderZone(zone);
  else if (view === "doc")  main.innerHTML = renderDoc();
  else if (view === "editor") main.innerHTML = renderEditor();
  else if (view === "sec")    main.innerHTML = renderSec();
  else if (view === "mind")   main.innerHTML = renderMind();

  if (view === "editor") bindEditor();
  if (view === "sec")    bindSec();

  applyI18n();
  bindCardClicks();
}

/* ═══ VUES ═══ */
function renderHome() {
  const scripts = loadScripts();
  const total = scripts.length;
  const avg = total ? Math.round(scripts.reduce((a, s) => a + s.score, 0) / total * 10) / 10 : 0;
  return `
    <div class="topbar">
      <h1 class="topbar__title" data-i18n="home.greeting">Bonjour Darcy.</h1>
      <div class="topbar__actions">
        <div class="menu" id="menu-main">
          <button class="btn btn--ghost" data-menu-toggle>⋯ Menu</button>
          <div class="menu__list">
            <button class="menu__item" id="menu-export">⬇ Exporter mes scripts (JSON)</button>
            <label class="menu__item" style="cursor:pointer;">
              ⬆ Importer un fichier
              <input type="file" accept=".json" id="menu-import" style="display:none;">
            </label>
            <a href="#editor" class="menu__item">🧪 Ouvrir l'éditeur</a>
            <a href="#sec" class="menu__item">🔐 Zone Sécurité</a>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-stats">
      <div class="stat">
        <div class="stat__label" data-i18n="home.stats.scripts">Scripts</div>
        <div class="stat__value">${total}</div>
        <div class="stat__delta stat__delta--up">▲ +${total}</div>
      </div>
      <div class="stat">
        <div class="stat__label">Score moyen</div>
        <div class="stat__value">${avg}<span class="dim" style="font-size:16px">/10</span></div>
        <div class="stat__delta stat__delta--up">▲ stable</div>
      </div>
      <div class="stat">
        <div class="stat__label" data-i18n="home.stats.fails">Failles</div>
        <div class="stat__value">12</div>
        <div class="stat__delta stat__delta--down">▼ -2</div>
      </div>
    </div>

    <h2 class="topbar__title" style="font-size:14px;margin-bottom:var(--s-4);" data-i18n="home.recent">Activité récente</h2>
    <div class="grid-cards">
      ${scripts.slice(0, 6).map(renderScriptCard).join("")}
    </div>
  `;
}

function renderZone(zone) {
  const scripts = loadScripts().filter(s => s.zone === zone);
  const z = ZONES[zone];
  const lang = getLang();
  return `
    <div class="topbar">
      <h1 class="topbar__title">${z.icon} ${z[lang]}</h1>
      <button class="btn btn--primary" id="zone-new">+ ${t("btn.new")}</button>
    </div>
    <div class="grid-cards">
      ${scripts.length ? scripts.map(renderScriptCard).join("")
        : `<p class="muted" data-i18n="empty.scripts">Rien ici. Encore. Écris le premier.</p>`}
    </div>
  `;
}

function renderDoc() {
  return `
    <div class="topbar"><h1 class="topbar__title">📖 Manifeste</h1></div>
    <div class="card" style="max-width:720px;line-height:1.8;">
      <p style="margin-bottom:var(--s-4);"><strong>Par Darcy.</strong></p>
      <p style="margin-bottom:var(--s-4);">Je ne suis pas développeur au sens où on l'entend. Je n'ai pas de diplôme, pas de titre, pas de bureau dans la Silicon Valley. Je suis quelqu'un qui a vu une porte — celle du vide-coding — et qui a voulu y laisser une trace utile avant qu'elle ne se referme.</p>
      <p style="margin-bottom:var(--s-4);">Ce projet n'attaque aucune IA. Il ne contourne aucune règle. Il ne cherche pas à manipuler, à tromper, à nuire. Il fait une seule chose : <strong>donner à ceux qui n'ont rien les moyens de créer quelque chose.</strong></p>
      <p style="margin-bottom:var(--s-4);">Un prompt bien écrit est un pont entre une idée et un résultat. Pour beaucoup, ce pont est invisible, technique, réservé. Je veux le rendre visible. Accessible. Libre.</p>
      <p class="mono dim" style="margin-top:var(--s-8);">— Darcy</p>
    </div>
  `;
}

function renderScriptCard(s) {
  return `
    <article class="script-card" data-zone="${s.zone}" data-id="${s.id}">
      <header class="script-card__head">
        <span class="badge" data-zone="${s.zone}">${s.zone.toUpperCase()}</span>
        <span class="script-card__score">${s.score}/10</span>
      </header>
      <h3 class="script-card__title">${s.title}</h3>
      <p class="script-card__desc">${s.desc}</p>
      <footer class="flex between center">
        <span class="script-card__meta">${s.date}</span>
        <span class="script-card__meta">→</span>
      </footer>
    </article>
  `;
}

/* ═══ LIENS CARTES → PAGE DÉTAIL ═══ */
function bindCardClicks() {
  document.querySelectorAll(".script-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      if (id) location.href = `script.html?id=${encodeURIComponent(id)}`;
    });
  });
}

/* ═══ MENU + EXPORT/IMPORT ═══ */
function bindMenu() {
  const menu = document.getElementById("menu-main");
  if (!menu) return;

  document.querySelector("[data-menu-toggle]")?.addEventListener("click", e => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });

  document.addEventListener("click", () => menu.classList.remove("open"));

  document.getElementById("menu-export")?.addEventListener("click", () => {
    exportJSON();
    menu.classList.remove("open");
  });

  document.getElementById("menu-import")?.addEventListener("change", async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await importJSON(file);
      alert("Scripts importés.");
      navigate("home");
    } catch (err) { alert("Erreur : " + err); }
  });
}

/* ═══ INIT ═══ */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  applyI18n();

  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      navigate(item.dataset.view, item.dataset.zone);
      document.getElementById("main-content")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      setLang(btn.dataset.lang);
      document.querySelectorAll("[data-lang]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      navigate(currentView, currentZone);
    });
  });

  document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
    btn.addEventListener("click", () => {
      toggleTheme();
      btn.textContent = getTheme() === "dark" ? "🌑" : "☀️";
    });
  });

  // Hash routing (#editor, #sec)
  function handleHash() {
    const h = location.hash.replace("#", "");
    if (h === "editor") navigate("editor");
    else if (h === "sec") navigate("sec");
    else navigate("home");
  }
  window.addEventListener("hashchange", handleHash);

  // Sauvegarde depuis l'éditeur
  window.addEventListener("edic:save-script", e => {
    addScript(e.detail);
  });

  // Init
  const lang = getLang();
  document.querySelector(`[data-lang="${lang}"]`)?.classList.add("active");
  document.querySelector("[data-theme-toggle]").textContent = getTheme() === "dark" ? "🌑" : "☀️";

  handleHash();
  bindMenu();
});