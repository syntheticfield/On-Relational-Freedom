# On Freedom — édition numérique

Mini-plateforme mobile-first qui restitue l'édition physique
(grande mind map + cartes de textes) sous forme de navigation
récursive.

## 📁 Structure

```
edition-liberte/
├── index.html        ← structure des 3 vues + panneau de détail
├── style.css          ← apparence (papier / archive)
├── script.js          ← navigation, pan/zoom, panneau de détail
└── assets/
    ├── data.js         ← TOUS les textes & cartes (à éditer ici)
    └── images/
        ├── mindmap/
        │   └── big-map.jpg      ← photo de la grande mind map
        └── cards/
            ├── bakunin.jpg
            ├── kropotkine.jpg
            ├── blanc.jpg
            ├── ... (une image par carte)
```

## 🖼️ Où mettre vos photos

1. **Grande mind map** : remplacez/ajoutez le fichier
   `assets/images/mindmap/big-map.jpg` par la photo de votre
   grand diagramme (haute résolution conseillée, ex. 2000–3000px
   de large — l'utilisateur zoome dedans).

2. **Cartes** : pour chaque texte, déposez une image (le recto /
   diagramme de la carte) dans `assets/images/cards/`, avec le
   même nom que le champ `image` indiqué dans `assets/data.js`
   (ex : `bakunin.jpg`, `kropotkine.jpg`, etc.).

   Si une image manque, elle est simplement masquée — le reste
   de la carte (texte, questions, liens) s'affiche normalement.

## ✏️ Modifier les textes

Tout se passe dans `assets/data.js` :

- `CARDS_DATA` → un objet par carte : auteur, titre, année,
  mots-clés, résumé, questions, notions liées, textes liés.
- `NOTIONS` → les concepts de la grande carte (nom + courte
  définition), utilisés dans la vue "notion liée".
- `CARDS` → l'ordre d'affichage des cartes dans la constellation.

Pour **ajouter une carte** : copiez un bloc existant dans
`CARDS_DATA`, changez son `id`, remplissez les champs, puis
ajoutez cet `id` dans le tableau `CARDS`.

## 🎯 Positionner les points cliquables sur la mind map

Dans `index.html`, section `view-mindmap`, chaque bouton
`.hotspot` a un style `top: X%; left: Y%;` qui le positionne par
rapport à l'image (en pourcentage de sa largeur/hauteur réelle).
Ouvrez votre photo dans un logiciel quelconque, repérez les
coordonnées approximatives (en %) des zones que vous voulez
rendre cliquables, et ajustez ces valeurs. Le champ
`data-notion="..."` doit correspondre à une clé de `NOTIONS`
dans `data.js`.

## 🌐 Héberger sur GitHub Pages

1. Créez un nouveau dépôt GitHub (public).
2. Mettez tout le contenu de ce dossier `edition-liberte/`
   (y compris `assets/`) à la racine du dépôt — ou dans un
   dossier `/docs` si vous préférez.
3. Dans **Settings → Pages** :
   - Source : "Deploy from a branch"
   - Branch : `main` (et `/ (root)` ou `/docs` selon votre choix)
4. Au bout de quelques minutes, votre site sera disponible à :
   `https://VOTRE-NOM-UTILISATEUR.github.io/NOM-DU-DEPOT/`

Astuce : testez d'abord en local en ouvrant simplement
`index.html` dans un navigateur, ou via un petit serveur local
(`python3 -m http.server`) pour éviter les soucis de chemins
relatifs avec certaines images.

## 📱 Générer le QR code

Une fois le site en ligne, générez un QR code pointant vers son
URL avec n'importe quel générateur gratuit, par exemple :

- https://www.qr-code-generator.com
- https://qrcode.tec-it.com

Collez l'URL GitHub Pages (ex. `https://votrenom.github.io/on-freedom/`),
téléchargez le QR code en SVG ou PNG haute résolution pour
l'imprimer sur l'édition papier.

## 🎨 Personnaliser l'apparence

Les couleurs, polices et espacements généraux sont centralisés
en haut de `style.css`, dans le bloc `:root { ... }` — modifiez
ces variables pour changer rapidement l'ambiance globale (fond
clair/sombre, couleur d'accent, police de titre, etc.).
