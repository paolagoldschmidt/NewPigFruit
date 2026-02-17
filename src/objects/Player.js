// Player controlled with rigid arcade horizontal movement.
import Phaser from 'phaser';
import { PLAYER_SPEED } from '../utils/constants.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
  }

  setupBody() {
    // Keep the exact on-screen size while using a higher-resolution source texture.
    this.setDisplaySize(384, 256);
    this.setOrigin(0.5, 1);

    // Narrower collision body lets the player reach both world edges while preserving visual size.
    this.body.setSize(this.width * 0.35, this.height * 0.85);
    this.body.setOffset(this.width * 0.325, this.height * 0.10);

    this.setCollideWorldBounds(true);
    this.body.allowGravity = false;
    this.setImmovable(false);
    this.setBounce(0);
  }

  stop() {
    this.setVelocityX(0);
  }

  update(cursors) {
    if (!cursors) {
      this.stop();
      return;
    }

    if (cursors.left.isDown) {
      this.setVelocityX(-PLAYER_SPEED);
    } else if (cursors.right.isDown) {
      this.setVelocityX(PLAYER_SPEED);
    } else {
      this.stop();
    }
  }
}
