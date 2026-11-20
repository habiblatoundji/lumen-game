// Un ennemi : pour l'instant un mannequin d'entraînement qui encaisse 3 coups
class Ennemi {
  constructor(scene, x, y, plateformes) {
    this.scene = scene;
    this.pv = 3;

    this.corps = scene.add.rectangle(x, y, 26, 36, COULEUR_ENNEMI);
    this.corps.setStrokeStyle(2, 0xff7ab0);
    scene.physics.add.existing(this.corps);
    this.corps.body.setDragX(500);
    this.corps.body.setCollideWorldBounds(true);
    this.colliders = plateformes.map((p) => scene.physics.add.collider(this.corps, p));
  }

  zone() { return this.corps.getBounds(); }

  // Renvoie true si l'ennemi est vaincu par ce coup
  recevoirCoup(sens) {
    this.pv -= 1;
    this.corps.setFillStyle(0xffffff);
    this.scene.time.delayedCall(90, () => {
      if (this.corps.active) this.corps.setFillStyle(COULEUR_ENNEMI);
    });
    this.corps.body.setVelocityX(sens * 260);
    this.corps.body.setVelocityY(-120);
    return this.pv <= 0;
  }

  mourir() {
    const x = this.corps.x;
    const y = this.corps.y;
    for (let i = 0; i < 12; i++) {
      const eclat = this.scene.add.circle(x, y, Phaser.Math.Between(2, 4), 0xff7ab0);
      this.scene.tweens.add({
        targets: eclat,
        x: x + Phaser.Math.Between(-60, 60),
        y: y + Phaser.Math.Between(-60, 20),
        alpha: 0, duration: 450,
        onComplete: () => eclat.destroy()
      });
    }
    this.colliders.forEach((c) => this.scene.physics.world.removeCollider(c));
    this.corps.destroy();
  }
}
