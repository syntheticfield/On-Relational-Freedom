/* ============================================================
   SCRIPT.JS — version minimale
   ------------------------------------------------------------
   - navigation entre les 3 vues (home / mindmap / cards)
   - chaque carte = carrousel à 3 volets (glissement horizontal) :
       1. diagramme original (recto)
       2. résumé / questions / keywords (mise en page du site)
       3. page originale du PDF (verso fidèle)
   - grande carte : pan (souris/tactile) + zoom (boutons, ctrl+molette,
     pincement)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------- NAVIGATION ---------------- */
  const views = document.querySelectorAll(".view");
  function goto(viewId) {
    views.forEach(v => v.classList.toggle("active", v.id === "view-" + viewId));
  }
  document.querySelectorAll("[data-goto]").forEach(btn => {
    btn.addEventListener("click", () => goto(btn.dataset.goto));
  });


  /* ---------------- LISTE DES TEXTES (sous la big map) ---------------- */
  const textsListUl = document.getElementById("texts-list-ul");
  if (textsListUl && typeof CARDS !== "undefined") {
    CARDS.forEach(id => {
      const c = CARDS_DATA[id];
      const src = (typeof SOURCES !== "undefined") ? SOURCES[id] : null;
      const li = document.createElement("li");
      li.className = "texts-list-item";
      const href = src && src.pdf ? src.pdf : "#";
      li.innerHTML = `
        <a href="${href}" target="_blank" rel="noopener" class="texts-list-link">
          <span class="texts-list-author">${c.auteur}</span>
          <span class="texts-list-title-text">${c.titre}</span>
          <span class="texts-list-year">${c.annee}</span>
        </a>
      `;
      if (!(src && src.pdf)) li.classList.add("texts-list-item--disabled");
      textsListUl.appendChild(li);
    });
  }

  /* ---------------- GRILLE DE CARTES (carrousel 2 volets) ---------------- */
  const grid = document.getElementById("cards-grid");

  // texte source (résumé + lien vers le pdf) pour le 2e volet de chaque carte
  const FALLBACK_SOURCE = `
    <p class="flip-back-resume">Le texte source de cette carte n'est pas encore disponible.</p>
  `;

  CARDS.forEach((id, i) => {
    const c = CARDS_DATA[id];
    const questionsHtml = c.questions.map(q => `<li>${q}</li>`).join("");
    const src = (typeof SOURCES !== "undefined" && SOURCES[id]) ? SOURCES[id] : null;
    const sourceHtml = src ? src.summary : FALLBACK_SOURCE;
    const pdfLinkHtml = src && src.pdf
      ? `<p class="flip-back-resume"><a class="source-pdf-link" href="${src.pdf}" target="_blank" rel="noopener">→ Lire le texte source (PDF)</a></p>`
      : "";

    const block = document.createElement("div");
    block.className = "card-block";
    block.style.animationDelay = (i * 0.03) + "s";
    block.innerHTML = `
      <div class="card-carousel">
        <div class="card-panel">
          <div class="flip-card">
            <div class="flip-inner">
              <div class="flip-face flip-front">
                <img src="${c.image}" alt="${c.titre} — diagramme">
              </div>
              <div class="flip-face flip-back">
                <img src="assets/images/cards/${id}-text.png" alt="${c.titre} — verso">
              </div>
            </div>
          </div>
        </div>
        <div class="card-panel">
          <div class="source-text">
            <p class="flip-back-author">${c.auteur} — texte source</p>
            <h3 class="flip-back-title">${c.titre} <span style="color:var(--ink-soft); font-size:.7em;">(${c.annee})</span></h3>
            ${sourceHtml}
            ${pdfLinkHtml}
          </div>
        </div>
      </div>
      <div class="card-dots"><span></span><span></span></div>
    `;
    const inner = block.querySelector(".flip-inner");
    inner.addEventListener("click", () => inner.classList.toggle("flipped"));
    grid.appendChild(block);
  });


  /* ---------------- GRANDE CARTE — pan & zoom ---------------- */
  const viewport = document.getElementById("mindmap-viewport");
  const stage    = document.getElementById("mindmap-stage");
  const resetBtn = document.getElementById("mindmap-reset");
  const zoomIn   = document.getElementById("zoom-in");
  const zoomOut  = document.getElementById("zoom-out");

  let scale = 1, x = 0, y = 0;
  const MIN_SCALE = 0.3, MAX_SCALE = 4;
  const STAGE_W = 1400; // doit correspondre à la largeur de référence de l'image

  function applyTransform() {
    stage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }

  function zoomAt(factor, fx, fy) {
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
    x = fx - ((fx - x) / scale) * newScale;
    y = fy - ((fy - y) / scale) * newScale;
    scale = newScale;
    applyTransform();
  }

  function resetView() {
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    scale = Math.min(vw / STAGE_W, 1) || 0.5;
    x = (vw - STAGE_W * scale) / 2;
    y = Math.max(20, (vh - STAGE_W * 0.706 * scale) / 2);
    applyTransform();
  }

  resetBtn.addEventListener("click", resetView);
  window.addEventListener("resize", resetView);

  zoomIn.addEventListener("click", () => {
    const r = viewport.getBoundingClientRect();
    zoomAt(1.25, r.width / 2, r.height / 2);
  });
  zoomOut.addEventListener("click", () => {
    const r = viewport.getBoundingClientRect();
    zoomAt(0.8, r.width / 2, r.height / 2);
  });

  // --- pan (souris + tactile) ---
  let pointers = new Map();
  let lastDist = null;

  function getDistance(p1, p2) { return Math.hypot(p1.x - p2.x, p1.y - p2.y); }
  function getMidpoint(p1, p2) { return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }; }

  viewport.addEventListener("pointerdown", (e) => {
    viewport.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    viewport.classList.add("grabbing");
    if (pointers.size === 2) {
      const [p1, p2] = [...pointers.values()];
      lastDist = getDistance(p1, p2);
    }
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    const prev = pointers.get(e.pointerId);
    const curr = { x: e.clientX, y: e.clientY };
    pointers.set(e.pointerId, curr);

    if (pointers.size === 1) {
      x += curr.x - prev.x;
      y += curr.y - prev.y;
      applyTransform();
    } else if (pointers.size === 2) {
      const [p1, p2] = [...pointers.values()];
      const dist = getDistance(p1, p2);
      const mid  = getMidpoint(p1, p2);
      if (lastDist) {
        const rect = viewport.getBoundingClientRect();
        zoomAt(dist / lastDist, mid.x - rect.left, mid.y - rect.top);
      }
      lastDist = dist;
    }
  });

  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size === 0) viewport.classList.remove("grabbing");
    if (pointers.size < 2) lastDist = null;
  }
  viewport.addEventListener("pointerup", endPointer);
  viewport.addEventListener("pointercancel", endPointer);
  viewport.addEventListener("pointerleave", endPointer);

  // molette : Ctrl/Cmd + molette = zoom ; sinon = défilement (pan)
  viewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    const rect = viewport.getBoundingClientRect();
    if (e.ctrlKey || e.metaKey) {
      zoomAt(e.deltaY < 0 ? 1.1 : 0.9, e.clientX - rect.left, e.clientY - rect.top);
    } else {
      x -= e.deltaX;
      y -= e.deltaY;
      applyTransform();
    }
  }, { passive: false });

  const mmImage = document.getElementById("mindmap-image");
  if (mmImage.complete) resetView();
  mmImage.addEventListener("load", resetView);
  resetView();

});
