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

  /* ---------------- ACCUEIL : déplier/replier le manifeste ---------------- */
  const introText   = document.getElementById("intro-text");
  const introToggle = document.getElementById("intro-toggle");
  if (introText && introToggle) {
    introToggle.addEventListener("click", () => {
      const expanded = introText.classList.toggle("expanded");
      introToggle.textContent = expanded ? "− réduire" : "+ lire le manifeste";
    });
  }


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
  // Coordonnées en % par rapport à l'image big-map (largeur/hauteur réelles).
  // À AJUSTER : ouvrez assets/images/mindmap/big-map.png, repérez la position
  // de chaque texte sur le diagramme, et indiquez top/left en %.
  const CARD_HOTSPOTS = {
    berlin:     { top: 10, left: 15 },
    wittig:     { top: 10, left: 35 },
    berardi:    { top: 10, left: 55 },
    blanc:      { top: 10, left: 75 },
    kropotkine: { top: 30, left: 15 },
    lonzi:      { top: 30, left: 35 },
    lorde:      { top: 30, left: 55 },
    // ajouter ici les autres cartes (davis, morin, hayles, ...) au fur et à
    // mesure que leurs positions sur la big map sont repérées
  };

  const mmStage = document.getElementById("mindmap-stage");
  Object.entries(CARD_HOTSPOTS).forEach(([id, pos]) => {
    if (!CARDS_DATA[id]) return;
    const hotspot = document.createElement("button");
    hotspot.className = "map-hotspot";
    hotspot.dataset.id = id;
    hotspot.style.top = pos.top + "%";
    hotspot.style.left = pos.left + "%";
    hotspot.setAttribute("aria-label", "Ouvrir la carte : " + CARDS_DATA[id].titre);
    hotspot.title = CARDS_DATA[id].auteur + " — " + CARDS_DATA[id].titre;
    hotspot.addEventListener("click", () => openCard(id));
    mmStage.appendChild(hotspot);
  });

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
      const hotspot = mmStage.querySelector(`.map-hotspot[data-id="${id}"]`);
      if (hotspot) {
        hotspot.classList.add("map-hotspot--highlight");
        setTimeout(() => hotspot.classList.remove("map-hotspot--highlight"), 1400);
      }
    });
  }

  /* ---------------- PLAY : dérive entre les questions des cartes ---------------- */
  const playContext = document.getElementById("play-context");
  const playQuestion = document.getElementById("play-question");
  const playOptions  = document.getElementById("play-options");
  const playTrail    = document.getElementById("play-trail");
  const playRestart  = document.getElementById("play-restart");

  let typeTimer = null;
  const trailHistory = [];

  function allQuestionsOf(id) {
    const c = CARDS_DATA[id];
    return (c && c.questions) ? c.questions : [];
  }

  // pioche une carte voisine qui partage spécifiquement la notion donnée
  function pickCardByNotion(currentId, notion) {
    const candidates = CARDS.filter(id2 =>
      id2 !== currentId &&
      allQuestionsOf(id2).length &&
      (CARDS_DATA[id2].notions || []).includes(notion)
    );
    if (candidates.length) return candidates[Math.floor(Math.random() * candidates.length)];
    return pickLinkedCard(currentId);
  }

  // repli générique : lien direct, ou carte au hasard
  function pickLinkedCard(currentId) {
    const c = CARDS_DATA[currentId];
    if (!c) return currentId;
    const liens = (c.liens || []).filter(l => CARDS_DATA[l] && allQuestionsOf(l).length);
    if (liens.length) return liens[Math.floor(Math.random() * liens.length)];
    const pool = CARDS.filter(id2 => id2 !== currentId && allQuestionsOf(id2).length);
    return pool[Math.floor(Math.random() * pool.length)] || currentId;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // une ligne par notion : la direction conceptuelle vers laquelle on glisse
  // en quittant ce texte — écrit pour ce projet, pas extrait des textes sources
  const NOTION_DRIFT = {
    "liberte-relationnelle": "la liberté circule, elle ne se possède pas.",
    "individu-collectif": "le je se dissout dans un nous incertain.",
    "pouvoir-autorite": "quelque chose commande encore, ailleurs, sous un autre nom.",
    "ordre-chaos": "l'ordre se défait, une forme nouvelle s'esquisse.",
    "pratique-accomplissement": "ce n'est jamais fini, ça recommence autrement.",
    "oppression": "le poids se déplace, il ne disparaît pas.",
    "solidarite": "des mains se rejoignent, ailleurs, sans le savoir.",
    "revolution": "le sol bascule, doucement, puis tout à coup.",
    "corps-collectif": "un souffle commun traverse plusieurs poitrines.",
    "ecriture-diagramme": "les mots se redessinent sur une page blanche.",
    "nature-systeme": "tout est relié, même ce qui semblait seul.",
    "identite": "qui parle, ici, et au nom de qui.",
  };

  // libellés courts affichés sur les boutons, dans l'esprit des noms de
  // notions de la big map — un par notion
  const NOTION_LABEL = {
    "liberte-relationnelle": "liberté relationnelle",
    "individu-collectif": "individu / collectif",
    "pouvoir-autorite": "pouvoir, autorité",
    "ordre-chaos": "ordre, chaos",
    "pratique-accomplissement": "pratique, accomplissement",
    "oppression": "oppression",
    "solidarite": "solidarité",
    "revolution": "révolution",
    "corps-collectif": "corps collectif",
    "ecriture-diagramme": "écriture, diagramme",
    "nature-systeme": "nature, système",
    "identite": "identité",
  };

  // phrases de repli quand aucune notion n'est disponible
  const DRIFT_PHRASES = [
    "quelque chose se déplace, encore tiède.",
    "la pensée change de support.",
    "un autre fil se tend, ailleurs.",
    "ceci aussi pensait, à sa manière.",
    "la question migre, sans bagage.",
    "un courant traverse le papier.",
    "ça continue, sous une autre forme.",
    "la trace reste, le corps change.",
  ];

  function typeWrite(text, el, onDone) {
    if (typeTimer) clearTimeout(typeTimer);
    el.innerHTML = '<span class="play-typed" style="color:var(--ink);opacity:1;"></span><span class="play-cursor">▌</span>';
    const typedEl = el.querySelector(".play-typed");
    let i = 0;
    function step() {
      typedEl.textContent = text.slice(0, i + 1);
      i++;
      if (i < text.length) {
        // rythme irrégulier, plus lent : ~55ms en moyenne, pauses sur la ponctuation
        const c = text[i - 1];
        let delay = 48 + Math.random() * 40;
        if (",;—".includes(c)) delay += 220;
        if (".?!".includes(c)) delay += 420;
        typeTimer = setTimeout(step, delay);
      } else if (onDone) {
        onDone();
      }
    }
    step();
  }

  function showQuestion(cardId, qIndex) {
    const c = CARDS_DATA[cardId];
    const question = c.questions[qIndex];

    trailHistory.push(cardId);
    if (trailHistory.length > 6) trailHistory.shift();
    playTrail.textContent = trailHistory.join(" → ");

    playContext.textContent = `${c.auteur} — ${c.titre}`;
    playOptions.classList.remove("visible");
    playOptions.innerHTML = "";

    typeWrite(question, playQuestion, () => {
      // jusqu'à 3 directions conceptuelles, tirées des notions propres à
      // CE texte — donc différentes selon la carte d'où provient la question
      const notions = shuffle(c.notions || []).slice(0, 3);

      const options = notions.map(notion => ({
        label: NOTION_LABEL[notion] || notion,
        action: () => driftByNotion(cardId, notion)
      }));

      // repli si une carte n'a aucune notion renseignée
      if (!options.length) {
        options.push({ label: "ailleurs", action: () => driftGeneric(cardId) });
      }

      options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "play-option";
        btn.innerHTML = `<span class="play-option-key">→</span><span>${opt.label}</span>`;
        btn.addEventListener("click", opt.action);
        playOptions.appendChild(btn);
      });
      playOptions.classList.add("visible");
    });
  }

  // glisse vers un texte qui partage la notion choisie ; la phrase de
  // transition évoque cette notion précise
  function driftByNotion(cardId, notion) {
    playOptions.classList.remove("visible");
    const nextCard = pickCardByNotion(cardId, notion);
    const phrase = NOTION_DRIFT[notion] || DRIFT_PHRASES[Math.floor(Math.random() * DRIFT_PHRASES.length)];
    playContext.textContent = "";
    typeWrite(phrase, playQuestion, () => {
      const qs = allQuestionsOf(nextCard);
      const nextQ = Math.floor(Math.random() * qs.length);
      setTimeout(() => showQuestion(nextCard, nextQ), 900);
    });
  }

  // repli générique, sans notion identifiée
  function driftGeneric(cardId) {
    playOptions.classList.remove("visible");
    const nextCard = pickLinkedCard(cardId);
    const phrase = DRIFT_PHRASES[Math.floor(Math.random() * DRIFT_PHRASES.length)];
    playContext.textContent = "";
    typeWrite(phrase, playQuestion, () => {
      const qs = allQuestionsOf(nextCard);
      const nextQ = Math.floor(Math.random() * qs.length);
      setTimeout(() => showQuestion(nextCard, nextQ), 900);
    });
  }

  function startGame() {
    trailHistory.length = 0;
    const pool = CARDS.filter(id => allQuestionsOf(id).length);
    const startId = pool[Math.floor(Math.random() * pool.length)];
    const qs = allQuestionsOf(startId);
    showQuestion(startId, Math.floor(Math.random() * qs.length));
  }

  if (playRestart) playRestart.addEventListener("click", startGame);

  // démarre une dérive la première fois qu'on ouvre l'onglet play
  let playStarted = false;
  document.querySelector('[data-goto="play"]').addEventListener("click", () => {
    if (!playStarted && typeof CARDS !== "undefined") {
      playStarted = true;
      startGame();
    }
  });


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