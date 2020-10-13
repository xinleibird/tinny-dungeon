import * as PIXI from 'pixi.js';
import { Loader } from '../../system';
import { Ability, ABILITY_NAMES } from './';

export const DecoratorTypesWeight = {
  '0': 100,
  '1': 2,
  '2': 2,
  '3': 2,
  '4': 2,
  '5': 2,
  '6': 2,
  '7': 2,
  '8': 2,
  '9': 2,
  '10': 2,
  '11': 2,
  '12': 2,
  '13': 2,
  '14': 2,
  '15': 2,
  '16': 2,
  '17': 2,
  '18': 2,
  '19': 1,
  '20': 1,
};

export default class Decorateable extends Ability {
  private _sprite: PIXI.Sprite;

  public constructor(decoratorIndex: number) {
    super();

    this._name = ABILITY_NAMES.DECORATEABLE;
    this.initialize(decoratorIndex);
  }

  private initialize(decoratorIndex: number) {
    const length = Object.keys(DecoratorTypesWeight).length;
    if (decoratorIndex !== 0 && decoratorIndex < length) {
      const sprite = new PIXI.Sprite(Loader.textures.FLOOR_DECORATORS[decoratorIndex]);
      sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;

      this._sprite = sprite;
    }
  }

  public get sprite() {
    return this._sprite;
  }
}
