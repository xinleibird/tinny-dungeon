import * as PIXI from 'pixi.js';
import StaticSystem from '../../core/static';
import { Vector2 } from '../../geometry';
import { Loader } from '../../system';
import { Ability, ABILITY_NAMES } from './';

export default class Clearable extends Ability {
  protected _rendering: PIXI.Sprite;

  public constructor(geometryPosition: Vector2) {
    super(geometryPosition);

    this._name = ABILITY_NAMES.CLEARABLE;
    this.initialize(geometryPosition);
  }

  private initialize(geometryPosition: Vector2) {
    const sprite = new PIXI.Sprite(Loader.textures.STAIRS[1]);
    sprite.anchor.y = 0.5;

    this._rendering = sprite;
    this.geometryPosition = geometryPosition;

    StaticSystem.renderer.add(this);
  }

  public get rendering() {
    return this._rendering;
  }
}
