import * as PIXI from 'pixi.js';
import StaticSystem from '../../core/static';
import { Vector2 } from '../../geometry';
import { Loader } from '../../system';
import { Ability, ABILITY_NAMES } from './';

export const DecoratorTypesWeight = {
  '0': 150,
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
  '19': 2,
  '20': 2,
  '21': 2,
  '22': 2,
  '23': 2,
  '24': 2,
  '25': 1,
  '26': 1,
};

export default class Decorateable extends Ability {
  public constructor(geometryPosition: Vector2, decoratorIndex: number) {
    super(geometryPosition);

    this._name = ABILITY_NAMES.DECORATEABLE;
    this.initialize(geometryPosition, decoratorIndex);
  }

  private initialize(geometryPosition: Vector2, decoratorIndex: number) {
    const length = Object.keys(DecoratorTypesWeight).length;
    if (decoratorIndex !== 0 && decoratorIndex < length) {
      const sprite = new PIXI.Sprite(Loader.textures.FLOOR_DECORATORS[decoratorIndex]);
      sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;

      this._rendering = sprite;
      this.geometryPosition = geometryPosition;

      StaticSystem.renderer.add(this);
    }
  }

  public get rendering() {
    return this._rendering;
  }
}
