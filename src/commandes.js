// Commandes : boutons tactiles et clavier
class Commandes {
  constructor(scene) {
    this.scene = scene;
    this.gauche = false;
    this.droite = false;
    this.sautDemande = false;
    this.attaqueDemandee = false;
    this.dashDemande = false;

    scene.input.addPointer(3);
    this.creerBouton(75, 485, '◀', () => { this.gauche = true; }, () => { this.gauche = false; }, 42);
    this.creerBouton(180, 485, '▶', () => { this.droite = true; }, () => { this.droite = false; }, 42);
    this.creerBouton(895, 485, '▲', () => { this.sautDemande = true; }, () => {}, 42);
    this.creerBouton(790, 485, '●', () => { this.attaqueDemandee = true; }, () => {}, 42);
    this.creerBouton(690, 490, '»', () => { this.dashDemande = true; }, () => {}, 34);

    // Clavier pour tester sur ordinateur : flèches, espace = saut, X = attaque, C = dash
    this.clavier = scene.input.keyboard.createCursorKeys();
    this.espace = scene.input.keyboard.addKey('SPACE');
    this.toucheAttaque = scene.input.keyboard.addKey('X');
    this.toucheDash = scene.input.keyboard.addKey('C');
  }

  versGauche() { return this.gauche || this.clavier.left.isDown; }
  versDroite() { return this.droite || this.clavier.right.isDown; }

  // saut(), attaque() et dash() consomment la demande : à appeler une seule fois par image
  saut() {
    const demande = this.sautDemande
      || Phaser.Input.Keyboard.JustDown(this.clavier.up)
      || Phaser.Input.Keyboard.JustDown(this.espace);
    this.sautDemande = false;
    return demande;
  }

  attaque() {
    const demande = this.attaqueDemandee || Phaser.Input.Keyboard.JustDown(this.toucheAttaque);
    this.attaqueDemandee = false;
    return demande;
  }

  dash() {
    const demande = this.dashDemande || Phaser.Input.Keyboard.JustDown(this.toucheDash);
    this.dashDemande = false;
    return demande;
  }

  creerBouton(x, y, texte, quandAppuye, quandRelache, rayon) {
    const cercle = this.scene.add.circle(x, y, rayon, 0xffffff, 0.12).setStrokeStyle(2, 0xffffff, 0.35).setDepth(10);
    cercle.setInteractive(new Phaser.Geom.Circle(rayon, rayon, rayon + 10), Phaser.Geom.Circle.Contains);
    this.scene.add.text(x, y, texte, { fontSize: '30px', color: '#ffffff' }).setOrigin(0.5).setAlpha(0.8).setDepth(10);
    cercle.on('pointerdown', quandAppuye);
    cercle.on('pointerup', quandRelache);
    cercle.on('pointerout', quandRelache);
  }
}
