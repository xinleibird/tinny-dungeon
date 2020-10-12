import * as PIXI from 'pixi.js';
import { Vector2 } from '../../geometry';
import { Loader } from '../../system';
import Ability, { ABILITY_NAMES, ABILITY_STATUS } from './ability';

export default class Openable extends Ability {
  protected _status: ABILITY_STATUS.CLOSE | ABILITY_STATUS.OPEN;
  private _sprite: PIXI.AnimatedSprite;
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
    const sprite =
      direction.equals(Vector2.right) || direction.equals(Vector2.left)
        ? new PIXI.AnimatedSprite([Loader.textures.DOORS[0], Loader.textures.DOORS[1]])
        : new PIXI.AnimatedSprite([Loader.textures.DOORS[2], Loader.textures.DOORS[3]]);

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

  public get sprite() {
    return this._sprite;
  }
}
