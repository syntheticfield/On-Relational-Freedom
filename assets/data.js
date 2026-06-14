/* ============================================================
   DATA.JS
   ------------------------------------------------------------
   Toutes les cartes et notions de l'édition sont définies ici.
   C'est le fichier le plus simple à modifier : pas besoin de
   toucher au HTML pour changer un texte ou ajouter une carte.

   STRUCTURE D'UNE CARTE :
   {
     id:        identifiant unique (sans espace, sans accent)
     auteur:    nom de l'auteur·ice
     titre:     titre du texte
     annee:     année / date
     motsClefs: tableau de mots-clés (affichés comme tags)
     image:     chemin de l'image RECTO de la carte (diagramme)
                -> à placer dans assets/images/cards/
     resume:    texte de présentation (verso de la carte)
     questions: tableau de questions ouvertes liées au texte
     notions:   tableau d'identifiants de notions (voir plus bas)
                -> sert à tisser les liens "notion liée"
     liens:     tableau d'ids d'autres cartes
                -> sert pour "texte lié" / "continuer vers..."
   }

   Pour ajouter une carte :
   1. copier un bloc { ... } existant
   2. changer l'id (unique !)
   3. remplir les champs
   4. ajouter son id dans le tableau CARDS plus bas
   5. déposer l'image dans assets/images/cards/

   ============================================================ */


/* ------------------------------------------------------------
   NOTIONS — les concepts-clés de la grande mind map.
   Chaque notion peut avoir une courte définition / amorce,
   utilisée dans la vue "notion liée".
   ------------------------------------------------------------ */
const NOTIONS = {
  "liberte-relationnelle": {
    nom: "Liberté relationnelle",
    texte: "La liberté n'existe que dans un réseau de relations : elle ne peut être pleine que si les conditions qui permettent d'agir existent aussi pour les autres."
  },
  "individu-collectif": {
    nom: "Individu vs Collectif",
    texte: "Une tension traverse l'édition entre l'émancipation individuelle et la construction d'un projet commun, d'une lutte partagée."
  },
  "pouvoir-autorite": {
    nom: "Pouvoir / Autorité",
    texte: "Comment l'autorité se construit, se justifie, se conteste — et comment elle peut, parfois, se travestir en libération."
  },
  "ordre-chaos": {
    nom: "Ordre / Chaos",
    texte: "Entre organisation et désordre, entre structure imposée et réorganisation depuis le bas."
  },
  "pratique-accomplissement": {
    nom: "Liberté comme pratique vs accomplissement",
    texte: "La liberté est-elle un état atteint une fois pour toutes, ou un exercice à renouveler sans cesse ?"
  },
  "oppression": {
    nom: "Oppression",
    texte: "Les systèmes — racisme, patriarcat, capitalisme, colonialisme — qui limitent la liberté de certain·es pour préserver celle d'autres."
  },
  "solidarite": {
    nom: "Solidarité",
    texte: "La coopération comme condition de survie et de transformation, plutôt que la concurrence."
  },
  "revolution": {
    nom: "Révolution",
    texte: "Le moment de rupture — ses conditions, ses formes, et ce qu'il laisse advenir : stabilité ou retour à l'ordre ancien."
  },
  "corps-collectif": {
    nom: "Corps collectif",
    texte: "Le corps — individuel, social, politique — comme lieu de résistance, d'expression et de réactivation du sensible."
  },
  "ecriture-diagramme": {
    nom: "Écriture / Diagramme",
    texte: "Le texte comme espace visuel : la disposition, la forme, la matérialité des mots produisent du sens."
  },
  "nature-systeme": {
    nom: "Nature / Système",
    texte: "Penser le vivant, la société et la technique comme des systèmes interdépendants, traversés de flux et d'incertitudes."
  },
  "identite": {
    nom: "Identité",
    texte: "Qui a le droit de se définir, d'être reconnu·e, de disparaître derrière son travail — et qui ne l'a pas."
  }
};


/* ------------------------------------------------------------
   CARTES
   ------------------------------------------------------------ */
const CARDS_DATA = {

  bakunin: {
    id: "bakunin",
    auteur: "Michel Bakounine",
    titre: "Catéchisme révolutionnaire",
    annee: "1866",
    motsClefs: ["Liberté collective", "Anti-autoritarisme", "Éducation", "Organisation par le bas"],
    image: "assets/images/cards/bakunin.png",
    questions: [
      "Pourquoi la liberté d'un individu ne serait-elle pas limitée par celle des autres ?",
      "Peut-on restreindre la liberté de quelqu'un qui réduit celle d'autrui ?",
      "La liberté individuelle doit-elle être définie par la société pour être protégée et étendue ?"
    ],
    notions: ["liberte-relationnelle", "pouvoir-autorite", "ordre-chaos", "solidarite", "revolution"],
    liens: ["kropotkine", "lonzi", "davis"]
  },

  kropotkine: {
    id: "kropotkine",
    auteur: "Pierre Kropotkine",
    titre: "La Morale anarchiste",
    annee: "1889",
    motsClefs: ["Jeunesse", "Morale", "Éducation", "Instinct"],
    image: "assets/images/cards/kropotkine.png",
    questions: [
      "Sommes-nous condamné·es à revoir resurgir l'autoritarisme après un réveil intellectuel ?",
      "Sommes-nous naturellement anarchistes ?"
    ],
    notions: ["nature-systeme", "solidarite", "pouvoir-autorite", "pratique-accomplissement"],
    liens: ["bakunin", "boss", "morin"]
  },

  blanc: {
    id: "blanc",
    auteur: "Johana Blanc",
    titre: "Les Déserteur·euses",
    annee: "2023",
    motsClefs: ["Art", "Collectif", "Ego", "Féminisme"],
    image: "assets/images/cards/blanc.png",
    questions: [
      "La liberté est-elle la même pour tout le monde ?",
      "Comment écrire une histoire qui rende visibles tous les systèmes d'oppression et d'exclusion ?",
      "Comment pouvoir et liberté sont-ils liés ?",
      "Qui détermine les identités, et comment cela façonne-t-il la liberté de chacun·e ?"
    ],
    notions: ["identite", "oppression", "individu-collectif", "pratique-accomplissement"],
    liens: ["lonzi", "combahee", "drucker"]
  },

  berlin: {
    id: "berlin",
    auteur: "Isaiah Berlin",
    titre: "Deux conceptions de la liberté",
    annee: "1958",
    motsClefs: ["Individualisme", "Autonomie", "Autorité", "Oppression"],
    image: "assets/images/cards/berlin.png",
    questions: [
      "Une société peut-elle avoir trop de liberté ? Quand faut-il la limiter ?",
      "Quel rôle l'État doit-il jouer dans la protection ou la limitation de la liberté individuelle ?",
      "Existe-t-il un conflit entre liberté et d'autres valeurs comme l'égalité, la justice ou la sécurité ?"
    ],
    notions: ["pouvoir-autorite", "individu-collectif", "pratique-accomplissement"],
    liens: ["steyerl", "boss", "lonzi"]
  },

  combahee: {
    id: "combahee",
    auteur: "Combahee River Collective",
    titre: "Combahee River Collective Statement",
    annee: "1978",
    motsClefs: ["Oppressions croisées", "Féminisme noir", "Politique de l'identité"],
    image: "assets/images/cards/combahee.png",
    questions: [
      "Une politique fondée sur l'expérience vécue peut-elle produire un projet collectif ?",
      "Tenir compte d'oppressions multiples renforce-t-il l'action politique, ou la complique-t-il ?",
      "La libération des groupes les plus marginalisés peut-elle servir de modèle universel d'émancipation ?"
    ],
    notions: ["oppression", "identite", "solidarite", "individu-collectif"],
    liens: ["davis", "blanc", "newton"]
  },

  steyerl: {
    id: "steyerl",
    auteur: "Hito Steyerl",
    titre: "Free Lance — la liberté de tout perdre",
    annee: "2010",
    motsClefs: ["Liberté négative", "Freelance / Mercenaire", "Dérégulation", "Ville globale"],
    image: "assets/images/cards/steyerl.png",
    questions: [
      "De quoi êtes-vous libre ? Que pouvez-vous vous permettre de perdre ?",
      "Si vous n'appartenez à personne, pas même à vous-même, pour qui vous battez-vous ?",
      "Peut-on vendre son travail sans se vendre soi-même ?"
    ],
    notions: ["pouvoir-autorite", "identite", "individu-collectif"],
    liens: ["berlin", "berardi", "guell"]
  },

  berardi: {
    id: "berardi",
    auteur: "Franco \"Bifo\" Berardi",
    titre: "La poésie peut-elle sauver le monde ?",
    annee: "2019",
    motsClefs: ["Poésie", "Abstraction financière", "Corps collectif", "Résistance"],
    image: "assets/images/cards/berardi.png",
    questions: [
      "Comment le cadavre capitaliste contraste-t-il avec le corps social suffocant, et comment le faire respirer ?",
      "Quelles formes prennent les actions poétiques collectives, par opposition à l'action politique ?",
      "La poésie peut-elle sauver le monde ?"
    ],
    notions: ["corps-collectif", "pouvoir-autorite", "ecriture-diagramme"],
    liens: ["lorde", "steyerl", "wittig"]
  },

  lorde: {
    id: "lorde",
    auteur: "Audre Lorde",
    titre: "La poésie n'est pas un luxe",
    annee: "1985",
    motsClefs: ["Nécessité", "Action", "Résistance", "Survie"],
    image: "assets/images/cards/lorde.png",
    questions: [
      "La poésie transforme-t-elle la force et le courage en une forme de liberté ?"
    ],
    notions: ["corps-collectif", "ecriture-diagramme", "solidarite"],
    liens: ["berardi", "wittig", "drucker"]
  },

  newton: {
    id: "newton",
    auteur: "Huey P. Newton & Bobby Seale",
    titre: "The Black Panther Party Platform & Program",
    annee: "1966",
    motsClefs: ["Destin", "Autodéfense", "Autodétermination", "Éducation"],
    image: "assets/images/cards/newton.png",
    questions: [
      "Comment une communauté peut-elle se défendre elle-même ?",
      "Comment un système peut-il avoir deux niveaux de justice ?",
      "Que sont des droits égaux ?"
    ],
    notions: ["oppression", "pouvoir-autorite", "solidarite", "identite"],
    liens: ["davis", "combahee", "bakunin"]
  },

  wittig: {
    id: "wittig",
    auteur: "Monique Wittig",
    titre: "Le Cheval de Troie",
    annee: "1984",
    motsClefs: ["Cheval de Troie", "Littérature", "Langage", "Histoire"],
    image: "assets/images/cards/wittig.png",
    questions: [
      "Qu'est-ce qui relie la littérature à l'histoire et à la politique ?",
      "Qu'est-ce qui fait d'une œuvre littéraire une arme de guerre ?"
    ],
    notions: ["ecriture-diagramme", "individu-collectif", "pouvoir-autorite"],
    liens: ["drucker", "lorde", "berardi"]
  },

  guell: {
    id: "guell",
    auteur: "Núria Güell",
    titre: "Comment exproprier de l'argent aux banques",
    annee: "2013",
    motsClefs: ["Économie", "Crime", "Humour", "Absurde"],
    image: "assets/images/cards/guell.png",
    questions: [
      "Dans quelle mesure ce protocole est-il réellement applicable, et quelles alternatives plus « viables » envisager ?",
      "Peut-on construire une économie artistique viable sur des pratiques illégales ou criminelles ?",
      "Pour des personnes déjà marginalisées et précaires, quels sont les risques — et aussi les enjeux — d'une tentative d'expropriation des banques ?"
    ],
    notions: ["pouvoir-autorite", "individu-collectif", "oppression"],
    liens: ["steyerl", "boss", "berardi"]
  },

  boss: {
    id: "boss",
    auteur: "Gilbert Boss",
    titre: "Manifeste de l'individualisme",
    annee: "2006",
    motsClefs: ["Égoïsme", "Individualisme", "Autonomie", "Société"],
    image: "assets/images/cards/boss.png",
    questions: [
      "M'affirmer comme individu me condamne-t-il à être égoïste et seul ?",
      "Mes convictions sont-elles le fruit de ma propre réflexion, ou de simples échos de mon environnement ?",
      "Ai-je le droit de prioriser mon épanouissement sans culpabiliser face aux attentes de la société ?"
    ],
    notions: ["individu-collectif", "pratique-accomplissement"],
    liens: ["berlin", "kropotkine", "lonzi"]
  },

  davis: {
    id: "davis",
    auteur: "Angela Y. Davis",
    titre: "La liberté est une lutte constante",
    annee: "2016",
    motsClefs: ["Émancipation", "Lutte", "Radical", "Injustice"],
    image: "assets/images/cards/davis.png",
    questions: [
      "En tant qu'artistes, que pouvons-nous faire face à la violence d'État ?",
      "Quelles actions sont les plus efficaces pour contrer cette violence et l'oppression quotidienne ?",
      "Comment construire des liens solides dans la société pour mieux affronter ces problèmes ?"
    ],
    notions: ["oppression", "solidarite", "individu-collectif", "revolution"],
    liens: ["newton", "combahee", "bakunin"]
  },

  hayles: {
    id: "hayles",
    auteur: "N. Katherine Hayles",
    titre: "Lire et penser dans les environnements numériques",
    annee: "2012",
    motsClefs: ["Pensée numérique", "Fragmentation", "Attention", "Technogenèse"],
    image: "assets/images/cards/hayles.png",
    questions: [
      "Comment s'approprier la manière dont le numérique façonne notre pensée et nos récits, plutôt que la suivre passivement ?",
      "Si nous utilisons aujourd'hui deux types d'attention, comment préserver la lecture lente et profonde dans un monde de plus en plus rapide ?",
      "Comment vivre moralement cette mutation numérique ? Comment rester en amour avec la vie ?"
    ],
    notions: ["nature-systeme", "ecriture-diagramme", "individu-collectif"],
    liens: ["morin", "drucker", "berardi"]
  },

  arendt: {
    id: "arendt",
    auteur: "Hannah Arendt",
    titre: "La liberté d'être libre",
    annee: "fin des années 1960",
    motsClefs: ["Révolution", "Lutte de classe", "Liberté matérielle", "Esclavage"],
    image: "assets/images/cards/arendt.png",
    questions: [
      "La part de la population mondiale vivant dans la pauvreté ayant été réduite de moitié depuis ce texte, que reste-t-il valable de la thèse d'Arendt ?",
      "Dans le (re)tour à l'absolutisme qui accompagne parfois d'autres révolutions, quelles conditions y ont conduit ?",
      "La stabilité matérielle est-elle une condition nécessaire de la liberté ?"
    ],
    notions: ["revolution", "oppression", "ordre-chaos", "liberte-relationnelle"],
    liens: ["bakunin", "davis", "kropotkine"]
  },

  lonzi: {
    id: "lonzi",
    auteur: "Carla Lonzi",
    titre: "Crachons sur Hegel",
    annee: "1970",
    motsClefs: ["Féminisme", "Liberté", "Communisme"],
    image: "assets/images/cards/lonzi.png",
    questions: [
      "Comment le pouvoir patriarcal peut-il être remis en question ?",
      "Une femme peut-elle être considérée comme libre si le modèle de liberté qu'on lui impose est celui des hommes ?"
    ],
    notions: ["oppression", "pouvoir-autorite", "identite"],
    liens: ["combahee", "blanc", "bakunin"]
  },

  drucker: {
    id: "drucker",
    auteur: "Johanna Drucker",
    titre: "Écriture diagrammatique",
    annee: "2013",
    motsClefs: ["Pensée diagrammatique", "Savoir visuel", "Non-linéarité"],
    image: "assets/images/cards/drucker.png",
    questions: [
      "La juxtaposition crée-t-elle une apparence de parité ?",
      "Mettre un texte en gras change-t-il quelque chose ?",
      "Comment distinguer les gestes d'ouverture de ceux qui entourent ?",
      "Comment différentes versions d'un texte peuvent-elles être rendues possibles par des opérations diagrammatiques ?"
    ],
    notions: ["ecriture-diagramme", "pratique-accomplissement"],
    liens: ["wittig", "lorde", "hayles"]
  },

  morin: {
    id: "morin",
    auteur: "Edgar Morin",
    titre: "La Pensée complexe",
    annee: "1990",
    motsClefs: ["Complexité", "Interdépendance", "Auto-organisation", "Émergence"],
    image: "assets/images/cards/morin.png",
    questions: [
      "Comment réconcilier la diversité sans la dissoudre dans une société d'uniformité ?",
      "Peut-on se sentir libre dans une société qui n'embrasse pas le changement ?"
    ],
    notions: ["nature-systeme", "ordre-chaos", "liberte-relationnelle"],
    liens: ["hayles", "kropotkine", "bakunin"]
  }

};

/* Ordre d'affichage des cartes dans la vue "constellation" */
const CARDS = [
  "bakunin", "kropotkine", "blanc", "berlin", "combahee", "steyerl",
  "berardi", "lorde", "newton", "wittig", "guell", "boss",
  "davis", "hayles", "arendt", "lonzi", "drucker", "morin"
];