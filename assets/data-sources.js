/* ============================================================
   data-sources.js
   ------------------------------------------------------------
   Contenu du 2e volet de chaque carte (résumé + lien PDF).
   À FUSIONNER dans assets/data.js : pour chaque entrée de
   CARDS_DATA correspondante, ajouter la clé "source" ci-dessous
   (copier-coller l'objet "source: { ... }" dans le bloc existant
   de la carte du même id).

   Pourquoi un résumé et pas le texte intégral ?
   -> Ces textes sont protégés par le droit d'auteur (sauf
      Kropotkine, domaine public, mais on garde le même format
      pour rester cohérent). On affiche donc un court résumé
      écrit pour l'édition, + un lien "Lire le texte source"
      qui ouvre le PDF original dans un nouvel onglet.
   ============================================================ */

const SOURCES = {

  berlin: {
    summary: `
      <p class="flip-back-resume">Dans « Deux conceptions de la liberté » (1958), Isaiah Berlin
      distingue la liberté négative — l'espace dans lequel un individu peut agir sans être
      entravé par autrui — et la liberté positive, qui renvoie à la maîtrise de soi, au fait
      d'être l'auteur de ses propres choix.</p>
      <p class="flip-back-resume">Il montre comment l'idéal de liberté positive, en posant
      l'existence d'un « moi véritable » ou supérieur, a souvent servi à justifier des formes
      de domination exercées « pour le bien » des individus, au nom de leur propre liberté
      mal comprise.</p>
    `,
    pdf: "assets/pdfs/berlin.pdf"
  },

  wittig: {
    summary: `
      <p class="flip-back-resume">Dans « Le cheval de Troie » (tiré de <i>La Pensée straight</i>),
      Monique Wittig compare l'œuvre littéraire au cheval de bois des Grecs : toute œuvre qui
      introduit une forme nouvelle agit, au moment de sa parution, comme une machine de guerre
      contre les formes établies, avant d'être progressivement assimilée.</p>
      <p class="flip-back-resume">Pour l'écrivain·e, le matériau de base est le langage
      lui-même — à la fois matière et forme. Wittig prend l'exemple de Proust et de <i>La
      Recherche</i>, dont l'effet de transformation, retardé, finit par bouleverser durablement
      la façon de lire et de penser certains sujets.</p>
    `,
    pdf: "assets/pdfs/wittig.pdf"
  },

  berardi: {
    summary: `
      <p class="flip-back-resume">Dans cet entretien de 2019 pour <i>Le Monde diplomatique</i>,
      Franco « Bifo » Berardi développe l'idée de « sémio-capitalisme » : un capitalisme fondé
      sur la production et la circulation de signes, où le langage informatique a remplacé la
      prophétie en prescrivant l'avenir plutôt qu'en le décrivant.</p>
      <p class="flip-back-resume">Il distingue la « connexion », purement syntaxique et
      machinique, de la « conjonction », relation incarnée entre humains qui crée du sens. Face
      à l'étouffement du capitalisme financier, il défend une réactivation poétique du corps
      social — la poésie comme ouverture de l'indéfini, là où le code referme et limite.</p>
    `,
    pdf: "assets/pdfs/berardi.pdf"
  },

  blanc: {
    summary: `
      <p class="flip-back-resume">Dans cet extrait des <i>Déserteuses</i>, Johana Blanc revient
      sur sa fascination de jeunesse pour l'esthétique relationnelle et des artistes comme
      Rirkrit Tiravanija, dont l'œuvre lui semblait incarner une liberté et une légèreté
      absolues.</p>
      <p class="flip-back-resume">Elle réalise après coup que cette liberté n'était jamais la
      sienne : la neutralité affichée par ces artistes lui était inaccessible en tant que
      femme. Le texte explore ce sentiment de trahison par un savoir et un goût qu'elle s'était
      pourtant elle-même construits, et la colère qui en résulte, encore sans destination
      claire.</p>
    `,
    pdf: "assets/pdfs/blanc.pdf"
  },

  kropotkine: {
    summary: `
      <p class="flip-back-resume">Dans <i>La Morale anarchiste</i>, Pierre Kropotkine cherche
      l'origine du sentiment moral non dans la religion, la loi ou un quelconque commandement
      divin, mais dans la solidarité observée à toutes les échelles du monde animal — des
      fourmis aux sociétés humaines.</p>
      <p class="flip-back-resume">Il en tire un principe simple, « traite les autres comme tu
      voudrais être traité dans les mêmes circonstances », et refuse toute morale fondée sur la
      punition ou l'obligation extérieure. Sa conclusion appelle chacun·e à être fort·e, à vivre
      pleinement et à lutter contre l'injustice plutôt qu'à végéter dans la résignation.</p>
    `,
    pdf: "assets/pdfs/kropotkine.pdf"
  },

  lonzi: {
    summary: `
      <p class="flip-back-resume">Dans « Crachons sur Hegel » (1970), Carla Lonzi refuse de
      penser la libération des femmes sur le modèle de la dialectique maître-esclave ou de la
      lutte des classes : l'égalité, dit-elle, est une notion juridique octroyée par le pouvoir
      masculin, qui ne change rien à la structure réelle de la domination.</p>
      <p class="flip-back-resume">Elle revendique au contraire la différence comme point de
      départ : il n'existe pas de solution où l'un des deux termes — l'homme ou la femme —
      éliminerait l'autre, et c'est l'idée même d'une prise de pouvoir qui doit s'effondrer pour
      qu'émerge un « sujet imprévu », hors des schémas hérités.</p>
    `,
    pdf: "assets/pdfs/lonzi.pdf"
  },

  lorde: {
    summary: `
      <p class="flip-back-resume">Dans « La poésie n'est pas un luxe » (1985), Audre Lorde
      affirme que la poésie est le moyen par lequel on donne forme et nom à ce qui, en nous,
      est encore informe : sentiments, intuitions, savoirs non encore traduits en idées.</p>
      <p class="flip-back-resume">Pour les femmes, et en particulier les femmes noires, cette
      poésie ancrée dans le ressenti n'est pas un ornement mais une nécessité vitale : elle
      constitue, écrit-elle, « l'architecture du squelette de nos vies », le socle à partir
      duquel deviennent pensables — puis possibles — les changements les plus radicaux.</p>
    `,
    pdf: "assets/pdfs/lorde.pdf"
  }

};