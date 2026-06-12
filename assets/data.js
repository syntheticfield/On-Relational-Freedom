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
    auteur: "Mikhaïl Bakunin",
    titre: "Le Catéchisme Révolutionnaire",
    annee: "1866",
    motsClefs: ["Liberté collective", "Anti-autoritarisme", "Éducation", "Organisation par le bas"],
    image: "assets/images/cards/bakunin.png",
    resume: "Bakunin pose la liberté de tous comme priorité absolue : la liberté de chacun·e est renforcée, et non limitée, par celle des autres. Il appelle au rejet de toute autorité divine et étatique, remplacée par la conscience humaine et l'amour de l'humanité. L'organisation doit partir du bas vers le haut — c'est la nation qui désigne juges et représentant·es. L'éducation devient un droit financé collectivement, la peine est remplacée par la responsabilité, et le crime est pensé comme une maladie plutôt qu'une faute à punir.",
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
    titre: "Morale Anarchiste",
    annee: "1889",
    motsClefs: ["Jeunesse", "Morale", "Éducation", "Instinct"],
    image: "assets/images/cards/kropotkine.png",
    resume: "Kropotkine décrit la morale comme un instinct naturel lié à la survie. Il identifie un mouvement de balancier : les périodes autoritaires — soutenues par la fatigue sociale, le désenchantement et une éducation qui pousse à la soumission — sont suivies de réveils critiques de la pensée. Cet effondrement de la morale imposée ouvre la voie à une compréhension renouvelée de l'éthique, libre des institutions. La solidarité, la coopération, l'égalité et l'honnêteté sont, pour lui, les fondements naturels du progrès, et le bonheur — individuel et collectif — la source de l'action morale.",
    questions: [
      "Sommes-nous condamné·es à revoir resurgir l'autoritarisme après un réveil intellectuel ?",
      "Sommes-nous naturellement anarchistes ?"
    ],
    notions: ["nature-systeme", "solidarite", "pouvoir-autorite", "pratique-accomplissement"],
    liens: ["bakunin", "boss", "morin"]
  },

  blanc: {
    id: "blanc",
    auteur: "Jo·Hana Blanc",
    titre: "Les Déserteur·euses",
    annee: "2023",
    motsClefs: ["Art", "Collectif", "Ego", "Féminisme"],
    image: "assets/images/cards/blanc.png",
    resume: "Johana Blanc questionne des mouvements artistiques qui se présentent comme libres et subversifs, mais restent en réalité inaccessibles à la majorité. Être un homme cisgenre blanc offre, selon elle, une neutralité identitaire qui permet d'être reconnu·e pour son travail seul — un privilège qui structure l'histoire de l'art et rend invisibles les mécanismes d'exclusion. Plutôt que de se concentrer sur des figures individuelles, elle propose de penser l'art comme un réseau collectif d'influences, et appelle à une déconstruction plus large du système éducatif.",
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
    resume: "Berlin distingue la liberté négative — l'absence d'interférence, la préservation d'une sphère privée protégée — de la liberté positive, qui relève de la maîtrise de soi et de la capacité d'agir selon sa volonté rationnelle. Si la seconde semble émancipatrice, elle comporte un danger : une autorité peut prétendre mieux connaître les « vrais » intérêts d'un individu que lui-même, justifiant ainsi la coercition au nom même de la liberté. Pour Berlin, confondre ces deux notions revient à risquer de perdre la liberté véritable.",
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
    resume: "Rédigé par un collectif de féministes socialistes lesbiennes noires, ce texte majeur affirme que race, genre, classe et sexualité ne peuvent être pensés comme des systèmes séparés. À partir de leur expérience vécue, les membres critiquent les limites des mouvements féministes, antiracistes et socialistes, incapables de saisir la réalité spécifique des femmes noires. Elles proposent une politique de l'identité non comme repli, mais comme point de départ d'une transformation radicale : la libération des femmes noires impliquerait la destruction de tous les systèmes d'oppression.",
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
    resume: "Steyerl avance que la liberté contemporaine n'est plus une « liberté de » faire, mais une « liberté de » tout — des liens sociaux, de la sécurité, de l'emploi, de l'appartenance. La figure du·de la freelance et celle du mercenaire incarnent cette condition : des sujets déterritorialisés, marchandisés, flottants, produits de la dérégulation et de la privatisation. Ce vide crée à la fois de la précarité et la possibilité de nouvelles solidarités — le mercenaire pourrait-il devenir guérillero ?",
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
    resume: "En s'appuyant sur Occupy et les mobilisations climatiques, Berardi pense la poésie comme un chemin par le bas vers la liberté, face à la logique mathématique imposée par la finance. Le code agit comme une prophétie auto-réalisatrice : la communication numérique réduit les relations à de la syntaxe, tandis que la finance ne représente plus la réalité mais la prescrit. Le capitalisme devient un « cadavre » maintenu par ce code, dans lequel les individus suffoquent. Le nouveau fascisme naît de la frustration face à cette domination abstraite. La résistance, pour Berardi, doit prendre une forme poétique : reconquérir le corps, le langage, l'expression collective.",
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
    resume: "Pour Audre Lorde, la poésie n'est pas un luxe mais une nécessité vitale. Elle donne un nom à ce qui, avant le poème, est sans forme — le transformant en langage, puis en idée, puis en action tangible. Chez les femmes, un lieu intérieur sombre et grandissant abrite une réserve immense de créativité, de force et d'émotions encore inexplorées. Une fois reconnues, ces émotions deviennent la source des idées les plus radicales et nécessaires au changement. La poésie donne la force et le courage de voir, de sentir, de parler et d'oser.",
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
    resume: "En dix points organisés autour de « ce que nous voulons » et « ce que nous croyons », les Black Panthers exposent l'oppression systémique exercée par l'homme blanc sur la communauté noire : un système judiciaire qui cible les personnes de couleur, une école qui maintient leur soumission en effaçant leur histoire, un marché du logement qui leur refuse des conditions de vie dignes. Ils envisagent la libération noire par l'usage de la force si nécessaire — y compris l'autodéfense armée face aux violences policières — et revendiquent l'exemption du service militaire, perçu comme un instrument d'un système raciste.",
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
    resume: "Pour Wittig, toute œuvre littéraire majeure agit, au moment de sa création, comme un cheval de Troie : une forme nouvelle qui fonctionne comme une arme destinée à démolir les formes anciennes et leurs règles. Elle distingue littérature et histoire/politique : l'une connecte des formes, l'autre connecte des individus. Le langage est à la fois matière et forme — chaque mot est un cheval de Troie potentiel. Construire une œuvre comme « machine de guerre » suppose un détour par les mots, leur transformation, et l'universalisation du point de vue singulier de l'auteur·ice.",
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
    resume: "Núria Güell propose un protocole fictionnel pour détourner le système bancaire à son avantage. À travers cette stratégie, elle critique le pouvoir des institutions financières et expose les mécanismes de domination liés à la dette, utilisant l'art comme outil de subversion économique et politique.",
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
    resume: "Le Manifeste de l'individualisme défend un individualisme véritable comme quête d'autonomie personnelle et d'épanouissement de soi, distinct de l'égoïsme. L'individu y est posé comme seule source réelle de valeur, et la société n'est légitime qu'à condition de soutenir le développement critique de chacun·e — paradoxalement, plus je considère les autres comme des individus à part entière et m'intéresse à leurs intérêts propres, moins je suis égoïste.",
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
    annee: "2015",
    motsClefs: ["Émancipation", "Lutte", "Radical", "Injustice"],
    image: "assets/images/cards/davis.png",
    resume: "Ce recueil d'essais, d'entretiens et de discours explore les liens entre différentes luttes de libération à travers le monde, en défendant le féminisme noir, l'intersectionnalité et l'abolitionnisme. Davis y relie la militarisation de la police à Ferguson aux tactiques employées en Palestine, insiste sur l'inséparabilité des oppressions de race, de classe et de genre, et critique le complexe carcéro-industriel. Elle invite à penser les mouvements sociaux non comme des événements isolés mais comme un réseau global de résistance — et à dépasser le récit héroïque individuel au profit de communautés de lutte en expansion.",
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
    resume: "Plutôt que de juger la culture numérique bonne ou mauvaise, Hayles pose la question : que devient la pensée lorsqu'elle se fait elle-même numérique, puisque nous pensons à travers et avec les médias ? Les structures du numérique — vitesse, stimulation constante, interaction — transforment lentement nos habitudes d'attention et notre manière d'imaginer le savoir. Hayles distingue une attention profonde et lente d'une attention numérique rapide et fragmentée, et propose le concept de technogenèse : humains et technologies évoluent ensemble en spirale. Ce qui compte n'est pas l'accumulation de données, mais la capacité à les interpréter, les questionner, en faire du sens.",
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
    resume: "Arendt analyse les conditions et les glissements de sens du mot liberté avant les révolutions américaine et française : la liberté y était d'abord une question matérielle, liée à une idée de restauration plutôt que de renouveau. La différence fondamentale entre les deux révolutions tient à la richesse matérielle : pour la majorité des citoyens américains (à l'exclusion des personnes esclavagisées, dont la richesse a été extraite), l'absence de pauvreté absolue était déjà acquise — l'admission à la vie publique par la démocratie suffisait. En France, la libération de la pauvreté et la lutte de classe étaient des conditions préalables aux droits civiques. Pour Arendt, c'est cette stabilité matérielle préalable qui explique la stabilité durable obtenue par la révolution américaine, là où la française a vu un retour à la monarchie.",
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
    resume: "Les femmes ont été pensées comme dépourvues de pouvoir, de culture et d'histoire — l'homme servant de norme et de point de référence absolu à partir duquel la femme est construite. L'égalité juridique actuelle n'est qu'une autorisation à participer au pouvoir masculin ; l'enjeu n'est pas de s'en saisir mais de le remettre en question. La révolution communiste ne suffit pas : sa théorie reste patriarcale, l'État demeure paternaliste, et la famille — pierre angulaire de l'ordre patriarcal — n'y est jamais questionnée ; Marx et Hegel ont écarté l'amour libre comme une déviation bourgeoise.",
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
    resume: "Diagrammatic Writing est une démonstration poétique de la capacité du format à produire du sens. Le texte interroge les relations qui se créent dans l'espace de la page entre la typographie, les marges, le blanc, la position des mots. Texte et présentation graphique y sont pleinement intégrés, codépendants, mutuellement réflexifs — montrant que les principes diagrammatiques sont une évidence, et que le texte, comme l'espace, peut être libéré de ses liens tout en restant chargé d'habitudes de lecture.",
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
    annee: "1982",
    motsClefs: ["Complexité", "Interdépendance", "Auto-organisation", "Émergence"],
    image: "assets/images/cards/morin.png",
    resume: "Morin ne cherche pas à simplifier le réel mais à préserver sa richesse, critiquant les sciences occidentales qui fragmentent les phénomènes par réductionnisme et séparent le sujet de son environnement actif. Il propose une conception de l'organisme — du biologique au social — comme système éco-auto-organisé, où sujets, environnements et organisations co-émergent dans un réseau d'interdépendances. Le monde n'est plus une somme d'objets séparés mais un champ de relations en transformation ; le hasard et l'indétermination deviennent des forces actives. Ordre, désordre et organisation s'engendrent et se reconstituent mutuellement — le vivant comme tension entre stabilité et mutation.",
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
