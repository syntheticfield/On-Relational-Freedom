/* ============================================================
   FREEDOM.JS — "How Free Are You?"
   ------------------------------------------------------------
   Une question s'écrit au centre. Autour d'elle, quelques
   directions de pensée apparaissent, reliées par de fines
   lignes. Toucher une direction fait avancer — sans score,
   sans bonne réponse. À la fin : une constellation d'auteur·ices
   et une phrase ambiguë.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const stage     = document.getElementById("freedom-stage");
  const questionEl = document.getElementById("freedom-question");
  const branchesEl = document.getElementById("freedom-branches");
  const introEl    = document.getElementById("freedom-intro");
  const endingEl   = document.getElementById("freedom-ending");
  const sentenceEl = document.getElementById("freedom-sentence");
  const constellationEl = document.getElementById("freedom-constellation");
  const startBtn   = document.getElementById("freedom-start");
  const replayBtn  = document.getElementById("freedom-replay");

  if (!stage) return; // pas sur cette page

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

  /* ---------------- questions et directions ---------------- */
  const scenes = [
    {
      text: "Une société peut-elle avoir trop de liberté ?",
      options: [
        { label: "limiter certaines libertés",       d: { autonomie: -0.6, securite: 1 } },
        { label: "ne jamais limiter une liberté",    d: { autonomie: 1, securite: -0.4 } },
        { label: "renforcer l'autonomie individuelle", d: { autonomie: 0.8, responsabilite: 0.3 } },
        { label: "renforcer la responsabilité collective", d: { responsabilite: 0.8, appartenance: 0.5 } },
      ]
    },
    {
      text: "Qui devrait décider de ce qui est acceptable ?",
      options: [
        { label: "l'individu",   d: { autonomie: 1, controle: -0.5 } },
        { label: "la communauté", d: { appartenance: 0.7, solidarite: 0.5, controle: -0.3 } },
        { label: "l'État",        d: { controle: 1, autonomie: -0.5 } },
        { label: "personne",      d: { controle: -1, complexite: 0.6 } },
      ]
    },
    {
      text: "Vous avez le droit de voter. Mais vous n'avez pas de logement. Êtes-vous libre ?",
      options: [
        { label: "oui, formellement",  d: { egalite: 0.4, securite: -0.4 } },
        { label: "non, pas vraiment",  d: { egalite: -0.5, securite: 0.5 } },
        { label: "la question est mal posée", d: { complexite: 0.8 } },
      ]
    },
    {
      text: "Un voisin est en difficulté. L'aidez-vous —",
      options: [
        { label: "par devoir",   d: { responsabilite: 1 } },
        { label: "par empathie", d: { solidarite: 0.8, responsabilite: 0.4 } },
        { label: "pas du tout",  d: { solidarite: -0.8, autonomie: 0.3 } },
      ]
    },
    {
      text: "Un algorithme vous aide à prendre les meilleures décisions. Acceptez-vous son aide ?",
      options: [
        { label: "oui, je lui fais confiance", d: { securite: 0.6, controle: 0.6, autonomie: -0.4 } },
        { label: "non, je préfère me tromper seul·e", d: { autonomie: 0.8, controle: -0.4 } },
        { label: "ça dépend de qui l'a conçu", d: { complexite: 0.8, controle: -0.2 } },
      ]
    },
    {
      text: "Peut-on être libre lorsque son identité est imposée par les autres ?",
      options: [
        { label: "non", d: { autonomie: -0.6, controle: 0.4 } },
        { label: "oui, intérieurement", d: { autonomie: 0.6, complexite: 0.4 } },
        { label: "la liberté n'est pas qu'individuelle", d: { appartenance: 0.6, solidarite: 0.4 } },
      ]
    },
    {
      text: "Les mots que vous employez déterminent votre manière de penser. Changez-vous les mots —",
      options: [
        { label: "ou le monde ?", d: { creativite: 0.8, complexite: 0.4 } },
        { label: "les deux à la fois", d: { creativite: 0.5, complexite: 0.5, appartenance: 0.3 } },
        { label: "ni l'un ni l'autre", d: { autonomie: 0.3 } },
      ]
    },
    {
      text: "Si plus personne ne surveillait personne —",
      options: [
        { label: "la confiance grandirait", d: { solidarite: 0.7, controle: -0.7 } },
        { label: "le chaos s'installerait", d: { controle: 0.6, complexite: 0.6 } },
        { label: "rien ne changerait vraiment", d: { complexite: 0.3 } },
      ]
    },
  ];

  let sceneIndex = -1;
  let typeTimer = null;
  let advanceLock = false;

  /* ---------------- machine à écrire ---------------- */
  function typeWrite(text, onDone) {
    if (typeTimer) clearTimeout(typeTimer);
    questionEl.innerHTML = '<span class="freedom-typed"></span><span class="freedom-cursor">▌</span>';
    const typedEl = questionEl.querySelector(".freedom-typed");
    let i = 0;
    function step() {
      typedEl.textContent = text.slice(0, i + 1);
      i++;
      if (i < text.length) {
        const c = text[i - 1];
        let delay = 42 + Math.random() * 38;
        if (",;—".includes(c)) delay += 200;
        if (".?!".includes(c)) delay += 380;
        typeTimer = setTimeout(step, delay);
      } else if (onDone) {
        setTimeout(onDone, 400);
      }
    }
    step();
  }

  /* ---------------- disposition des directions ---------------- */
  function clearBranches() {
    branchesEl.innerHTML = "";
    stage.querySelectorAll(".freedom-option").forEach(el => el.remove());
  }

  function layoutOptions(options) {
    clearBranches();
    const rect = stage.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const n = options.length;
    const radius = Math.min(rect.width, rect.height) * 0.36;

    options.forEach((opt, i) => {
      // éventail sous la question, légèrement décalé
      const spread = Math.PI * 0.62;
      const start = Math.PI/2 - spread/2;
      const angle = n === 1 ? Math.PI/2 : start + (spread * i) / (n - 1);
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius * 0.95;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const midY = cy + (y - cy) * 0.4;
      line.setAttribute("d", `M ${cx} ${cy} Q ${cx} ${midY} ${x} ${y}`);
      line.setAttribute("class", "freedom-branch-line");
      branchesEl.appendChild(line);

      const btn = document.createElement("button");
      btn.className = "freedom-option";
      btn.style.left = x + "px";
      btn.style.top = y + "px";
      btn.textContent = opt.label;
      btn.addEventListener("click", () => chooseOption(opt, line, btn));
      stage.appendChild(btn);

      requestAnimationFrame(() => {
        line.classList.add("visible");
        btn.classList.add("visible");
      });
    });
  }

  function chooseOption(opt, line, btn) {
    if (advanceLock) return;
    advanceLock = true;
    applyDeltas(opt.d);

    // referme discrètement les autres directions
    stage.querySelectorAll(".freedom-option").forEach(el => {
      if (el !== btn) el.classList.remove("visible");
    });
    branchesEl.querySelectorAll(".freedom-branch-line").forEach(el => {
      if (el !== line) el.classList.remove("visible");
    });
    btn.style.color = "var(--accent)";
    btn.style.borderColor = "var(--accent)";

    setTimeout(() => {
      clearBranches();
      advanceLock = false;
      nextScene();
    }, 1100);
  }

  function nextScene() {
    sceneIndex++;
    if (sceneIndex >= scenes.length) { endGame(); return; }
    const scene = scenes[sceneIndex];
    typeWrite(scene.text, () => layoutOptions(scene.options));
  }

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
    clearBranches();
    questionEl.innerHTML = "";

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
    resetAxes();
    clearBranches();
    sceneIndex = -1;
    advanceLock = false;
    endingEl.classList.remove("visible");
    introEl.classList.add("hidden");
    nextScene();
  }

  startBtn.addEventListener("click", startGame);
  replayBtn.addEventListener("click", startGame);

  // redispose les directions si la fenêtre change de taille
  window.addEventListener("resize", () => {
    if (sceneIndex >= 0 && sceneIndex < scenes.length && !advanceLock) {
      const scene = scenes[sceneIndex];
      if (stage.querySelector(".freedom-option")) layoutOptions(scene.options);
    }
  });

});