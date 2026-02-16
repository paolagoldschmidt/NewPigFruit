// Faithful fixed-screen Fruit Pig loop: falling fruits and horizontal pig movement.
import Phaser from 'phaser';
import Player from '../objects/Player.js';
import Fruit from '../objects/Fruit.js';
import ScoreBoard from '../ui/ScoreBoard.js';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GROUND_Y,
  FRUIT_TYPES,
  FRUIT_MAX_ON_SCREEN,
  FRUIT_SPAWN_MIN_MS,
  FRUIT_SPAWN_MAX_MS
} from '../utils/constants.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.spawnTimer = null;
  }

  preload() {
    this.load.image('player', '/assets/sprites/newPlayer.png');
  }

  create() {
    this.createTextures();
    this.createBackground();

    this.player = new Player(this, GAME_WIDTH / 2, GAME_HEIGHT - 40);
    this.add.existing(this.player);
    this.physics.add.existing(this.player);
    this.player.setupBody();

    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.fruits = this.physics.add.group({
      classType: Fruit,
      runChildUpdate: false,
      maxSize: FRUIT_MAX_ON_SCREEN
    });

    this.ground = this.add.rectangle(GAME_WIDTH / 2, GROUND_Y, GAME_WIDTH, 8, 0x000000, 0);
    this.physics.add.existing(this.ground, true);

    this.scoreBoard = new ScoreBoard(this);

    this.physics.add.overlap(this.player, this.fruits, this.handleCatch, null, this);
    this.physics.add.collider(this.fruits, this.ground, this.handleMiss, null, this);

    this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.scheduleNextSpawn();
  }

  createBackground() {
    this.cameras.main.setBackgroundColor('#6fa8dc');
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 8, GAME_WIDTH, 16, 0x4f8f2d).setOrigin(0.5);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 14, GAME_WIDTH, 4, 0x72b848).setOrigin(0.5);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 3, GAME_WIDTH, 2, 0x2f5f1b).setOrigin(0.5);
  }

  createTextures() {
    if (this.textures.exists('banana')) {
      return;
    }

    this.textures.generate('banana', {
      pixelWidth: 1,
      data: [
        '................',
        '................',
        '.....oo.........',
        '....oyyo........',
        '....oyyyo.......',
        '....oyyyyo......',
        '.....oyyyyo.....',
        '......oyyyyo....',
        '.......oyyyyo...',
        '........oyyyyo..',
        '.........oyyyo..',
        '..........oyyo..',
        '...........oo...',
        '................',
        '................',
        '................'
      ],
      palette: {
        o: '#3a2a12',
        y: '#f2d553'
      }
    });

    this.textures.generate('apple', {
      pixelWidth: 1,
      data: [
        '................',
        '.......bb.......',
        '......bggb......',
        '......brrb......',
        '.....orrrro.....',
        '....orrrrrro....',
        '....orrrrrro....',
        '....orrrrrro....',
        '....orrrrrro....',
        '....orrrrrro....',
        '.....orrrro.....',
        '......orro......',
        '................',
        '................',
        '................',
        '................'
      ],
      palette: {
        o: '#2f1e18',
        r: '#c73a35',
        g: '#5ea838',
        b: '#65462e'
      }
    });

    this.textures.generate('lemon', {
      pixelWidth: 1,
      data: [
        '................',
        '................',
        '......oooo......',
        '....ooyyyyoo....',
        '...ooyyyyyyoo...',
        '..ooyyyyyyyyoo..',
        '..ooyyyyyyyyoo..',
        '..ooyyyyyyyyoo..',
        '..ooyyyyyyyyoo..',
        '..ooyyyyyyyyoo..',
        '...ooyyyyyyoo...',
        '....ooyyyyoo....',
        '......oooo......',
        '................',
        '................',
        '................'
      ],
      palette: {
        o: '#3a2a12',
        y: '#f1dc69'
      }
    });
  }

  randomDelay() {
    return Phaser.Math.Between(FRUIT_SPAWN_MIN_MS, FRUIT_SPAWN_MAX_MS);
  }

  scheduleNextSpawn() {
    this.spawnTimer = this.time.delayedCall(this.randomDelay(), () => {
      this.spawnFruit();
      this.scheduleNextSpawn();
    });
  }

  spawnFruit() {
    if (this.fruits.countActive(true) >= FRUIT_MAX_ON_SCREEN) {
      return;
    }

    const type = Phaser.Utils.Array.GetRandom(FRUIT_TYPES);
    const x = Phaser.Math.Between(12, GAME_WIDTH - 12);

    this.fruits.add(new Fruit(this, x, -12, type));
  }

  handleCatch(_player, fruit) {
    this.scoreBoard.addFruit(fruit.fruitType);
    fruit.destroy();
  }

  handleMiss(fruit) {
    fruit.destroy();
  }

  update() {
    this.player.update(this.cursors);

    if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      this.scene.restart();
    }

    this.fruits.children.iterate((fruit) => {
      if (fruit && fruit.active && fruit.y > GAME_HEIGHT + 16) {
        fruit.destroy();
      }
    });
  }
}
