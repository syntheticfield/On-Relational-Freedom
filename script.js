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
  const tabbarItems = document.querySelectorAll(".tabbar-item");
  function goto(viewId) {
    views.forEach(v => v.classList.toggle("active", v.id === "view-" + viewId));
    tabbarItems.forEach(b => b.classList.toggle("active", b.dataset.goto === viewId));
  }
  document.querySelectorAll("[data-goto]").forEach(btn => {
    btn.addEventListener("click", () => goto(btn.dataset.goto));
  });
  goto("home");

  /* ---------------- ACCUEIL : texte intégral, plus de toggle ---------------- */


  /* ---------------- LISTE DES TEXTES (sous la big map) ---------------- */
  const textsListUl = document.getElementById("texts-list-ul");
  if (textsListUl && typeof CARDS !== "undefined") {
    CARDS.forEach(id => {
      const c = CARDS_DATA[id];
      const src = (typeof SOURCES !== "undefined") ? SOURCES[id] : null;
      const li = document.createElement("li");
      li.className = "texts-list-item";
      li.dataset.id = id;
      const href = src && src.pdf ? src.pdf : "#";
      li.innerHTML = `
        <a href="${href}" target="_blank" rel="noopener" class="texts-list-link">
          <span class="texts-list-author">${c.auteur}</span>
          <span class="texts-list-title-text">${c.titre}</span>
          <span class="texts-list-year">${c.annee}</span>
        </a>
      `;
      if (!(src && src.pdf)) li.classList.add("texts-list-item--disabled");

      // survol synchronisé : passer la souris sur une entrée de la liste
      // surligne le point correspondant sur la big map, et inversement
      const link = li.querySelector(".texts-list-link");
      const syncOn  = () => {
        li.classList.add("highlight");
        const hs = document.querySelector(`.map-hotspot[data-id="${id}"]`);
        if (hs) hs.classList.add("map-hotspot--highlight");
      };
      const syncOff = () => {
        li.classList.remove("highlight");
        const hs = document.querySelector(`.map-hotspot[data-id="${id}"]`);
        if (hs) hs.classList.remove("map-hotspot--highlight");
      };
      link.addEventListener("pointerenter", syncOn);
      link.addEventListener("pointerleave", syncOff);
      link.addEventListener("focus", syncOn);
      link.addEventListener("blur", syncOff);

      // en mode calibration, cliquer une entrée la désigne comme "à placer"
      link.addEventListener("click", (e) => {
        if (!calibrateMode) return;
        e.preventDefault();
        setCalibrateTarget(id);
      });

      textsListUl.appendChild(li);
    });
  }

  /* ---------------- GRANDE CARTE — pan & zoom (déclarations) ---------------- */
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

  /* ---------------- HOTSPOTS BIG MAP -> CARTES ---------------- */
  // Coordonnées en % par rapport à l'image big-map. Valeurs par défaut
  // (provisoires) — utilisez le mode calibration (bouton 📍 dans l'en-tête
  // de la big map) pour les repositionner précisément en cliquant
  // directement sur votre image : les positions sont alors sauvegardées
  // dans le navigateur (localStorage).
  const DEFAULT_HOTSPOTS = {
    // colonne haute / droite
    lorde:      { top: 9.0, left: 89.5 },
    wittig:     { top: 16.0, left: 84.0 },
    hayles:     { top: 13.0, left: 41.0 },
    newton:     { top: 20.0, left: 62.0 },
    drucker:    { top: 26.0, left: 41.0 },
    boss:       { top: 30.0, left: 23.0 },

    // colonne droite (descendante)
    berardi:    { top: 28.5, left: 69.5 },
    davis:      { top: 31.5, left: 77.0 },
    arendt:     { top: 35.0, left: 77.0 },
    blanc:      { top: 38.5, left: 77.0 },
    berlin:     { top: 44.0, left: 84.1 },
    combahee:   { top: 47.5, left: 85.1 },
    lonzi:      { top: 51.0, left: 85.1 },

    // bas-gauche
    guell:      { top: 56.0, left: 15.5 },
    steyerl:    { top: 60.0, left: 45.5 },
    bakunin:    { top: 62.0, left: 29.5 },
    kropotkine: { top: 71.8, left: 56.5 },

    // non identifié sur le diagramme fourni — placeholder, à ajuster avec 📍
    morin:      { top: 76.6, left: 64.6 },
  };

  const HOTSPOTS_KEY = "onfreedom_hotspot_positions";
  function loadHotspotOverrides() {
    try { return JSON.parse(localStorage.getItem(HOTSPOTS_KEY)) || {}; }
    catch { return {}; }
  }
  function saveHotspotOverrides(overrides) {
    localStorage.setItem(HOTSPOTS_KEY, JSON.stringify(overrides));
  }

  const CARD_HOTSPOTS = { ...DEFAULT_HOTSPOTS, ...loadHotspotOverrides() };

  const mmStage = document.getElementById("mindmap-stage");

  function renderHotspots() {
    mmStage.querySelectorAll(".map-hotspot").forEach(el => el.remove());
    Object.entries(CARD_HOTSPOTS).forEach(([id, pos]) => {
      if (!CARDS_DATA[id]) return;
      const hotspot = document.createElement("button");
      hotspot.className = "map-hotspot";
      hotspot.dataset.id = id;
      hotspot.style.top = pos.top + "%";
      hotspot.style.left = pos.left + "%";
      hotspot.setAttribute("aria-label", "Ouvrir la carte : " + CARDS_DATA[id].titre);
      hotspot.title = CARDS_DATA[id].auteur + " — " + CARDS_DATA[id].titre;
      hotspot.addEventListener("click", () => { if (!calibrateMode) openCard(id); });

      // survol synchronisé : surligne l'entrée correspondante dans la liste
      hotspot.addEventListener("pointerenter", () => {
        const li = document.querySelector(`#texts-list-ul li[data-id="${id}"]`);
        if (li) li.classList.add("highlight");
      });
      hotspot.addEventListener("pointerleave", () => {
        const li = document.querySelector(`#texts-list-ul li[data-id="${id}"]`);
        if (li) li.classList.remove("highlight");
      });

      mmStage.appendChild(hotspot);
    });
    // les marqueurs "déjà visité" (mémoire de chemin) passent sous les hotspots
    getVisited().forEach(renderTrailDot);
  }

  /* ---------------- MODE CALIBRATION : placer les points sur la big map ---------------- */
  const calibrateBtn = document.getElementById("calibrate-btn");
  let calibrateMode = false;
  let calibrateTargetId = null;

  function setCalibrateTarget(id) {
    calibrateTargetId = id;
    document.querySelectorAll("#texts-list-ul li").forEach(li =>
      li.classList.toggle("selected", li.dataset.id === id)
    );
    const c = CARDS_DATA[id];
    coordReadout.textContent = `📍 placer : ${c.auteur} — ${c.titre}`;
  }

  function nextCalibrateTarget() {
    const idx = CARDS.indexOf(calibrateTargetId);
    const next = CARDS[(idx + 1) % CARDS.length];
    setCalibrateTarget(next);
  }

  if (calibrateBtn) {
    calibrateBtn.addEventListener("click", () => {
      calibrateMode = !calibrateMode;
      calibrateBtn.classList.toggle("active", calibrateMode);
      if (calibrateMode) {
        setCalibrateTarget(CARDS[0]);
      } else {
        document.querySelectorAll("#texts-list-ul li.selected").forEach(li => li.classList.remove("selected"));
        coordReadout.textContent = "x: 00 · y: 00";
      }
    });
  }

  function openCard(id) {
    markVisited(id);
    traceCardPath(CARD_HOTSPOTS[id], () => {
      goto("cards");
      requestAnimationFrame(() => {
        const target = document.getElementById("card-" + id);
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add("card-block--highlight");
        setTimeout(() => target.classList.remove("card-block--highlight"), 1400);
      });
    });
  }

  // dessine une ligne pointillée animée depuis le hotspot cliqué jusqu'au
  // bord de l'écran, façon "scan" / trace de circuit, avant de changer de vue
  function traceCardPath(pos, onDone, direction = "out") {
    const rect = viewport.getBoundingClientRect();
    const stageX = (pos.left / 100) * STAGE_W;
    const stageY = (pos.top  / 100) * (STAGE_W * 0.706);
    const hotX = x + stageX * scale;
    const hotY = y + stageY * scale;

    let startX, startY, endX, endY;
    if (direction === "in") {
      startX = 0; startY = hotY;
      endX = hotX; endY = hotY;
    } else {
      startX = hotX; startY = hotY;
      endX = rect.width; endY = hotY;
    }

    const overlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    overlay.setAttribute("class", "path-trace-overlay");
    overlay.setAttribute("width", rect.width);
    overlay.setAttribute("height", rect.height);

    const dist = Math.hypot(endX - startX, endY - startY);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.setAttribute("class", "path-trace-line");
    line.style.strokeDasharray = dist;
    line.style.strokeDashoffset = dist;

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", startX);
    dot.setAttribute("cy", startY);
    dot.setAttribute("r", 4);
    dot.setAttribute("class", "path-trace-dot");

    overlay.appendChild(line);
    overlay.appendChild(dot);
    viewport.appendChild(overlay);

    // déclenche l'animation au prochain frame
    requestAnimationFrame(() => {
      line.style.transition = "stroke-dashoffset .45s linear";
      line.style.strokeDashoffset = "0";
      dot.style.transition = `transform .45s linear`;
      dot.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
    });

    setTimeout(() => {
      overlay.remove();
      if (onDone) onDone();
    }, 460);
  }

  /* ---------------- COMPTEUR DE COORDONNÉES ---------------- */
  // fonctionne aussi bien au doigt qu'à la souris : pointermove est déclenché
  // par les deux. On affiche la position dans le repère du "stage" (la big
  // map), en %, façon coordonnées de carte.
  const coordReadout = document.getElementById("coord-readout");
  function updateCoordReadout(clientX, clientY) {
    const rect = viewport.getBoundingClientRect();
    const stageX = (clientX - rect.left - x) / scale;
    const stageY = (clientY - rect.top  - y) / scale;
    const pctX = Math.round((stageX / STAGE_W) * 100);
    const pctY = Math.round((stageY / (STAGE_W * 0.706)) * 100);
    coordReadout.textContent = `x: ${String(pctX).padStart(2,"0")} · y: ${String(pctY).padStart(2,"0")}`;
  }
  viewport.addEventListener("pointermove", (e) => updateCoordReadout(e.clientX, e.clientY));
  viewport.addEventListener("pointerdown", (e) => updateCoordReadout(e.clientX, e.clientY));

  /* ---------------- MÉMOIRE DU CHEMIN PARCOURU ---------------- */
  // sur mobile il n'y a pas de "trace de souris" persistante : on garde donc
  // la liste des textes déjà ouverts depuis la big map (localStorage), et on
  // affiche un petit marqueur permanent, plus discret que le hotspot, sur
  // chaque point déjà visité.
  const VISITED_KEY = "onfreedom_visited_hotspots";
  function getVisited() {
    try { return new Set(JSON.parse(localStorage.getItem(VISITED_KEY)) || []); }
    catch { return new Set(); }
  }
  function markVisited(id) {
    const v = getVisited();
    v.add(id);
    localStorage.setItem(VISITED_KEY, JSON.stringify([...v]));
    renderTrailDot(id);
  }
  function renderTrailDot(id) {
    if (mmStage.querySelector(`.map-trail-dot[data-id="${id}"]`)) return;
    const pos = CARD_HOTSPOTS[id];
    if (!pos) return;
    const dot = document.createElement("div");
    dot.className = "map-trail-dot";
    dot.dataset.id = id;
    dot.style.top = pos.top + "%";
    dot.style.left = pos.left + "%";
    mmStage.insertBefore(dot, mmStage.firstChild.nextSibling); // sous les hotspots
  }
  getVisited().forEach(renderTrailDot);

  function centerOnMap(id) {
    const pos = CARD_HOTSPOTS[id];
    if (!pos) { goto("mindmap"); return; }
    goto("mindmap");
    const stageX = (pos.left / 100) * STAGE_W;
    const stageY = (pos.top  / 100) * (STAGE_W * 0.706);
    requestAnimationFrame(() => {
      const rect = viewport.getBoundingClientRect();
      scale = Math.max(scale, 1.1);
      x = rect.width  / 2 - stageX * scale;
      y = rect.height / 2 - stageY * scale;
      applyTransform();
      traceCardPath(pos, null, "in");
      const hotspot = document.querySelector(`.map-hotspot[data-id="${id}"]`);
      if (hotspot) {
        hotspot.classList.add("map-hotspot--highlight");
        setTimeout(() => hotspot.classList.remove("map-hotspot--highlight"), 1400);
      }
    });
  }


  const grid = document.getElementById("cards-grid");

  CARDS.forEach((id, i) => {
    const c = CARDS_DATA[id];
    const questionsHtml = c.questions.map(q => `<li>${q}</li>`).join("");

    const hasHotspot = !!CARD_HOTSPOTS[id];
    const backToMapHtml = hasHotspot
      ? `<button class="card-back-to-map" data-card-id="${id}">⌖ voir sur la carte</button>`
      : "";
    const counterHtml = `<span class="card-counter">${String(i + 1).padStart(2,"0")} / ${String(CARDS.length).padStart(2,"0")}</span>`;

    const block = document.createElement("div");
    block.className = "card-block";
    block.id = "card-" + id;
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
      </div>
      <div class="card-footer">
        ${counterHtml}
        ${backToMapHtml}
      </div>
    `;
    const inner = block.querySelector(".flip-inner");
    inner.addEventListener("click", () => inner.classList.toggle("flipped"));
    const backBtn = block.querySelector(".card-back-to-map");
    if (backBtn) backBtn.addEventListener("click", () => centerOnMap(id));
    grid.appendChild(block);
  });


  /* ---------------- GRANDE CARTE — pan & zoom (listeners) ---------------- */
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
    if (e.target.closest(".map-hotspot")) return; // laisser le clic du hotspot passer

    if (calibrateMode) {
      const rect = viewport.getBoundingClientRect();
      const stageX = (e.clientX - rect.left - x) / scale;
      const stageY = (e.clientY - rect.top  - y) / scale;
      const pctLeft = Math.max(0, Math.min(100, (stageX / STAGE_W) * 100));
      const pctTop  = Math.max(0, Math.min(100, (stageY / (STAGE_W * 0.706)) * 100));
      CARD_HOTSPOTS[calibrateTargetId] = { top: +pctTop.toFixed(1), left: +pctLeft.toFixed(1) };
      const overrides = loadHotspotOverrides();
      overrides[calibrateTargetId] = CARD_HOTSPOTS[calibrateTargetId];
      saveHotspotOverrides(overrides);
      renderHotspots();
      nextCalibrateTarget();
      return; // pas de pan en mode calibration
    }

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

  renderHotspots();

  const mmImage = document.getElementById("mindmap-image");
  if (mmImage.complete) resetView();
  mmImage.addEventListener("load", resetView);
  resetView();

});