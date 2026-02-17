// Fixed scoreboard showing per-fruit counts.
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants.js';

const pad2 = (value) => String(value).padStart(2, '0');

export default class ScoreBoard {
  constructor(scene) {
    this.scene = scene;
    this.counts = {
      banana: 0,
      apple: 0,
      lemon: 0
    };
    this.currentLevel = 1;
    this.currentTime = 60;

    const uiScale = GAME_HEIGHT / 240;
    const margin = Math.round(6 * uiScale);
    const fontSize = `${Math.round(10 * uiScale)}px`;

    const panelWidth = GAME_WIDTH - ((margin - 4) * 2);

    this.panel = scene.add.rectangle(
      margin - 4,
      margin - 4,
      panelWidth,
      Math.round(34 * uiScale),
      0x000000,
      0.4
    ).setOrigin(0, 0);
    this.panel.setScrollFactor(0);
    this.panel.setDepth(100);

    this.text = scene.add.text(margin, margin, this.formatText(), {
      fontFamily: 'monospace',
      fontSize,
      color: '#ffffff',
      lineSpacing: 0
    });
    this.text.setScrollFactor(0);
    this.text.setDepth(101);

    this.metaText = scene.add.text(margin, margin + Math.round(14 * uiScale), this.formatMeta(), {
      fontFamily: 'monospace',
      fontSize,
      color: '#ffffff',
      lineSpacing: 0
    });
    this.metaText.setScrollFactor(0);
    this.metaText.setDepth(101);

    this.hint = scene.add.text(GAME_WIDTH - margin, margin + Math.round(14 * uiScale), 'R', {
      fontFamily: 'monospace',
      fontSize,
      color: '#ffffff'
    });
    this.hint.setOrigin(1, 0);
    this.hint.setScrollFactor(0);
    this.hint.setDepth(101);
  }

  addFruit(type) {
    if (type === 'baccon') {
      this.counts.banana = 0;
      this.counts.apple = 0;
      this.counts.lemon = 0;
      this.text.setText(this.formatText());
      return;
    }

    if (!this.counts[type] && this.counts[type] !== 0) {
      return;
    }

    this.counts[type] += 1;
    this.text.setText(this.formatText());
  }

  formatText() {
    return `BANANA: ${pad2(this.counts.banana)}   MAÇÃ: ${pad2(this.counts.apple)}   LIMÃO: ${pad2(this.counts.lemon)}`;
  }

  setTimer(secondsLeft) {
    const clamped = Math.max(0, Math.ceil(secondsLeft));
    this.currentTime = clamped;
    this.metaText.setText(this.formatMeta());
  }

  setLevel(level) {
    this.currentLevel = level;
    this.metaText.setText(this.formatMeta());
  }

  getCounts() {
    return { ...this.counts };
  }

  resetCounts() {
    this.counts.banana = 0;
    this.counts.apple = 0;
    this.counts.lemon = 0;
    this.text.setText(this.formatText());
  }

  formatMeta() {
    return `LEVEL: ${this.currentLevel}   TIME: ${pad2(this.currentTime)}`;
  }
}
