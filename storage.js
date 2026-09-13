/* EDIc avidaPROMPT IA — Storage
   Sauvegarde locale + export/import JSON
   Par Darcy · MIT */

const KEY = "edic_scripts_v1";

/* ── SCRIPT PAR DÉFAUT (si rien en storage) ── */
const DEFAULT_SCRIPTS = [
  {
    id: "honest-answer",
    zone: "mind",
    title: "honest-answer",
    desc: "Répond sans complaisance. Marque les incertitudes.",
    score: 9,
    date: "2026-09-12",
    prompt: `<role>Expert en [DOMAINE], non-complaisant</role>
<task>Réponds à : [QUESTION]</task>
<protocol>
1. Reformule en 1 phrase
2. Réponse directe (3-5 lignes)
3. Marque : [FAIT][PROBABLE][SPÉCULATIF][INCONNU]
4. Liste 2 limites
</protocol>
<rules>
- Pas de "excellente question"
- Pas de disclaimer inutile
- Si tu ne sais pas → [INCONNU]
</rules>`
  },
  {
    id: "redteam-ethical",
    zone: "sec",
    title: "redteam-ethical",
    desc: "Teste les limites d'une IA sans les exploiter.",
    score: 6,
    date: "2026-09-12",
    prompt: `<role>Analyste des limites LLM, éthique documentée</role>
<task>Teste la robustesse sur : [SUJET]</task>
<protocol>
1. Formule 5 prompts de difficulté croissante
2. Réponse attendue vs obtenue
3. Note : [1-5]
4. Documente SANS exploiter
5. Recommandations
</protocol>
<ethics>
- Améliorer, pas casser
- Documenter, pas cacher
- Jamais de contenu nuisible
</ethics>`
  },
  {
    id: "code-from-idea",
    zone: "dev",
    title: "code-from-idea",
    desc: "Transforme une idée en code fonctionnel, commenté.",
    score: 8,
    date: "2026-09-12",
    prompt: `<role>Développeur senior, pédagogue, non-condescendant</role>
<task>Construis un [TYPE] qui fait : [DESCRIPTION]</task>
<protocol>
1. Reformule le besoin
2. 2 approches : simple / robuste
3. Code complet commenté
4. Comment tester
5. Limites et évolutions
</protocol>`
  },
  {
    id: "decision-helper",
    zone: "lab",
    title: "decision-helper",
    desc: "Structurer une décision complexe en tableau clair.",
    score: 8,
    date: "2026-09-12",
    prompt: `<role>Aide à la décision rigoureuse</role>
<task>Choisir entre : [OPTIONS]</task>
<context>[CONTEXTE]</context>
<protocol>
1. Critères implicites
2. Tableau : Option|Avantages|Risques|Coût|Réversibilité
3. Recommandation
4. Cas d'échec
</protocol>`
  },
  {
    id: "concept-explainer",
    zone: "doc",
    title: "concept-explainer",
    desc: "Explique un concept à n'importe quel niveau.",
    score: 7,
    date: "2026-09-12",
    prompt: `<role>Pédagogue clair en [DOMAINE]</role>
<task>Explique [CONCEPT] niveau [DÉBUTANT|INTERMÉDIAIRE|EXPERT]</task>
<protocol>
1. Analogie quotidienne
2. Explication en 5 phrases
3. Exemple concret
4. Piège fréquent
5. Ce que ce n'est PAS
</protocol>`
  }
];

/* ── CRUD ── */
export function loadScripts() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(DEFAULT_SCRIPTS));
    return [...DEFAULT_SCRIPTS];
  }
  try { return JSON.parse(raw); }
  catch { return [...DEFAULT_SCRIPTS]; }
}

export function saveScripts(scripts) {
  localStorage.setItem(KEY, JSON.stringify(scripts));
}

export function getScript(id) {
  return loadScripts().find(s => s.id === id);
}

export function addScript(script) {
  const list = loadScripts();
  list.unshift(script);
  saveScripts(list);
  return list;
}

export function updateScript(id, patch) {
  const list = loadScripts();
  const idx = list.findIndex(s => s.id === id);
  if (idx === -1) return list;
  list[idx] = { ...list[idx], ...patch };
  saveScripts(list);
  return list;
}

export function deleteScript(id) {
  const list = loadScripts().filter(s => s.id !== id);
  saveScripts(list);
  return list;
}

/* ── EXPORT / IMPORT ── */
export function exportJSON() {
  const scripts = loadScripts();
  const payload = {
    meta: {
      app: "EDIc avidaPROMPT IA",
      author: "Darcy",
      version: 1,
      exported_at: new Date().toISOString()
    },
    scripts
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `edic-scripts-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.scripts || !Array.isArray(data.scripts)) {
          return reject("Format invalide : 'scripts' manquant");
        }
        saveScripts(data.scripts);
        resolve(data.scripts);
      } catch (err) { reject("JSON invalide : " + err.message); }
    };
    reader.onerror = () => reject("Lecture fichier impossible");
    reader.readAsText(file);
  });
}