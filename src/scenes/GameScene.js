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
  FRUIT_SPAWN_MAX_MS,
  LEVEL_1_TARGET_PER_FRUIT,
  LEVEL_1_TIME_SECONDS,
  LEVEL_2_TARGET_PER_FRUIT,
  LEVEL_2_TIME_SECONDS,
  LEVEL_3_TARGET_PER_FRUIT,
  LEVEL_3_TIME_SECONDS
} from '../utils/constants.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.spawnTimer = null;
    this.worldGroundY = GROUND_Y;
    this.levelActive = false;
    this.currentLevel = 1;
    this.levelPhase = 'playing';
    this.levelTimeLeft = LEVEL_1_TIME_SECONDS;
    this.levelStatus = null;
    this.levelStatusPanel = null;
    this.lastShownSecond = LEVEL_1_TIME_SECONDS;
  }

  preload() {
    this.load.image('background', '/assets/backgrounds/bg.png');
    this.load.image('player', '/assets/sprites/newPlayer.png');
    this.load.image('banana', '/assets/sprites/banana.svg');
    this.load.image('apple', '/assets/sprites/apple.svg');
    this.load.image('lemon', '/assets/sprites/lemon.svg');
    this.load.image('baccon', '/assets/sprites/baccon.svg');
  }

  create() {
    const bg = this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDepth(-10);

    const scaleX = GAME_WIDTH / bg.width;
    const scaleY = GAME_HEIGHT / bg.height;

    const scale = Math.max(scaleX, scaleY);

    bg.setScale(scale);

    // Keep scene dimensions as-is and align gameplay coords to the 256x240 source layout.
    this.worldGroundY = GROUND_Y * (GAME_HEIGHT / 240);

    this.player = new Player(this, GAME_WIDTH / 2, this.worldGroundY);
    this.add.existing(this.player);
    this.physics.add.existing(this.player);
    this.player.setDepth(1);
    this.player.setupBody();

    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN
    ]);

    this.fruits = this.physics.add.group({
      classType: Fruit,
      runChildUpdate: false,
      maxSize: FRUIT_MAX_ON_SCREEN
    });

    this.ground = this.add.rectangle(GAME_WIDTH / 2, this.worldGroundY, GAME_WIDTH, 8, 0x000000, 0);
    this.physics.add.existing(this.ground, true);

    this.scoreBoard = new ScoreBoard(this);
    this.scoreBoard.setLevel(1);
    this.scoreBoard.setTimer(this.levelTimeLeft);

    this.levelStatus = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '', {
      fontFamily: 'monospace',
      fontSize: `${Math.round(12 * (GAME_HEIGHT / 240))}px`,
      color: '#ffffff',
      align: 'center'
    });
    this.levelStatus.setOrigin(0.5, 0.5);
    this.levelStatus.setScrollFactor(0);
    this.levelStatus.setDepth(101);

    this.levelStatusPanel = this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      0,
      0,
      0x000000,
      0.4
    );
    this.levelStatusPanel.setOrigin(0.5, 0.5);
    this.levelStatusPanel.setScrollFactor(0);
    this.levelStatusPanel.setDepth(100);
    this.levelStatusPanel.setVisible(false);

    this.physics.add.overlap(this.player, this.fruits, this.handleCatch, this.isHeadCatch, this);
    this.physics.add.collider(this.fruits, this.ground, this.handleMiss, null, this);

    this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.startLevel(1);
  }

  createTextures() {
    if (this.textures.exists('banana')) {
      return;
    }

    this.textures.generate('banana', {
      pixelWidth: 3,
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
      pixelWidth: 3,
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
      pixelWidth: 3,
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
    if (!this.levelActive) {
      return;
    }

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
    if (!this.levelActive) {
      return;
    }

    this.scoreBoard.addFruit(fruit.fruitType);
    fruit.destroy();
  }

  isHeadCatch(player, fruit) {
    const playerBody = player.body;
    const fruitBody = fruit.body;

    if (!playerBody || !fruitBody) {
      return false;
    }

    // Accept only fruits falling onto the top area of the player's head.
    const headHalfWidth = playerBody.width * 0.28;
    const minHeadX = playerBody.center.x - headHalfWidth;
    const maxHeadX = playerBody.center.x + headHalfWidth;
    const fruitCenterX = fruitBody.center.x;
    const inHeadXRange = fruitCenterX >= minHeadX && fruitCenterX <= maxHeadX;

    const topContactLimit = playerBody.top + (playerBody.height * 0.35);
    const inTopContactZone = fruitBody.bottom >= playerBody.top && fruitBody.top <= topContactLimit;

    const isFalling = fruitBody.velocity.y > 0;

    return isFalling && inHeadXRange && inTopContactZone;
  }

  handleMiss(fruit) {
    fruit.destroy();
  }

  getLevelConfig(level) {
    if (level === 3) {
      return {
        targetPerFruit: LEVEL_3_TARGET_PER_FRUIT,
        timeSeconds: LEVEL_3_TIME_SECONDS
      };
    }

    if (level === 2) {
      return {
        targetPerFruit: LEVEL_2_TARGET_PER_FRUIT,
        timeSeconds: LEVEL_2_TIME_SECONDS
      };
    }

    return {
      targetPerFruit: LEVEL_1_TARGET_PER_FRUIT,
      timeSeconds: LEVEL_1_TIME_SECONDS
    };
  }

  setLevelStatusMessage(message) {
    this.levelStatus.setText(message);
    this.levelStatus.setWordWrapWidth(Math.round(GAME_WIDTH * 0.86), true);

    const baseFontPx = Math.round(12 * (GAME_HEIGHT / 240));
    const minFontPx = Math.max(10, Math.round(8 * (GAME_HEIGHT / 240)));
    let fontPx = baseFontPx;
    this.levelStatus.setFontSize(`${fontPx}px`);

    let bounds = this.levelStatus.getBounds();
    const maxTextWidth = Math.round(GAME_WIDTH * 0.86);
    while (bounds.width > maxTextWidth && fontPx > minFontPx) {
      fontPx -= 1;
      this.levelStatus.setFontSize(`${fontPx}px`);
      bounds = this.levelStatus.getBounds();
    }

    if (!message) {
      this.levelStatusPanel.setVisible(false);
      return;
    }

    bounds = this.levelStatus.getBounds();
    const paddingX = Math.round(16 * (GAME_HEIGHT / 240));
    const paddingY = Math.round(10 * (GAME_HEIGHT / 240));
    this.levelStatusPanel.setSize(bounds.width + paddingX, bounds.height + paddingY);
    this.levelStatusPanel.setPosition(this.levelStatus.x, this.levelStatus.y);
    this.levelStatusPanel.setVisible(true);
  }

  startLevel(level) {
    const config = this.getLevelConfig(level);

    this.currentLevel = level;
    this.levelPhase = 'playing';
    this.levelActive = true;
    this.levelTimeLeft = config.timeSeconds;
    this.lastShownSecond = Math.ceil(config.timeSeconds);

    this.scoreBoard.resetCounts();
    this.scoreBoard.setLevel(level);
    this.scoreBoard.setTimer(this.levelTimeLeft);
    this.setLevelStatusMessage('');

    if (this.spawnTimer) {
      this.spawnTimer.remove(false);
      this.spawnTimer = null;
    }

    this.scheduleNextSpawn();
  }

  checkLevelGoalReached() {
    const config = this.getLevelConfig(this.currentLevel);
    const counts = this.scoreBoard.getCounts();
    return counts.banana >= config.targetPerFruit
      && counts.apple >= config.targetPerFruit
      && counts.lemon >= config.targetPerFruit;
  }

  finishLevel(win) {
    if (!this.levelActive) {
      return;
    }

    this.levelActive = false;
    this.player.stop();

    if (this.spawnTimer) {
      this.spawnTimer.remove(false);
      this.spawnTimer = null;
    }

    this.fruits.children.iterate((fruit) => {
      if (fruit && fruit.active) {
        fruit.destroy();
      }
    });

    if (win) {
      if (this.currentLevel === 1) {
        this.levelPhase = 'level1_win';
        this.setLevelStatusMessage('VOCE VENCEU! APERTE ENTER');
      } else if (this.currentLevel === 2) {
        this.levelPhase = 'level2_win';
        this.setLevelStatusMessage('VOCE VENCEU! APERTE ENTER');
      } else {
        this.levelPhase = 'level3_win';
        this.scene.start('EndScene');
      }
    } else {
      this.levelPhase = 'lose';
      this.setLevelStatusMessage('TEMPO ESGOTADO! APERTE R');
    }
  }

  update(_time, delta) {
    if (this.levelActive) {
      this.player.update(this.cursors);
    } else {
      this.player.stop();
    }

    if (this.levelActive) {
      this.levelTimeLeft = Math.max(0, this.levelTimeLeft - (delta / 1000));

      const shownSecond = Math.ceil(this.levelTimeLeft);
      if (shownSecond !== this.lastShownSecond) {
        this.lastShownSecond = shownSecond;
        this.scoreBoard.setTimer(this.levelTimeLeft);
      }

      if (this.checkLevelGoalReached()) {
        this.finishLevel(true);
      } else if (this.levelTimeLeft <= 0) {
        this.finishLevel(false);
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      if (this.levelPhase === 'level1_win') {
        const level2Config = this.getLevelConfig(2);
        this.levelPhase = 'level2_briefing';
        this.setLevelStatusMessage(
          `DESAFIO LEVEL 2:\nCOLETE ${level2Config.targetPerFruit} BANANAS, ${level2Config.targetPerFruit} maças E ${level2Config.targetPerFruit} LIMOES EM ${level2Config.timeSeconds}S\nAPERTE ENTER PARA começar`
        );
      } else if (this.levelPhase === 'level2_briefing') {
        this.startLevel(2);
      } else if (this.levelPhase === 'level2_win') {
        const level3Config = this.getLevelConfig(3);
        this.levelPhase = 'level3_briefing';
        this.setLevelStatusMessage(
          `DESAFIO LEVEL 3:\nCOLETE ${level3Config.targetPerFruit} BANANAS, ${level3Config.targetPerFruit} maças E ${level3Config.targetPerFruit} LIMOES EM ${level3Config.timeSeconds}S\nAPERTE ENTER PARA começar`
        );
      } else if (this.levelPhase === 'level3_briefing') {
        this.startLevel(3);
      }
    }

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
