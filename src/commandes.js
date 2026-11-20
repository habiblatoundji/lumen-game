// Commandes : boutons tactiles et clavier
class Commandes {
  constructor(scene) {
    this.scene = scene;
    this.gauche = false;
    this.droite = false;
    this.sautDemande = false;
    this.attaqueDemandee = false;

    scene.input.addPointer(2);
    this.creerBouton(60, 300, '◀', () => { this.gauche = true; }, () => { this.gauche = false; });
    this.creerBouton(150, 300, '▶', () => { this.droite = true; }, () => { this.droite = false; });
    this.creerBouton(740, 300, '▲', () => { this.sautDemande = true; }, () => {});
    this.creerBouton(655, 300, '●', () => { this.attaqueDemandee = true; }, () => {});

    // Clavier pour tester sur ordinateur : flèches, espace = saut, X = attaque
    this.clavier = scene.input.keyboard.createCursorKeys();
    this.espace = scene.input.keyboard.addKey('SPACE');
    this.toucheAttaque = scene.input.keyboard.addKey('X');
  }

  versGauche() { return this.gauche || this.clavier.left.isDown; }
  versDroite() { return this.droite || this.clavier.right.isDown; }

  // saut() et attaque() consomment la demande : à appeler une seule fois par image
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

  creerBouton(x, y, texte, quandAppuye, quandRelache) {
    const rayon = 34;
    const cercle = this.scene.add.circle(x, y, rayon, 0xffffff, 0.12).setStrokeStyle(2, 0xffffff, 0.35).setDepth(10);
    cercle.setInteractive(new Phaser.Geom.Circle(rayon, rayon, rayon + 10), Phaser.Geom.Circle.Contains);
    this.scene.add.text(x, y, texte, { fontSize: '28px', color: '#ffffff' }).setOrigin(0.5).setAlpha(0.8).setDepth(10);
    cercle.on('pointerdown', quandAppuye);
    cercle.on('pointerup', quandRelache);
    cercle.on('pointerout', quandRelache);
  }
}
