import * as PIXI from 'pixi.js';

import { Vector2 } from '../../geometry';
import { Loader } from '../../system';
import Ability, { ABILITY_NAMES } from './ability';

export default class Openable extends Ability {
  protected _status: 'close' | 'open' = 'close';
  private _sprite: PIXI.AnimatedSprite;
  public constructor(initStatus: 'close' | 'open' = 'close', direction: Vector2) {
    super();
    this._name = ABILITY_NAMES.OPENABLE;
    this._status = initStatus;

    this.initialize(initStatus, direction);
  }

  private initialize(initStatus: 'close' | 'open', direction: Vector2) {
    const sprite = direction.equals(Vector2.right())
      ? new PIXI.AnimatedSprite([Loader.textures.DOORS[0], Loader.textures.DOORS[1]])
      : new PIXI.AnimatedSprite([Loader.textures.DOORS[2], Loader.textures.DOORS[3]]);

    sprite.anchor.y = 0.5;
    sprite.loop = false;

    if (initStatus === 'close') {
      sprite.gotoAndStop(0);
    } else {
      sprite.gotoAndStop(1);
    }

    this._sprite = sprite;
  }

  public get status() {
    return this._status;
  }

  public set status(status: 'close' | 'open') {
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
