// Player controlled with rigid arcade horizontal movement.
import Phaser from 'phaser';
import { PLAYER_SPEED } from '../utils/constants.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
  }

  setupBody() {
    this.setOrigin(0.5, 1);

    this.body.setSize(this.width * 0.80, this.height * 0.85);
    this.body.setOffset(this.width * 0.10, this.height * 0.10);

    this.setCollideWorldBounds(true);
    this.body.allowGravity = false;
    this.setImmovable(false);
    this.setBounce(0);
  }

  stop() {
    this.setVelocityX(0);
  }

  update(cursors) {
    if (cursors.left.isDown) {
      this.setVelocityX(-PLAYER_SPEED);
    } else if (cursors.right.isDown) {
      this.setVelocityX(PLAYER_SPEED);
    } else {
      this.setVelocityX(0);
    }
  }
}
