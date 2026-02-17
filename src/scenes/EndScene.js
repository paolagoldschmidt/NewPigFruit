import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../utils/constants.js';

export default class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene');
  }

  preload() {
    if (!this.textures.exists('background')) {
      this.load.image('background', '/assets/backgrounds/bg.png');
    }
    if (!this.textures.exists('player')) {
      this.load.image('player', '/assets/sprites/newPlayer.png');
    }
  }

  create() {
    const bg = this.add.image(0, 0, 'background').setOrigin(0, 0).setDepth(-10);
    const scaleX = GAME_WIDTH / bg.width;
    const scaleY = GAME_HEIGHT / bg.height;
    bg.setScale(Math.max(scaleX, scaleY));

    const panel = this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      Math.round(GAME_WIDTH * 0.72),
      Math.round(GAME_HEIGHT * 0.42),
      0x000000,
      0.45
    );
    panel.setDepth(10);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.28, 'VOCE ZEROU O JOGO!', {
      fontFamily: 'monospace',
      fontSize: `${Math.round(18 * (GAME_HEIGHT / 240))}px`,
      color: '#ffffff'
    }).setOrigin(0.5).setDepth(11);

    const dancer = this.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT * 0.62, 'player');
    dancer.setDisplaySize(384, 256);
    dancer.setOrigin(0.5, 1);
    dancer.setDepth(11);

    // Dance loop: sway + hop.
    this.tweens.add({
      targets: dancer,
      x: { from: dancer.x - 36, to: dancer.x + 36 },
      angle: { from: -8, to: 8 },
      duration: 360,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    this.tweens.add({
      targets: dancer,
      y: dancer.y - 18,
      duration: 180,
      ease: 'Sine.easeOut',
      yoyo: true,
      repeat: -1
    });

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.86, 'APERTE ENTER PARA JOGAR NOVAMENTE', {
      fontFamily: 'monospace',
      fontSize: `${Math.round(11 * (GAME_HEIGHT / 240))}px`,
      color: '#ffffff'
    }).setOrigin(0.5).setDepth(11);

    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.scene.start('GameScene');
    }
  }
}
