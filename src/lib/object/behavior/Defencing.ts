import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import { Character } from '../../character';
import { Vector2 } from '../../geometry';
import { GameSound } from '../../sound';
import { EXTERNAL_NAMES } from '../external/External';
import Behavior, { BEHAVIOR_NAMES } from './Behavior';

export default class Defencing extends Behavior {
  public constructor(character: Character) {
    super(character);
    this._name = BEHAVIOR_NAMES.DEFENCING;
  }

  public do(direction: Vector2) {
    return new Promise((resolve, reject) => {
      this._character.showExternal(EXTERNAL_NAMES.DIRECTION_INDICATOR);
      setTimeout(() => {
        const filter = new PIXI.filters.ColorMatrixFilter();
        this._character.rendering.filters = [filter];
        gsap.to(this._character.rendering, {
          duration: 0.2,
          onStart: () => {
            filter.greyscale(0.38, true);
            GameSound.play('defence');
          },
          onComplete: () => {
            this._character.rendering.filters = [];
            this._character.hideExternal(EXTERNAL_NAMES.DIRECTION_INDICATOR);
            resolve(true);
          },
        });
      }, 50);
    });
  }

  public canDo(direction: Vector2) {
    if (direction?.equals(Vector2.center)) {
      return true;
    }
    return false;
  }
}
