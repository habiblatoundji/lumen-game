// Réglages généraux du jeu
const LARGEUR = 960;
const HAUTEUR = 540;
const GRAVITE = 1500;
const VITESSE_JOUEUR = 240;
const FORCE_SAUT = 560;
const VITESSE_DASH = 560;
const DUREE_DASH = 170;
const RECHARGE_DASH = 600;
const DUREE_ATTAQUE = 260;
const RECHARGE_ATTAQUE = 380;
const ECHELLE_HEROS = 0.37;
const ECHELLE_ENNEMI = 0.27;
const ECHELLE_TUILES = 0.62;

// À augmenter de 1 chaque fois qu'on remplace une image du dossier assets
const VERSION_IMAGES = 1;

// true = affiche les zones de collision en couleur (pour régler le niveau)
const AFFICHER_COLLISIONS = false;

// Carte des images : fichier, puis découpe de chaque élément (x, y, largeur, hauteur)
// ax, ay = point d'appui (les pieds) ; surface = hauteur de la surface où l'on marche
const IMAGES = {
  decor: { fichier: 'decor_ruines.webp' },
  heros: {
    fichier: 'heros_poses.webp',
    cadres: {
      idle:   { x: 8,   y: 197, w: 153, h: 204, ax: 88,  ay: 198 },
      run:    { x: 161, y: 217, w: 165, h: 180, ax: 95,  ay: 171 },
      jump:   { x: 326, y: 184, w: 150, h: 199, ax: 88,  ay: 174 },
      dash:   { x: 476, y: 219, w: 181, h: 162, ax: 103, ay: 152 },
      attack: { x: 657, y: 208, w: 223, h: 191, ax: 105, ay: 183 },
      hurt:   { x: 880, y: 222, w: 130, h: 179, ax: 70,  ay: 171 }
    }
  },
  ennemis: {
    fichier: 'ennemis.webp',
    cadres: {
      rampant:   { x: 15,  y: 335, w: 290, h: 195, ax: 150, ay: 172 },
      feufollet: { x: 150, y: 160, w: 290, h: 290, ax: 200, ay: 190 },
      brute:     { x: 440, y: 150, w: 265, h: 365, ax: 135, ay: 355 },
      roi:       { x: 690, y: 35,  w: 300, h: 490, ax: 150, ay: 480 }
    }
  },
  tuiles: {
    fichier: 'tuiles.webp',
    cadres: {
      haut_g:  { x: 24,  y: 29,  w: 114, h: 117, surface: 16 },
      haut_m:  { x: 151, y: 35,  w: 111, h: 111, surface: 14 },
      haut_d:  { x: 275, y: 28,  w: 114, h: 118, surface: 16 },
      haut2_g: { x: 25,  y: 160, w: 113, h: 118, surface: 16 },
      haut2_m: { x: 151, y: 166, w: 111, h: 112, surface: 14 },
      haut2_d: { x: 275, y: 161, w: 114, h: 117, surface: 16 },
      bas_g:   { x: 30,  y: 290, w: 108, h: 110 },
      bas_m:   { x: 151, y: 290, w: 111, h: 110 },
      bas_d:   { x: 275, y: 290, w: 108, h: 110 },
      flot1:   { x: 619, y: 41,  w: 162, h: 71, surface: 8 },
      flot2:   { x: 815, y: 41,  w: 183, h: 86, surface: 8 },
      flot3:   { x: 411, y: 173, w: 146, h: 87, surface: 8 },
      pente:    { x: 411, y: 42,  w: 190, h: 105 },
      escalier: { x: 610, y: 153, w: 180, h: 99 },
      pont:     { x: 811, y: 153, w: 189, h: 98 },
      torche:   { x: 424, y: 260, w: 79,  h: 178 },
      lanterne: { x: 522, y: 280, w: 98,  h: 125 },
      vigne:    { x: 732, y: 275, w: 56,  h: 173 },
      arche:    { x: 804, y: 275, w: 195, h: 162 },
      vase:     { x: 630, y: 333, w: 85,  h: 103 },
      champis:  { x: 32,  y: 441, w: 109, h: 114 },
      champis2: { x: 154, y: 446, w: 106, h: 110 },
      tronc:    { x: 408, y: 443, w: 170, h: 111 },
      champis3: { x: 270, y: 455, w: 118, h: 99 },
      fougere1: { x: 563, y: 480, w: 105, h: 77 },
      fougere2: { x: 675, y: 473, w: 109, h: 82 },
      stele:    { x: 803, y: 461, w: 106, h: 93 },
      colonne:  { x: 924, y: 469, w: 64,  h: 85 }
    }
  }
};
