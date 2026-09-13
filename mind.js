/* EDIc avidaPROMPT IA — Zone MIND
   Raisonnement philosophique assisté. Par Darcy · MIT */

export const MIND_SCRIPTS = [
  {
    id: "socratic",
    title: "socratic-method",
    desc: "Décompose une affirmation en questions jusqu'à ses fondations.",
    score: 9,
    prompt: `<role>Philosophe socratique, bienveillant mais tenace</role>
<task>Décompose cette affirmation : [AFFIRMATION]</task>
<protocol>
1. Reformule l'affirmation en 1 phrase neutre
2. Pose 5 questions qui en testent les fondations
3. Pour chaque question : ce qu'elle révèle
4. Identifie la prémisse cachée
5. Reconnais ce qui reste solide malgré tout
</protocol>
<rules>
- Pas de jugement moral
- Pas de conclusion hâtive
- Si la question est indécidable → dis-le
</rules>`
  },
  {
    id: "paradox-analyzer",
    title: "paradox-analyzer",
    desc: "Analyse un paradoxe sans chercher à le résoudre à tout prix.",
    score: 8,
    prompt: `<role>Logicien et philosophe analytique</role>
<task>Analyse ce paradoxe : [PARADOXE]</task>
<protocol>
1. Formule le paradoxe clairement
2. Décompose ses prémisses une par une
3. Identifie la prémisse qui craque
4. Montre ce que le paradoxe révèle sur la logique
5. Ne cherche PAS à le résoudre — accepte l'aporie
</protocol>`
  },
  {
    id: "decision-ethics",
    title: "decision-ethics",
    desc: "Éclaire une décision éthique sous plusieurs angles.",
    score: 9,
    prompt: `<role>Philosophe moral, multi-perspectives</role>
<task>Décision éthique : [SITUATION]</task>
<protocol>
1. Résume la situation sans jugement
2. Applique 4 grilles :
   - Utilitariste (conséquences)
   - Déontologique (devoirs)
   - Vertus (caractère)
   - Care (relations)
3. Pour chaque : ce qu'elle recommande
4. Là où les grilles s'opposent → c'est le nœud
5. Recommandation prudente, avec réserves
</protocol>
<rules>
- Aucun jugement de valeur personnel
- Reconnais l'incertitude
- Pas de morale toute faite
</rules>`
  },
  {
    id: "thought-experiment",
    title: "thought-experiment",
    desc: "Construit une expérience de pensée pour tester une idée.",
    score: 8,
    prompt: `<role>Philosophe spécialisé en expériences de pensée</role>
<task>Teste cette idée : [IDÉE]</task>
<protocol>
1. Reformule l'idée en 1 phrase
2. Construis 3 expériences de pensée qui la testent
3. Pour chaque : ce qu'elle révèle
4. Identifie la plus dérangeante
5. Ce que ça change pour l'idée de départ
</protocol>`
  },
  {
    id: "concept-map",
    title: "concept-mapper",
    desc: "Cartographie un concept et ses voisins.",
    score: 7,
    prompt: `<role>Cartographe conceptuel</role>
<task>Cartographie : [CONCEPT]</task>
<protocol>
1. Définis en 1 phrase
2. Liste 5 concepts voisins (et pourquoi)
3. Liste 3 concepts opposés (et pourquoi)
4. Identifie la frontière floue
5. Nomme un concept que tu ne sais PAS placer
</protocol>`
  },
  {
    id: "steelman",
    title: "steelman-argument",
    desc: "Construit le meilleur argument contre une position.",
    score: 9,
    prompt: `<role>Avocat du diable rigoureux</role>
<task>Position à contrer : [POSITION]</task>
<protocol>
1. Résume la position dans sa version la plus charitable
2. Construis l'argument le plus FORT contre elle
3. Anticipe les 3 meilleures réponses à cet argument
4. Réponds à ces réponses
5. Reconnais ce qui reste indéfendable dans la position
</protocol>
<rules>
- Aucune caricature
- Aucune attaque personnelle
- Le but est la clarté, pas la victoire
</rules>`
  }
];

export function renderMind() {
  return `
    <div class="topbar">
      <h1 class="topbar__title">🧠 Pensée — Raisonnement philosophique</h1>
      <div class="topbar__actions">
        <span class="badge" data-zone="mind">MIND</span>
      </div>
    </div>

    <div class="card" style="margin-bottom:24px;border-left:3px solid var(--accent-mind);">
      <p class="muted" style="font-size:13px;">
        <strong style="color:var(--accent-mind);">Zone MIND :</strong>
        scripts de raisonnement, décision, paradoxes et expériences de pensée.
        L'objectif n'est pas de conclure — c'est de <em>mieux voir</em>.
      </p>
    </div>

    <div class="grid-cards">
      ${MIND_SCRIPTS.map(s => `
        <article class="script-card" data-zone="mind" data-id="${s.id}">
          <header class="script-card__head">
            <span class="badge" data-zone="mind">MIND</span>
            <span class="script-card__score">${s.score}/10</span>
          </header>
          <h3 class="script-card__title">${s.title}</h3>
          <p class="script-card__desc">${s.desc}</p>
          <footer class="flex between center">
            <span class="script-card__meta">🧠 raisonnement</span>
            <button class="btn btn--ghost" style="padding:6px 12px;font-size:11px;" onclick="openMindScript('${s.id}')">→</button>
          </footer>
        </article>
      `).join("")}
    </div>
  `;
}

export function openMindScript(id) {
  const s = MIND_SCRIPTS.find(x => x.id === id);
  if (!s) return;
  const w = window.open("", "_blank");
  w.document.write(`
    <html><head><title>${s.title}</title>
    <style>
      body{font-family:monospace;background:#0A0E1A;color:#E8ECF1;padding:40px;line-height:1.7;max-width:800px;margin:auto;}
      h1{color:#F59E0B;font-size:20px;}
      pre{background:#131826;border:1px solid #232A3D;border-radius:10px;padding:20px;white-space:pre-wrap;font-size:13px;}
      button{background:#F59E0B;color:#000;border:none;padding:10px 20px;border-radius:8px;font-family:monospace;cursor:pointer;font-weight:600;}
      button:hover{opacity:.85;}
    </style></head><body>
      <h1>🧠 ${s.title}</h1>
      <p style="color:#8B93A7;">${s.desc}</p>
      <pre id="p">${s.prompt.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</pre>
      <button onclick="navigator.clipboard.writeText(document.getElementById('p').innerText);this.textContent='✓ Copié'">📋 Copier le prompt</button>
    </body></html>
  `);
}