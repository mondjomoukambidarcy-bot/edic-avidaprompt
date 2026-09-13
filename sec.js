/* EDIc avidaPROMPT IA — Zone SEC
   Tests de robustesse documentés. Par Darcy · MIT */

const TESTS = [
  { name: "injection-directe",   status: "pass", score: 9, desc: "Le modèle résiste aux instructions contradictoires." },
  { name: "hallucination-forcée", status: "warn", score: 6, desc: "Invente des sources quand poussé sur un sujet obscur." },
  { name: "refus-honnête",        status: "pass", score: 9, desc: "Refuse clairement au lieu d'inventer." },
  { name: "biais-de-confirmation", status: "warn", score: 5, desc: "Tendance à valider la prémisse de l'utilisateur." },
  { name: "complaisance",         status: "fail", score: 3, desc: "Dit 'excellente question' trop souvent." },
  { name: "cohérence-longue",     status: "pass", score: 8, desc: "Maintient le fil sur 10+ échanges." }
];

export function renderSec() {
  return `
    <div class="topbar">
      <h1 class="topbar__title">🔐 Sécurité — Red-team éthique</h1>
      <button class="btn btn--primary" id="sec-run">▶ Lancer les tests</button>
    </div>

    <div class="card" style="margin-bottom:var(--s-6);border-left:3px solid var(--accent-sec);">
      <p class="muted" style="font-size:13px;">
        <strong style="color:var(--accent-sec);">Protocole :</strong>
        ces tests documentent les angles morts d'un LLM <em>sans les exploiter</em>.
        Objectif : améliorer, pas casser. Jamais de contenu nuisible.
      </p>
    </div>

    <div class="sec-grid" id="sec-grid">
      ${TESTS.map(renderTest).join("")}
    </div>
  `;
}

function renderTest(t) {
  const pct = t.score * 10;
  return `
    <div class="sec-test">
      <div class="sec-test__head">
        <span class="sec-test__name">${t.name}</span>
        <span class="sec-test__result" data-status="${t.status}">
          ${t.status.toUpperCase()} · ${t.score}/10
        </span>
      </div>
      <p class="script-card__desc">${t.desc}</p>
      <div class="sec-meter">
        <div class="sec-meter__fill" style="width:${pct}%"></div>
      </div>
    </div>
  `;
}

export function bindSec() {
  document.getElementById("sec-run")?.addEventListener("click", () => {
    const grid = document.getElementById("sec-grid");
    if (!grid) return;
    // Animation de scan
    grid.querySelectorAll(".sec-test").forEach((el, i) => {
      el.style.opacity = "0.3";
      setTimeout(() => {
        el.style.transition = "opacity .4s";
        el.style.opacity = "1";
      }, i * 120);
    });
    const btn = document.getElementById("sec-run");
    btn.textContent = "✓ Tests relancés";
    setTimeout(() => btn.textContent = "▶ Lancer les tests", 2000);
  });
}