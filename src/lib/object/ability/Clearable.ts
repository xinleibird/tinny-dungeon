import * as PIXI from 'pixi.js';
import { Ability, ABILITY_NAMES } from '.';
import { Character } from '../../character';
import { StaticSystem } from '../../core';
import { Entity } from '../../entity';
import { Loader } from '../../system';

export default class Clearable extends Ability {
  protected _rendering: PIXI.Sprite;

  public constructor(owner: Character | Entity) {
    super(owner);

    this._name = ABILITY_NAMES.CLEARABLE;
    this.initialize();
  }

  public exert() {}

  private initialize() {
    const sprite = new PIXI.Sprite(Loader.textures.STAIRS[1]);
    sprite.anchor.y = 0.5;

    this.rendering = sprite;

    StaticSystem.renderer.add(this);
  }
}
