import * as PIXI from 'pixi.js';
import { Ability, ABILITY_NAMES } from '.';
import { Character } from '../../character';
import { StaticSystem } from '../../core';
import { Entity } from '../../entity';
import { Loader } from '../../system';

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
  public constructor(owner: Character | Entity, decoratorIndex: number) {
    super(owner);

    this._name = ABILITY_NAMES.DECORATEABLE;

    this.initialize(decoratorIndex);
  }

  private initialize(decoratorIndex: number) {
    const length = Object.keys(DecoratorTypesWeight).length;
    if (decoratorIndex !== 0 && decoratorIndex < length) {
      const sprite = new PIXI.Sprite(Loader.textures.FLOOR_DECORATORS[decoratorIndex]);
      sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
      this.rendering = sprite;

      StaticSystem.renderer.add(this);
    }
  }
}
