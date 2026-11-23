// Données des niveaux : on change la carte ici, sans toucher au reste du code
// x et y sont en pixels sur un écran de 960 x 540 ; y des plateformes = hauteur de la surface où l'on marche
const NIVEAU_1 = {
  depart: { x: 110, y: 360 },
  sol: { y: 430 },
  plateformes: [
    { image: 'flot1', x: 330, y: 345, echelle: 0.9 },
    { image: 'flot2', x: 570, y: 265, echelle: 0.9 },
    { image: 'flot1', x: 810, y: 185, echelle: 0.9 }
  ],
  decors: [
    { image: 'torche',   x: 150, echelle: 0.55, lumiere: true },
    { image: 'champis',  x: 360, echelle: 0.5 },
    { image: 'fougere1', x: 480, echelle: 0.6 },
    { image: 'vase',     x: 730, echelle: 0.55 },
    { image: 'fougere2', x: 890, echelle: 0.6 }
  ],
  ennemis: [{ type: 'rampant', x: 640 }]
};
