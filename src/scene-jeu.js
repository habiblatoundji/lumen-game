// La scène principale : assemble le niveau, le joueur, les ennemis et l'interface
class SceneJeu extends Phaser.Scene {
  constructor() { super('Jeu'); }

  create() {
    this.niveau = NIVEAU_1;
    this.plateformes = [];
    this.ennemis = [];
    this.vaincus = 0;

    this.creerDecor();
    this.creerPlateformes();
    this.commandes = new Commandes(this);
    this.joueur = new Joueur(this, this.niveau.depart.x, this.niveau.depart.y, this.commandes);
    this.plateformes.forEach((p) => this.physics.add.collider(this.joueur.corps, p));
    this.niveau.ennemis.forEach((e) => this.creerEnnemi(e.x, e.y));
    this.creerInterface();

    this.events.on('attaque', this.gererAttaque, this);
  }

  creerDecor() {
    for (let i = 0; i < 40; i++) {
      const p = this.add.circle(
        Phaser.Math.Between(0, LARGEUR), Phaser.Math.Between(0, HAUTEUR),
        Phaser.Math.Between(1, 2), 0x9fb0ff, Phaser.Math.FloatBetween(0.15, 0.5));
      this.tweens.add({
        targets: p, y: p.y - Phaser.Math.Between(40, 120), alpha: 0.05,
        duration: Phaser.Math.Between(2500, 5000), yoyo: true, repeat: -1, ease: 'Sine.inOut'
      });
    }
  }

  creerPlateformes() {
    this.niveau.plateformes.forEach((d) => {
      const plateforme = this.add.rectangle(d.x, d.y, d.largeur, d.hauteur, 0x1a1f3a);
      plateforme.setStrokeStyle(2, 0x4a5aa8);
      this.physics.add.existing(plateforme, true);
      this.plateformes.push(plateforme);
    });
  }

  creerEnnemi(x, y) {
    const ennemi = new Ennemi(this, x, y, this.plateformes);
    this.ennemis.push(ennemi);
    return ennemi;
  }

  creerInterface() {
    this.add.text(16, 12, 'LUMEN - test 3 : fichiers séparés',
      { fontFamily: 'sans-serif', fontSize: '16px', color: '#8fa0ff' }).setDepth(10);
    this.texteScore = this.add.text(LARGEUR - 16, 12, 'Vaincus : 0',
      { fontFamily: 'sans-serif', fontSize: '16px', color: '#ff9ac4' }).setOrigin(1, 0).setDepth(10);
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
    this.time.delayedCall(2000, () => this.creerEnnemi(depart.x, depart.y));
  }

  update() {
    this.joueur.update();
  }
}
