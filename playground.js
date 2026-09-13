/* EDIc avidaPROMPT IA — Playground
   Test de prompts en direct. Clé stockée localement. Par Darcy · MIT */

const KEY_STORAGE = "edic_api_key";
const PROVIDER_STORAGE = "edic_provider";

const PROVIDERS = {
  groq: {
    name: "Groq (gratuit, rapide)",
    url: "https://api.groq.com/openai/v1/chat/completions",
    headers: (k) => ({ "Content-Type": "application/json", "Authorization": "Bearer " + k }),
    body: (p) => ({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: p }], temperature: 0.7 }),
    parse: (d) => d.choices?.[0]?.message?.content || "(vide)"
  },
  gemini: {
    name: "Gemini (gratuit)",
    url: (k) => "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" + k,
    headers: () => ({ "Content-Type": "application/json" }),
    body: (p) => ({ contents: [{ parts: [{ text: p }] }] }),
    parse: (d) => d.candidates?.[0]?.content?.parts?.[0]?.text || "(vide)"
  },
  mistral: {
    name: "Mistral (gratuit)",
    url: "https://api.mistral.ai/v1/chat/completions",
    headers: (k) => ({ "Content-Type": "application/json", "Authorization": "Bearer " + k }),
    body: (p) => ({ model: "mistral-small-latest", messages: [{ role: "user", content: p }] }),
    parse: (d) => d.choices?.[0]?.message?.content || "(vide)"
  },
  openai: {
    name: "OpenAI (payant)",
    url: "https://api.openai.com/v1/chat/completions",
    headers: (k) => ({ "Content-Type": "application/json", "Authorization": "Bearer " + k }),
    body: (p) => ({ model: "gpt-4o-mini", messages: [{ role: "user", content: p }], temperature: 0.7 }),
    parse: (d) => d.choices?.[0]?.message?.content || "(vide)"
  },
  anthropic: {
    name: "Anthropic Claude (payant)",
    url: "https://api.anthropic.com/v1/messages",
    headers: (k) => ({
      "Content-Type": "application/json",
      "x-api-key": k,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    }),
    body: (p) => ({ model: "claude-3-5-sonnet-20241022", max_tokens: 1024, messages: [{ role: "user", content: p }] }),
    parse: (d) => d.content?.[0]?.text || "(vide)"
  }
};

export function renderPlayground() {
  const saved = localStorage.getItem(PROVIDER_STORAGE) || "groq";
  const hasKey = !!localStorage.getItem(KEY_STORAGE);
  const opts = Object.entries(PROVIDERS).map(([id, p]) =>
    '<option value="' + id + '"' + (id === saved ? " selected" : "") + ">" + p.name + "</option>"
  ).join("");

  return `
    <div class="topbar">
      <h1 class="topbar__title">🎮 Playground</h1>
      <span class="badge" data-zone="dev">${hasKey ? "CLÉ ENREGISTRÉE" : "SANS CLÉ"}</span>
    </div>

    <div class="card" style="margin-bottom:24px;border-left:3px solid var(--accent-dev);">
      <p class="muted" style="font-size:13px;margin-bottom:12px;">
        <strong style="color:var(--accent-dev);">Votre clé reste dans votre navigateur.</strong>
        Elle n'est jamais envoyée à GitHub. Chaque utilisateur met la sienne.
      </p>
      <p class="dim" style="font-size:11px;font-family:var(--font-mono);">
        Recommandé : <strong>Groq</strong> (gratuit) → console.groq.com ·
        <strong>Gemini</strong> (gratuit) → aistudio.google.com ·
        <strong>Mistral</strong> (gratuit) → console.mistral.ai
      </p>
    </div>

    <div class="grid-cards" style="grid-template-columns:1fr;gap:16px;">

      <div class="card">
        <label class="stat__label" style="display:block;margin-bottom:8px;">Fournisseur</label>
        <select id="pg-provider" class="input" style="margin-bottom:16px;">${opts}</select>

        <label class="stat__label" style="display:block;margin-bottom:8px;">Clé API</label>
        <input id="pg-key" type="password" class="input" placeholder="Collez votre clé ici..."
               value="${localStorage.getItem(KEY_STORAGE) || ""}" style="margin-bottom:16px;">

        <div style="display:flex;gap:8px;">
          <button class="btn btn--ghost" id="pg-save" style="font-size:12px;">💾 Enregistrer la clé</button>
          <button class="btn btn--ghost" id="pg-clear" style="font-size:12px;">🗑 Effacer</button>
        </div>
      </div>

      <div class="card">
        <label class="stat__label" style="display:block;margin-bottom:8px;">Votre prompt</label>
        <textarea id="pg-prompt" class="textarea" rows="10"
          placeholder="Collez un script de la bibliothèque ou écrivez le vôtre..."
          style="margin-bottom:16px;resize:vertical;"></textarea>
        <button class="btn btn--primary" id="pg-run" style="width:100%;justify-content:center;">▶ Exécuter</button>
      </div>

      <div class="preview" style="max-height:none;">
        <div class="preview__head">
          <span class="preview__title" id="pg-status">En attente</span>
          <span class="script-card__meta" id="pg-time"></span>
        </div>
        <div class="preview__body" id="pg-output" style="min-height:200px;color:var(--text-muted);">
          La réponse apparaîtra ici.
        </div>
      </div>

    </div>
  `;
}

export function bindPlayground() {
  const $ = (id) => document.getElementById(id);

  $("pg-save")?.addEventListener("click", () => {
    const key = $("pg-key").value.trim();
    const prov = $("pg-provider").value;
    if (!key) return alert("Clé vide");
    localStorage.setItem(KEY_STORAGE, key);
    localStorage.setItem(PROVIDER_STORAGE, prov);
    $("pg-status").textContent = "Clé enregistrée ✓";
    setTimeout(() => $("pg-status").textContent = "En attente", 2000);
  });

  $("pg-clear")?.addEventListener("click", () => {
    if (!confirm("Effacer la clé du navigateur ?")) return;
    localStorage.removeItem(KEY_STORAGE);
    $("pg-key").value = "";
    $("pg-status").textContent = "Clé effacée";
  });

  $("pg-run")?.addEventListener("click", runPrompt);
}

async function runPrompt() {
  const $ = (id) => document.getElementById(id);
  const provId = $("pg-provider").value;
  const prov = PROVIDERS[provId];
  const key = localStorage.getItem(KEY_STORAGE) || $("pg-key").value.trim();
  const prompt = $("pg-prompt").value.trim();

  if (!key) return alert("Enregistrez d'abord une clé API");
  if (!prompt) return alert("Écrivez un prompt");

  $("pg-status").textContent = "En cours...";
  $("pg-output").textContent = "⌛ Génération...";
  $("pg-time").textContent = "";
  const t0 = Date.now();

  try {
    const url = typeof prov.url === "function" ? prov.url(key) : prov.url;
    const res = await fetch(url, {
      method: "POST",
      headers: prov.headers(key),
      body: JSON.stringify(prov.body(prompt))
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "HTTP " + res.status);

    $("pg-output").textContent = prov.parse(data);
    $("pg-status").textContent = "✓ Réponse";
    $("pg-time").textContent = ((Date.now() - t0) / 1000).toFixed(1) + "s";
  } catch (err) {
    $("pg-output").textContent = "❌ Erreur : " + err.message;
    $("pg-status").textContent = "Échec";
  }
}