// Falling fruit with per-body gravity and capped vertical speed.
import Phaser from 'phaser';
import { FRUIT_FALL_SPEED, FRUIT_GRAVITY_Y } from '../utils/constants.js';

export default class Fruit extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, fruitType) {
    super(scene, x, y, fruitType);

    this.fruitType = fruitType;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setVelocity(0, FRUIT_FALL_SPEED);
    this.setMaxVelocity(0, FRUIT_FALL_SPEED);
    this.body.setGravityY(FRUIT_GRAVITY_Y);
  }
}
