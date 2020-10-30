import * as PIXI from 'pixi.js';
import { Character } from '../../character';
import { StaticSystem } from '../../core';
import { Entity } from '../../entity';
import { Vector2 } from '../../geometry';
import { GameSound } from '../../sound';
import { Loader } from '../../system';
import Ability, { ABILITY_NAMES, ABILITY_STATUS } from './Ability';

type OpenableStatus = ABILITY_STATUS.CLOSE | ABILITY_STATUS.OPEN;

export default class Openable extends Ability {
  protected _status: ABILITY_STATUS.CLOSE | ABILITY_STATUS.OPEN;
  protected _rendering: PIXI.AnimatedSprite;
  public constructor(
    owner: Character | Entity,
    initStatus: OpenableStatus = ABILITY_STATUS.CLOSE,
    direction: Vector2
  ) {
    super(owner);
    this._name = ABILITY_NAMES.OPENABLE;
    this._status = initStatus;

    this.initialize(initStatus, direction);
  }

  public exert() {}

  private initialize(initStatus: OpenableStatus, direction: Vector2) {
    let sprite: PIXI.AnimatedSprite = null;

    if (direction.equals(Vector2.center)) {
      sprite = new PIXI.AnimatedSprite([Loader.textures.DOORS[4], Loader.textures.DOORS[5]]);
    } else {
      if (direction.equals(Vector2.right) || direction.equals(Vector2.left)) {
        sprite = new PIXI.AnimatedSprite([Loader.textures.DOORS[2], Loader.textures.DOORS[3]]);
      } else {
        sprite = new PIXI.AnimatedSprite([Loader.textures.DOORS[0], Loader.textures.DOORS[1]]);
      }
    }

    sprite.anchor.y = 0.5;
    sprite.loop = false;

    if (initStatus === ABILITY_STATUS.CLOSE) {
      sprite.gotoAndStop(0);
    } else {
      sprite.gotoAndStop(1);
    }

    this.rendering = sprite;

    StaticSystem.renderer.add(this);
  }

  public get status() {
    return this._status;
  }

  public set status(status: OpenableStatus) {
    if (status === ABILITY_STATUS.CLOSE) {
      this._rendering.gotoAndStop(0);
    } else {
      GameSound.play('door_open');
      this._rendering.gotoAndStop(1);
    }
    this._status = status;
  }

  public get sprite(): PIXI.AnimatedSprite {
    return this._rendering;
  }
}
