import * as PIXI from 'pixi.js';
import { Character } from '../../character';
import { StaticSystem } from '../../core';
import { Entity } from '../../entity';
import { Loader } from '../../system';
import { ABILITY_NAMES, default as Ability } from './Ability';

export default class Respawnable extends Ability {
  protected _rendering: PIXI.Sprite;

  public constructor(owner: Character | Entity) {
    super(owner);

    this._name = ABILITY_NAMES.RESPAWNABLE;
    this.initialize();
  }

  private initialize() {
    const sprite = new PIXI.Sprite(Loader.textures.STAIRS[0]);
    sprite.anchor.y = 0.5;

    this.rendering = sprite;

    StaticSystem.renderer.add(this);
  }
}
