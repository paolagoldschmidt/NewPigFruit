// Fixed scoreboard showing per-fruit counts.
import { GAME_WIDTH } from '../utils/constants.js';

const pad2 = (value) => String(value).padStart(2, '0');

export default class ScoreBoard {
  constructor(scene) {
    this.scene = scene;
    this.counts = {
      banana: 0,
      apple: 0,
      lemon: 0
    };

    this.text = scene.add.text(6, 6, this.formatText(), {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#ffffff',
      lineSpacing: 2
    });
    this.text.setScrollFactor(0);

    this.hint = scene.add.text(GAME_WIDTH - 6, 6, 'R', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#ffffff'
    });
    this.hint.setOrigin(1, 0);
    this.hint.setScrollFactor(0);
  }

  addFruit(type) {
    if (!this.counts[type] && this.counts[type] !== 0) {
      return;
    }

    this.counts[type] += 1;
    this.text.setText(this.formatText());
  }

  formatText() {
    return [
      `BANANA: ${pad2(this.counts.banana)}`,
      `MAÇÃ:   ${pad2(this.counts.apple)}`,
      `LIMÃO:  ${pad2(this.counts.lemon)}`
    ].join('\n');
  }
}
