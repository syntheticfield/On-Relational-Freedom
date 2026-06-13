/* ============================================================
   FREEDOM.JS — "How Free Are You?"
   ------------------------------------------------------------
   Mini-jeu contemplatif intégré à l'onglet PLAY.
   Pas de score, pas de bonne réponse : un territoire de concepts
   qui se déplacent selon les choix, et qui se referme sur une
   constellation d'auteur·ices + une phrase ambiguë.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("freedom-canvas");
  if (!canvas) return; // pas sur cette page
  const ctx = canvas.getContext("2d");
  const promptEl   = document.getElementById("freedom-prompt");
  const introEl    = document.getElementById("freedom-intro");
  const endingEl   = document.getElementById("freedom-ending");
  const sentenceEl = document.getElementById("freedom-sentence");
  const constellationEl = document.getElementById("freedom-constellation");
  const startBtn   = document.getElementById("freedom-start");
  const replayBtn  = document.getElementById("freedom-replay");
  const playView   = document.getElementById("view-play");

  let W, H;
  function resize() {
    const rect = playView.getBoundingClientRect();
    W = canvas.width  = rect.width;
    H = canvas.height = rect.height;
  }
  window.addEventListener("resize", resize);

  /* ---------------- axes invisibles ---------------- */
  const AXES = [
    "autonomie","solidarite","securite","creativite",
    "controle","egalite","responsabilite","appartenance","complexite"
  ];
  let axisValues = {};
  function resetAxes() { AXES.forEach(a => axisValues[a] = 0); }
  resetAxes();

  function applyDeltas(deltas) {
    for (const k in deltas) {
      axisValues[k] = Math.max(-3, Math.min(3, (axisValues[k] || 0) + deltas[k]));
    }
  }

  /* ---------------- concepts flottants ---------------- */
  const CONCEPTS = [
    { id: "autonomie",      label: "AUTONOMIE",      w: { autonomie: 1 } },
    { id: "communaute",     label: "COMMUNAUTÉ",     w: { appartenance: 1, solidarite: .5 } },
    { id: "desir",          label: "DÉSIR",          w: { creativite: .6, autonomie: .4 } },
    { id: "pouvoir",        label: "POUVOIR",        w: { controle: 1 } },
    { id: "securite",       label: "SÉCURITÉ",       w: { securite: 1, controle: .3 } },
    { id: "solidarite",     label: "SOLIDARITÉ",     w: { solidarite: 1 } },
    { id: "responsabilite", label: "RESPONSABILITÉ", w: { responsabilite: 1 } },
    { id: "surveillance",   label: "SURVEILLANCE",   w: { controle: .7, securite: .5 } },
    { id: "soin",           label: "SOIN",           w: { solidarite: .6, responsabilite: .4 } },
    { id: "conflit",        label: "CONFLIT",        w: { complexite: .5, controle: -.3 } },
    { id: "isolement",      label: "ISOLEMENT",      w: { autonomie: .4, solidarite: -.6 } },
    { id: "egalite",        label: "ÉGALITÉ",        w: { egalite: 1 } },
    { id: "complexite",     label: "COMPLEXITÉ",     w: { complexite: 1 } },
    { id: "creativite",     label: "CRÉATIVITÉ",     w: { creativite: 1 } },
  ];

  let nodes = [];
  function initNodes() {
    nodes = CONCEPTS.map((c, i) => ({
      ...c,
      angle: (i / CONCEPTS.length) * Math.PI * 2 + Math.random()*0.4,
      baseRadius: 110 + Math.random() * 110,
      drift: 0.00025 + Math.random() * 0.0006,
      x: W/2, y: H/2,
      size: 13, alpha: 0.35,
    }));
  }

  function activity(node) {
    let a = 0;
    for (const k in node.w) a += node.w[k] * (axisValues[k] || 0);
    return a;
  }

  /* ---------------- scènes ---------------- */
  const scenes = [
    {
      prompt: "Une société peut-elle avoir trop de liberté ?",
      options: {
        securite:       { autonomie: -0.6, securite: 1 },
        autonomie:      { autonomie: 1, securite: -0.4 },
        responsabilite: { responsabilite: 0.8, controle: -0.3 },
        communaute:     { appartenance: 0.8, autonomie: -0.3 },
      }
    },
    { prompt: null },
    {
      prompt: "Qui devrait décider de ce qui est acceptable ?",
      options: {
        pouvoir:    { controle: 1, autonomie: -0.5 },
        communaute: { appartenance: 0.7, solidarite: 0.5, controle: -0.3 },
        conflit:    { controle: -1, complexite: 0.6 },
        autonomie:  { autonomie: 1, controle: -0.5 },
      }
    },
    {
      prompt: "Un voisin est en difficulté.",
      options: {
        soin:           { solidarite: 0.8, responsabilite: 0.6 },
        responsabilite: { responsabilite: 1 },
        isolement:      { solidarite: -0.8, autonomie: 0.3 },
      }
    },
    { prompt: null },
    {
      prompt: "Un algorithme vous aide à décider.",
      options: {
        surveillance: { controle: 0.8, securite: 0.5, autonomie: -0.4 },
        autonomie:    { autonomie: 0.8, controle: -0.4 },
        complexite:   { complexite: 0.8 },
      }
    },
    {
      prompt: "Le droit de vote n'est pas un toit.",
      options: {
        egalite:  { egalite: 0.8, securite: -0.3 },
        securite: { securite: 0.8, egalite: -0.3 },
        conflit:  { complexite: 0.6, egalite: -0.2, securite: -0.2 },
      }
    },
    { prompt: null },
    {
      prompt: "Les mots que vous employez vous emploient aussi.",
      options: {
        desir:      { creativite: 0.8, autonomie: 0.3 },
        complexite: { complexite: 0.8 },
        communaute: { appartenance: 0.5, solidarite: 0.5 },
      }
    },
    { prompt: null },
  ];

  let sceneIndex = -1;
  let currentScene = null;
  let advanceTimer = null;
  let running = false;
  let rafId = null;

  function nextScene() {
    if (advanceTimer) clearTimeout(advanceTimer);
    sceneIndex++;
    if (sceneIndex >= scenes.length) { endGame(); return; }
    currentScene = scenes[sceneIndex];

    if (currentScene.prompt) {
      promptEl.textContent = currentScene.prompt;
      promptEl.classList.add("visible");
    } else {
      promptEl.classList.remove("visible");
    }

    if (!currentScene.options) {
      const idle = 9000 + Math.random() * 5000;
      advanceTimer = setTimeout(() => {
        promptEl.classList.remove("visible");
        nextScene();
      }, idle);
    }
  }

  function handleNodeClick(node) {
    let deltas = null;
    if (currentScene && currentScene.options && currentScene.options[node.id]) {
      deltas = currentScene.options[node.id];
    } else if (currentScene && !currentScene.options) {
      deltas = {};
      for (const k in node.w) deltas[k] = node.w[k] * 0.35;
    } else {
      return;
    }

    applyDeltas(deltas);

    if (advanceTimer) clearTimeout(advanceTimer);
    promptEl.classList.remove("visible");
    advanceTimer = setTimeout(nextScene, 2600 + Math.random() * 1200);
  }

  /* ---------------- rendu ---------------- */
  function step() {
    const cx = W/2, cy = H/2;

    for (const n of nodes) {
      const a = activity(n);
      const mag = Math.min(1, Math.abs(a) * 0.55);
      n.size = 12 + mag * 30;
      n.alpha = 0.3 + mag * 0.6;

      const targetR = n.baseRadius * (1 - mag * 0.55);
      n.angle += n.drift;
      const dx = cx + Math.cos(n.angle) * targetR;
      const dy = cy + Math.sin(n.angle) * targetR * 0.55;
      n.x += (dx - n.x) * 0.012;
      n.y += (dy - n.y) * 0.012;
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 1;
        const minDist = (a.size + b.size) * 3.2;
        if (dist < minDist) {
          const push = (minDist - dist) * 0.02;
          const ux = dx/dist, uy = dy/dist;
          a.x -= ux*push; a.y -= uy*push;
          b.x += ux*push; b.y += uy*push;
        }
      }
    }

    ctx.clearRect(0, 0, W, H);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (const n of nodes) {
      const highlighted = currentScene && currentScene.options && currentScene.options[n.id];
      ctx.font = `${n.size}px "SF Mono","IBM Plex Mono","Courier New",monospace`;

      if (highlighted) {
        const w = ctx.measureText(n.label).width;
        ctx.save();
        ctx.strokeStyle = "rgba(71,80,214,0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(n.x, n.y, w/2 + 16, n.size/2 + 10, 0, 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = `rgba(46,51,166,${n.alpha})`;
      ctx.fillText(n.label, n.x, n.y);
    }

    if (running) rafId = requestAnimationFrame(step);
  }

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    for (const n of nodes) {
      ctx.font = `${n.size}px "SF Mono","IBM Plex Mono","Courier New",monospace`;
      const w = ctx.measureText(n.label).width;
      const h = n.size;
      if (Math.abs(mx - n.x) < w/2 + 10 && Math.abs(my - n.y) < h/2 + 10) {
        handleNodeClick(n);
        break;
      }
    }
  });

  /* ---------------- fin ---------------- */
  const AUTHORS = [
    { name: "Berlin",  axes: ["autonomie","controle"] },
    { name: "Arendt",  axes: ["appartenance","responsabilite"] },
    { name: "Davis",   axes: ["solidarite","egalite"] },
    { name: "Morin",   axes: ["complexite"] },
    { name: "Bakunin", axes: ["autonomie","controle"] },
    { name: "Steyerl", axes: ["complexite","creativite"] },
    { name: "Lorde",   axes: ["creativite","solidarite"] },
  ];

  const NOUN = {
    autonomie: "l'autonomie", solidarite: "la solidarité",
    securite: "la sécurité", creativite: "la créativité",
    controle: "le contrôle", egalite: "l'égalité",
    responsabilite: "la responsabilité", appartenance: "l'appartenance",
    complexite: "la complexité"
  };
  const TENSION = {
    autonomie: "l'isolement", solidarite: "la dépendance",
    securite: "le contrôle", creativite: "l'instabilité",
    controle: "la défiance", egalite: "l'uniformité",
    responsabilite: "la culpabilité", appartenance: "l'enfermement",
    complexite: "la confusion"
  };

  function endGame() {
    promptEl.classList.remove("visible");

    let primary = AXES[0], primaryVal = 0;
    for (const a of AXES) {
      if (Math.abs(axisValues[a]) > Math.abs(primaryVal)) { primary = a; primaryVal = axisValues[a]; }
    }
    let secondary = null, secondaryVal = 0;
    for (const a of AXES) {
      if (a === primary) continue;
      if (Math.abs(axisValues[a]) > Math.abs(secondaryVal)) { secondary = a; secondaryVal = axisValues[a]; }
    }

    let sentence = `Vous avez recherché ${NOUN[primary]}, et croisé ${TENSION[primary]}.`;
    if (secondary && Math.abs(secondaryVal) > 0.3) {
      sentence += `<br>Quelque part, ${NOUN[secondary]} s'est aussi déplacée.`;
    }
    sentenceEl.innerHTML = sentence;

    const scores = AUTHORS.map(a => {
      let s = 0;
      for (const ax of a.axes) s += Math.abs(axisValues[ax] || 0);
      return s / a.axes.length;
    });
    const max = Math.max(0.3, ...scores);

    constellationEl.innerHTML = "";
    const cx = 200, cy = 150, r = 110;
    const pts = AUTHORS.map((a, i) => {
      const ang = (i / AUTHORS.length) * Math.PI * 2 - Math.PI/2;
      return { x: cx + Math.cos(ang)*r, y: cy + Math.sin(ang)*r, name: a.name, score: scores[i] };
    });

    for (let i = 0; i < pts.length; i++) {
      for (let j = i+1; j < pts.length; j++) {
        const line = document.createElementNS("http://www.w3.org/2000/svg","line");
        line.setAttribute("x1", pts[i].x); line.setAttribute("y1", pts[i].y);
        line.setAttribute("x2", pts[j].x); line.setAttribute("y2", pts[j].y);
        const op = 0.04 + 0.10 * Math.min(pts[i].score, pts[j].score) / max;
        line.setAttribute("stroke", `rgba(46,51,166,${op})`);
        line.setAttribute("stroke-width", "1");
        constellationEl.appendChild(line);
      }
    }

    pts.forEach(p => {
      const op = 0.35 + 0.65 * (p.score / max);
      const circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
      circle.setAttribute("cx", p.x); circle.setAttribute("cy", p.y);
      circle.setAttribute("r", 2 + (p.score/max)*4);
      circle.setAttribute("fill", `rgba(46,51,166,${op})`);
      constellationEl.appendChild(circle);

      const text = document.createElementNS("http://www.w3.org/2000/svg","text");
      text.setAttribute("x", p.x);
      text.setAttribute("y", p.y - 10);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("font-size", "11");
      text.setAttribute("fill", `rgba(46,51,166,${op})`);
      text.textContent = p.name;
      constellationEl.appendChild(text);
    });

    setTimeout(() => endingEl.classList.add("visible"), 600);
  }

  /* ---------------- cycle de vie ---------------- */
  function startGame() {
    resize();
    resetAxes();
    initNodes();
    sceneIndex = -1;
    currentScene = null;
    endingEl.classList.remove("visible");
    introEl.classList.add("hidden");
    if (advanceTimer) clearTimeout(advanceTimer);
    nextScene();
    if (!running) { running = true; step(); }
  }

  startBtn.addEventListener("click", startGame);
  replayBtn.addEventListener("click", startGame);

  // (re)dimensionne et démarre la boucle de rendu (en pause sur l'écran
  // d'intro) chaque fois qu'on arrive sur l'onglet play
  document.querySelector('[data-goto="play"]').addEventListener("click", () => {
    resize();
    if (!running) { running = true; step(); }
  });

  // met en pause la boucle quand on quitte l'onglet play (économie de calcul)
  document.querySelectorAll('[data-goto]:not([data-goto="play"])').forEach(btn => {
    btn.addEventListener("click", () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    });
  });

});