import * as PIXI from 'pixi.js';
import { StaticSystem } from '../../core';
import { Vector2 } from '../../geometry';
import { Loader } from '../../system';
import { ABILITY_NAMES, default as Ability } from './Ability';

export default class Respawnable extends Ability {
  protected _rendering: PIXI.Sprite;

  public constructor(geometryPosition: Vector2) {
    super(geometryPosition);

    this._name = ABILITY_NAMES.RESPAWNABLE;
    this.initialize(geometryPosition);
  }

  private initialize(geometryPosition: Vector2) {
    const sprite = new PIXI.Sprite(Loader.textures.STAIRS[0]);
    sprite.anchor.y = 0.5;

    this._rendering = sprite;
    this.geometryPosition = geometryPosition;

    StaticSystem.renderer.add(this);
  }

  public get rendering() {
    return this._rendering;
  }
}
