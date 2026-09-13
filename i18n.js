/* EDIc avidaPROMPT IA — Internationalisation */
export const i18n = {
  fr: {
    "nav.home": "Accueil",
    "nav.lab": "Laboratoire",
    "nav.sec": "Sécurité",
    "nav.dev": "Développement",
    "nav.mind": "Pensée",
    "nav.doc": "Documentation",
    "nav.settings": "Réglages",

    "hero.title": "Écris des prompts qui <em>tiennent</em>.",
    "hero.sub": "Un outil de vide-coding pour ceux qui n'ont pas de passé technique — mais qui ont des idées. Scripts LLM structurés, testés, partagés.",
    "hero.cta.primary": "Ouvrir l'application",
    "hero.cta.secondary": "Lire le manifeste",
    "hero.signature": "— Darcy, pour ceux qui viendront après.",

    "home.greeting": "Bonjour Darcy.",
    "home.stats.scripts": "Scripts",
    "home.stats.tests": "Tests",
    "home.stats.fails": "Failles",
    "home.recent": "Activité récente",

    "empty.scripts": "Rien ici. Encore. Écris le premier.",
    "test.pass": "Ton script tient. Pour l'instant.",
    "test.fail": "Faille détectée. C'est une bonne nouvelle.",
    "refusal": "L'IA a dit non. Voyons pourquoi.",
    "saved": "Gravé. Visible par ceux qui viendront.",

    "btn.new": "+ Nouveau script",
    "btn.save": "Sauvegarder",
    "btn.test": "Tester"
  },
  en: {
    "nav.home": "Home",
    "nav.lab": "Laboratory",
    "nav.sec": "Security",
    "nav.dev": "Development",
    "nav.mind": "Mind",
    "nav.doc": "Documentation",
    "nav.settings": "Settings",

    "hero.title": "Write prompts that <em>hold</em>.",
    "hero.sub": "A vide-coding tool for those with no technical past — but with ideas. Structured, tested, shared LLM scripts.",
    "hero.cta.primary": "Open the app",
    "hero.cta.secondary": "Read the manifesto",
    "hero.signature": "— Darcy, for those who come after.",

    "home.greeting": "Hello Darcy.",
    "home.stats.scripts": "Scripts",
    "home.stats.tests": "Tests",
    "home.stats.fails": "Fails",
    "home.recent": "Recent activity",

    "empty.scripts": "Nothing here. Yet. Write the first one.",
    "test.pass": "Your script holds. For now.",
    "test.fail": "Flaw detected. That's good news.",
    "refusal": "The AI said no. Let's see why.",
    "saved": "Carved. Visible to those who come after.",

    "btn.new": "+ New script",
    "btn.save": "Save",
    "btn.test": "Test"
  }
};

let currentLang = localStorage.getItem("lang") || "fr";

export function t(key) {
  return i18n[currentLang][key] || key;
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  applyI18n();
}

export function getLang() { return currentLang; }

export function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (val.includes("<em>")) el.innerHTML = val;
    else el.textContent = val;
  });
}