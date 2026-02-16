// Player controlled with rigid arcade horizontal movement.
import Phaser from 'phaser';
import { PLAYER_SPEED } from '../utils/constants.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    this.setupControls();
  }

  setupControls() {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  setupBody() {
    // The provided official PNG can be exported in very large dimensions.
    // Fit it to the intended gameplay size while preserving aspect ratio.
    if (this.height > 24) {
      const scale = 24 / this.height;
      this.setScale(scale);
    }

    this.body.setSize(this.width - 6, this.height - 8);
    this.body.setOffset(3, 4);
    this.setCollideWorldBounds(true);
    this.body.allowGravity = false;
    this.setImmovable(false);
    this.setBounce(0);
  }

  moveLeft() {
    this.setVelocityX(-PLAYER_SPEED);
  }

  moveRight() {
    this.setVelocityX(PLAYER_SPEED);
  }

  stop() {
    this.setVelocityX(0);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.moveLeft();
    } else if (this.cursors.right.isDown) {
      this.moveRight();
    } else {
      this.stop();
    }
  }
}
