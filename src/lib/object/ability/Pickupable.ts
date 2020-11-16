import * as PIXI from 'pixi.js';
import { Character, Player } from '../../character';
import { StaticSystem } from '../../core';
import { Entity } from '../../entity';
import { Vector2 } from '../../geometry';
import { GameSound } from '../../sound';
import { Loader } from '../../system';
import Ability, { ABILITY_NAMES, ABILITY_STATUS } from './Ability';

export enum PICKUPABLE_TYPES {
  HEALTH_POTION = 'healthPotion',
  HEALTH_HEART = 'healthHeart',
}

export default class Pickupable extends Ability {
  protected _rendering: PIXI.Sprite;
  protected _name: ABILITY_NAMES.PICKUPABLE;
  protected _status: ABILITY_STATUS.NOUSE | ABILITY_STATUS.USED = ABILITY_STATUS.NOUSE;

  private _type: PICKUPABLE_TYPES;

  public constructor(
    owner: Character | Entity,
    type: PICKUPABLE_TYPES = PICKUPABLE_TYPES.HEALTH_POTION
  ) {
    super(owner);
    this._name = ABILITY_NAMES.PICKUPABLE;
    this._type = type;

    this.initialize(type);
  }

  public exert(direction: Vector2, player: Player) {
    if (this._type === PICKUPABLE_TYPES.HEALTH_HEART) {
      player.currentHP += 1;
      this._status = ABILITY_STATUS.USED;
      this._rendering.alpha = 0;
      return;
    }

    if (this._type === PICKUPABLE_TYPES.HEALTH_POTION) {
      player.currentHP += 3;
      this._status = ABILITY_STATUS.USED;
      this._rendering.alpha = 0;
      return;
    }
  }

  private initialize(type: PICKUPABLE_TYPES) {
    let sprite: PIXI.Sprite = null;

    if (type === PICKUPABLE_TYPES.HEALTH_POTION) {
      const batch = Loader.textures.UI['health_potion'];

      sprite = new PIXI.Sprite(batch);
    }

    if (type === PICKUPABLE_TYPES.HEALTH_HEART) {
      const batch = Loader.textures.UI['heart'];
      sprite = new PIXI.Sprite(batch);
    }

    sprite.anchor.x = -0.3;
    sprite.zIndex = 0;

    this.rendering = sprite;

    StaticSystem.renderer.add(this);

    GameSound.play('coin');
  }
}
