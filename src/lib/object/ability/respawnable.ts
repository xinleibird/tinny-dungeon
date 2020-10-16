import * as PIXI from 'pixi.js';
import { Loader } from '../../system';
import { Ability, ABILITY_NAMES } from './';

export default class Respawnable extends Ability {
  public constructor() {
    super();

    this._name = ABILITY_NAMES.RESPAWNABLE;
    this.initialize();
  }

  private initialize() {
    const sprite = new PIXI.Sprite(Loader.textures.STAIRS[0]);
    sprite.anchor.y = 0.5;

    this._sprite = sprite;
  }
}
