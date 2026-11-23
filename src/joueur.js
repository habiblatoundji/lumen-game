// Le Veilleur : se déplace, saute, fait un dash et attaque
class Joueur {
  constructor(scene, x, y, commandes) {
    this.scene = scene;
    this.commandes = commandes;
    this.sens = 1;               // 1 = regarde à droite, -1 = à gauche
    this.prochaineAttaque = 0;
    this.finAttaque = 0;
    this.finDash = 0;
    this.prochainDash = 0;
    this.etaitAuSol = false;
    this.ecrasement = 0;
    this.pose = '';

    // Corps physique invisible (la zone qui touche le sol)
    this.corps = scene.add.rectangle(x, y, 26, 62, 0xff00ff, AFFICHER_COLLISIONS ? 0.35 : 0).setDepth(5);
    scene.physics.add.existing(this.corps);
    this.corps.body.setCollideWorldBounds(true);

    // Lueur autour du héros
    this.halo = scene.add.circle(x, y, 64, 0xffd27a, 0.1).setBlendMode(Phaser.BlendModes.ADD).setDepth(1);
    scene.tweens.add({ targets: this.halo, scale: 1.25, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // Image du héros
    this.image = scene.add.image(x, y, 'heros', 'idle').setDepth(2);
    this.definirPose('idle');
  }

  definirPose(nom) {
    const cadre = IMAGES.heros.cadres[nom];
    this.image.setFrame(nom);
    this.image.setOrigin(cadre.ax / cadre.w, cadre.ay / cadre.h);
    this.pose = nom;
  }

  update(delta) {
    const maintenant = this.scene.time.now;
    const corps = this.corps.body;
    const gauche = this.commandes.versGauche();
    const droite = this.commandes.versDroite();
    const veutSauter = this.commandes.saut();
    const veutDash = this.commandes.dash();
    const veutAttaquer = this.commandes.attaque();

    // Dash : un élan rapide en ligne droite
    if (veutDash && maintenant >= this.prochainDash) {
      this.finDash = maintenant + DUREE_DASH;
      this.prochainDash = maintenant + RECHARGE_DASH;
      corps.setAllowGravity(false);
      corps.setVelocity(this.sens * VITESSE_DASH, 0);
    }
    const enDash = maintenant < this.finDash;
    if (!enDash && !corps.allowGravity) corps.setAllowGravity(true);
    const enAttaque = maintenant < this.finAttaque;

    if (!enDash) {
      if (gauche) this.sens = -1;
      else if (droite) this.sens = 1;
      const vitesse = enAttaque ? VITESSE_JOUEUR * 0.35 : VITESSE_JOUEUR;
      corps.setVelocityX(gauche ? -vitesse : droite ? vitesse : 0);
    }

    const auSol = corps.blocked.down || corps.touching.down;
    if (veutSauter && auSol && !enDash) corps.setVelocityY(-FORCE_SAUT);
    if (veutAttaquer) this.attaquer();

    // Quelle pose afficher ?
    let pose = 'idle';
    if (enDash) pose = 'dash';
    else if (maintenant < this.finAttaque) pose = 'attack';
    else if (!auSol) pose = 'jump';
    else if (Math.abs(corps.velocity.x) > 20) pose = 'run';
    if (pose !== this.pose) this.definirPose(pose);

    // Petits effets de vie : écrasement à l'atterrissage, respiration, rebond de course
    if (auSol && !this.etaitAuSol) this.ecrasement = 1;
    this.etaitAuSol = auSol;
    this.ecrasement = Math.max(0, this.ecrasement - delta / 140);
    const respiration = pose === 'idle' ? Math.sin(maintenant / 380) * 0.012 : 0;
    const rebond = pose === 'run' ? Math.sin(maintenant / 60) * 0.03 : 0;
    const echelleX = ECHELLE_HEROS * (1 + this.ecrasement * 0.14);
    const echelleY = ECHELLE_HEROS * (1 - this.ecrasement * 0.12 + respiration + rebond);
    this.image.setScale(echelleX, echelleY);
    this.image.setFlipX(this.sens === -1);
    this.image.setAngle(pose === 'run' ? this.sens * 3 : 0);

    const pieds = this.corps.y + this.corps.height / 2;
    this.image.setPosition(this.corps.x, pieds);
    this.halo.setPosition(this.corps.x, this.corps.y - 6);
  }

  attaquer() {
    const maintenant = this.scene.time.now;
    if (maintenant < this.prochaineAttaque) return;
    this.prochaineAttaque = maintenant + RECHARGE_ATTAQUE;
    this.finAttaque = maintenant + DUREE_ATTAQUE;

    const x = this.corps.x + this.sens * 52;
    const y = this.corps.y - 6;
    const zone = new Phaser.Geom.Rectangle(x - 48, y - 40, 96, 80);

    // Le joueur annonce son attaque ; la scène vérifie qui est touché
    this.scene.events.emit('attaque', { zone, sens: this.sens });
  }
}
