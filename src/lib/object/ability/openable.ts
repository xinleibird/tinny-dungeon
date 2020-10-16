import * as PIXI from 'pixi.js';
import { Vector2 } from '../../geometry';
import { Loader } from '../../system';
import Ability, { ABILITY_NAMES, ABILITY_STATUS } from './ability';

export default class Openable extends Ability {
  protected _status: ABILITY_STATUS.CLOSE | ABILITY_STATUS.OPEN;
  protected _sprite: PIXI.AnimatedSprite;
  public constructor(
    initStatus: ABILITY_STATUS.CLOSE | ABILITY_STATUS.OPEN = ABILITY_STATUS.CLOSE,
    direction: Vector2
  ) {
    super();
    this._name = ABILITY_NAMES.OPENABLE;
    this._status = initStatus;

    this.initialize(initStatus, direction);
  }

  private initialize(
    initStatus: ABILITY_STATUS.CLOSE | ABILITY_STATUS.OPEN,
    direction: Vector2
  ) {
    let sprite = null;

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

    this._sprite = sprite;
  }

  public get status() {
    return this._status;
  }

  public set status(status: ABILITY_STATUS.CLOSE | ABILITY_STATUS.OPEN) {
    if (status === 'close') {
      this._sprite.gotoAndStop(0);
    } else {
      this._sprite.gotoAndStop(1);
    }
    this._status = status;
  }

  public get sprite(): PIXI.AnimatedSprite {
    return this._sprite;
  }
}
