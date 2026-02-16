// Phaser configuration for NES-like fixed screen.
import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GAME_ZOOM, WORLD_GRAVITY_Y } from '../utils/constants.js';
import GameScene from '../scenes/GameScene.js';

const gameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  zoom: GAME_ZOOM,
  parent: 'game-container',
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  backgroundColor: '#6fa8dc',
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: WORLD_GRAVITY_Y },
      debug: false
    }
  },
  scene: [GameScene]
};

export default gameConfig;
