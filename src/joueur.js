// Le joueur : une petite lumière qui se déplace, saute et attaque
class Joueur {
  constructor(scene, x, y, commandes) {
    this.scene = scene;
    this.commandes = commandes;
    this.sens = 1;               // 1 = regarde à droite, -1 = à gauche
    this.prochaineAttaque = 0;

    this.halo = scene.add.circle(x, y, 34, 0xffd27a, 0.18);
    scene.tweens.add({ targets: this.halo, scale: 1.3, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.corps = scene.add.circle(x, y, 14, 0xffe9a8);
    this.oeil = scene.add.circle(x + 6, y - 2, 3, 0x080a18);
    scene.physics.add.existing(this.corps);
    this.corps.body.setCollideWorldBounds(true);
  }

  update() {
    const body = this.corps.body;
    const gauche = this.commandes.versGauche();
    const droite = this.commandes.versDroite();
    if (gauche) this.sens = -1;
    else if (droite) this.sens = 1;
    body.setVelocityX(gauche ? -VITESSE_JOUEUR : droite ? VITESSE_JOUEUR : 0);

    const auSol = body.blocked.down || body.touching.down;
    if (this.commandes.saut() && auSol) body.setVelocityY(-FORCE_SAUT);

    if (this.commandes.attaque()) this.attaquer();

    this.halo.setPosition(this.corps.x, this.corps.y);
    this.oeil.setPosition(this.corps.x + this.sens * 6, this.corps.y - 2);
  }

  attaquer() {
    if (this.scene.time.now < this.prochaineAttaque) return;
    this.prochaineAttaque = this.scene.time.now + 350;

    const x = this.corps.x + this.sens * 34;
    const y = this.corps.y;
    const zone = new Phaser.Geom.Rectangle(x - 26, y - 22, 52, 44);

    // Trait lumineux de l'attaque
    const trace = this.scene.add.rectangle(x, y, 52, 10, 0xffffff, 0.8).setScale(0.4, 1);
    this.scene.tweens.add({
      targets: trace, alpha: 0, scaleX: 1.1, scaleY: 3, duration: 160,
      onComplete: () => trace.destroy()
    });

    // Le joueur annonce son attaque ; la scène vérifie qui est touché
    this.scene.events.emit('attaque', { zone, sens: this.sens });
  }
}
