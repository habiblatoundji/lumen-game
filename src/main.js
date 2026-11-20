// Point de départ : lance le jeu
new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'jeu',
  width: LARGEUR,
  height: HAUTEUR,
  backgroundColor: '#080a18',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade', arcade: { gravity: { y: GRAVITE } } },
  scene: SceneJeu
});
