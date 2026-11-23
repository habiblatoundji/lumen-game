// La scène principale : assemble le niveau, le joueur, les ennemis et l'interface
class SceneJeu extends Phaser.Scene {
  constructor() { super('Jeu'); }

  preload() {
    this.add.text(LARGEUR / 2, HAUTEUR / 2, 'Chargement…',
      { fontFamily: 'sans-serif', fontSize: '22px', color: '#8fa0ff' }).setOrigin(0.5);
    this.load.on('loaderror', (fichier) => {
      if (typeof afficherErreur === 'function') afficherErreur('Image introuvable : ' + fichier.key);
    });
    Object.keys(IMAGES).forEach((cle) => {
      this.load.image(cle, 'assets/' + IMAGES[cle].fichier + '?v=' + VERSION_IMAGES);
    });
  }

  create() {
    this.preparerCadres();
    this.niveau = NIVEAU_1;
    this.plateformes = [];
    this.ennemis = [];
    this.vaincus = 0;

    this.creerFond();
    this.creerDecors();
    this.creerSol();
    this.creerPlateformes();
    this.commandes = new Commandes(this);
    this.joueur = new Joueur(this, this.niveau.depart.x, this.niveau.depart.y, this.commandes);
    this.plateformes.forEach((p) => this.physics.add.collider(this.joueur.corps, p));
    this.niveau.ennemis.forEach((e) => this.creerEnnemi(e.type, e.x));
    this.creerParticules();
    this.creerInterface();

    this.events.on('attaque', this.gererAttaque, this);
  }

  // Découpe chaque image en éléments (poses, tuiles, ennemis)
  preparerCadres() {
    Object.keys(IMAGES).forEach((cle) => {
      const cadres = IMAGES[cle].cadres;
      if (!cadres) return;
      const texture = this.textures.get(cle);
      Object.keys(cadres).forEach((nom) => {
        const c = cadres[nom];
        texture.add(nom, 0, c.x, c.y, c.w, c.h);
      });
    });
  }

  creerFond() {
    this.add.image(0, 0, 'decor').setOrigin(0, 0).setDisplaySize(LARGEUR, HAUTEUR).setDepth(-10);
    this.add.rectangle(0, 0, LARGEUR, HAUTEUR, 0x05060f, 0.38).setOrigin(0, 0).setDepth(-9);
  }

  creerDecors() {
    const solY = this.niveau.sol.y;
    this.niveau.decors.forEach((d) => {
      const cadre = IMAGES.tuiles.cadres[d.image];
      this.add.image(d.x, solY + 6, 'tuiles', d.image).setOrigin(0.5, 1).setScale(d.echelle).setDepth(-2);
      if (d.lumiere) {
        const lueur = this.add.circle(d.x, solY - cadre.h * d.echelle * 0.75, 80, 0xffb347, 0.14)
          .setBlendMode(Phaser.BlendModes.ADD).setDepth(-1);
        this.tweens.add({ targets: lueur, alpha: 0.07, scale: 1.15, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      }
    });
  }

  // Un rectangle de collision invisible dont le haut est à la hauteur y
  ajouterCollision(x, haut, largeur, hauteur, traversable) {
    const zone = this.add.rectangle(x, haut + hauteur / 2, largeur, hauteur, 0x00ff88, AFFICHER_COLLISIONS ? 0.4 : 0).setDepth(6);
    this.physics.add.existing(zone, true);
    if (traversable) {
      // On peut la traverser par en dessous et par les côtés : seul le dessus est solide
      zone.body.checkCollision.down = false;
      zone.body.checkCollision.left = false;
      zone.body.checkCollision.right = false;
    }
    this.plateformes.push(zone);
    return zone;
  }

  creerSol() {
    const solY = this.niveau.sol.y;
    const t = IMAGES.tuiles.cadres;
    const largeurTuile = t.haut_m.w * ECHELLE_TUILES;
    const nombre = Math.ceil(LARGEUR / largeurTuile) + 1;
    this.add.rectangle(0, solY + 30, LARGEUR + 200, HAUTEUR, 0x05060f).setOrigin(0, 0).setDepth(-3);
    for (let i = 0; i < nombre; i++) {
      const nom = i === 0 ? 'haut_g' : i === nombre - 1 ? 'haut_d' : i % 2 ? 'haut_m' : 'haut2_m';
      this.add.image(i * largeurTuile, solY - t[nom].surface * ECHELLE_TUILES, 'tuiles', nom)
        .setOrigin(0, 0).setScale(ECHELLE_TUILES).setDepth(0);
    }
    this.ajouterCollision(LARGEUR / 2, solY, LARGEUR + 200, 90, false);
  }

  creerPlateformes() {
    this.niveau.plateformes.forEach((p) => {
      const cadre = IMAGES.tuiles.cadres[p.image];
      this.add.image(p.x, p.y - cadre.surface * p.echelle, 'tuiles', p.image)
        .setOrigin(0.5, 0).setScale(p.echelle).setDepth(0);
      this.ajouterCollision(p.x, p.y, cadre.w * p.echelle * 0.88, 14, true);
    });
  }

  creerEnnemi(type, x) {
    const ennemi = new Ennemi(this, type, x, this.niveau.sol.y - 40, this.plateformes);
    this.ennemis.push(ennemi);
    return ennemi;
  }

  // Petites lueurs qui flottent dans l'air
  creerParticules() {
    for (let i = 0; i < 28; i++) {
      const p = this.add.circle(
        Phaser.Math.Between(0, LARGEUR), Phaser.Math.Between(60, HAUTEUR - 80),
        Phaser.Math.Between(1, 3), 0xffd27a, Phaser.Math.FloatBetween(0.2, 0.6))
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(3);
      this.tweens.add({
        targets: p, y: p.y - Phaser.Math.Between(40, 120), x: p.x + Phaser.Math.Between(-30, 30), alpha: 0.05,
        duration: Phaser.Math.Between(2500, 5000), yoyo: true, repeat: -1, ease: 'Sine.inOut'
      });
    }
  }

  creerInterface() {
    this.add.text(20, 14, 'LUMEN - test 4 : décor et héros',
      { fontFamily: 'sans-serif', fontSize: '18px', color: '#8fa0ff' }).setDepth(10);
    this.texteScore = this.add.text(LARGEUR - 20, 14, 'Vaincus : 0',
      { fontFamily: 'sans-serif', fontSize: '18px', color: '#ff9ac4' }).setOrigin(1, 0).setDepth(10);
  }

  gererAttaque({ zone, sens }) {
    [...this.ennemis].forEach((ennemi) => {
      if (!Phaser.Geom.Intersects.RectangleToRectangle(zone, ennemi.zone())) return;
      this.cameras.main.shake(90, 0.004);
      if (ennemi.recevoirCoup(sens)) this.ennemiVaincu(ennemi);
    });
  }

  ennemiVaincu(ennemi) {
    this.ennemis = this.ennemis.filter((e) => e !== ennemi);
    ennemi.mourir();
    this.vaincus += 1;
    this.texteScore.setText('Vaincus : ' + this.vaincus);
    const depart = this.niveau.ennemis[0];
    this.time.delayedCall(2000, () => this.creerEnnemi(depart.type, depart.x));
  }

  update(temps, delta) {
    this.joueur.update(delta);
    this.ennemis.forEach((e) => e.update(this.joueur.corps.x));
  }
}
