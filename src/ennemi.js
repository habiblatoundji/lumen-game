// Un ennemi : pour l'instant un mannequin d'entraînement qui encaisse 3 coups
class Ennemi {
  constructor(scene, type, x, y, plateformes) {
    this.scene = scene;
    this.pv = 3;
    const cadre = IMAGES.ennemis.cadres[type];

    // Corps physique invisible
    this.corps = scene.add.rectangle(x, y, 64, 34, 0xff00ff, AFFICHER_COLLISIONS ? 0.35 : 0).setDepth(5);
    scene.physics.add.existing(this.corps);
    this.corps.body.setDragX(900);
    this.corps.body.setCollideWorldBounds(true);
    this.colliders = plateformes.map((p) => scene.physics.add.collider(this.corps, p));

    // Lueur rose derrière l'ennemi (pour le repérer sur un fond sombre)
    this.lueur = scene.add.circle(x, y, 52, 0xff5a8a, 0.12).setBlendMode(Phaser.BlendModes.ADD).setDepth(1.4);

    // Image de l'ennemi
    this.image = scene.add.image(x, y, 'ennemis', type).setDepth(1.5).setScale(ECHELLE_ENNEMI);
    this.image.setOrigin(cadre.ax / cadre.w, cadre.ay / cadre.h);
  }

  update(cibleX) {
    this.image.setPosition(this.corps.x, this.corps.y + this.corps.height / 2);
    this.image.setFlipX(cibleX < this.corps.x);
    this.lueur.setPosition(this.corps.x, this.corps.y - 4);
  }

  // Zone qui peut être touchée par l'attaque du joueur
  zone() {
    return new Phaser.Geom.Rectangle(this.corps.x - 40, this.corps.y - 30, 80, 60);
  }

  // Renvoie true si l'ennemi est vaincu par ce coup
  recevoirCoup(sens) {
    this.pv -= 1;
    this.image.setTintFill(0xffffff);
    this.scene.time.delayedCall(90, () => {
      if (this.image.active) this.image.clearTint();
    });
    this.corps.body.setVelocityX(sens * 320);
    this.corps.body.setVelocityY(-160);
    return this.pv <= 0;
  }

  mourir() {
    const x = this.corps.x;
    const y = this.corps.y;
    for (let i = 0; i < 14; i++) {
      const eclat = this.scene.add.circle(x, y, Phaser.Math.Between(2, 5), 0xff7ab0).setDepth(3);
      this.scene.tweens.add({
        targets: eclat,
        x: x + Phaser.Math.Between(-70, 70),
        y: y + Phaser.Math.Between(-70, 20),
        alpha: 0, duration: 500,
        onComplete: () => eclat.destroy()
      });
    }
    this.colliders.forEach((c) => this.scene.physics.world.removeCollider(c));
    this.lueur.destroy();
    this.image.destroy();
    this.corps.destroy();
  }
}
