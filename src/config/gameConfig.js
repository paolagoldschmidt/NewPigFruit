// Phaser configuration for NES-like fixed screen.
import Phaser from 'phaser';
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GAME_ZOOM,
  WORLD_GRAVITY_Y
} from '../utils/constants.js';
import GameScene from '../scenes/GameScene.js';
import EndScene from '../scenes/EndScene.js';

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
    autoCenter: Phaser.Scale.NO_CENTER
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: WORLD_GRAVITY_Y },
      debug: false
    }
  },
  scene: [GameScene, EndScene]
};

export default gameConfig;
