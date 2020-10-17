import * as PIXI from 'pixi.js';
import { Vector2 } from '../../geometry';

export enum EXTERNAL_NAMES {
  ABSTRACT_EXTERNAL = 'AbstractExternal',
  DIRECTION_INDICATOR = 'DirectionIndicator',
}

export default class External {
  protected _sprite: PIXI.Sprite;
  protected _direction: Vector2;
  protected _name: EXTERNAL_NAMES;

  private _visiable = true;

  protected constructor() {
    this._name = EXTERNAL_NAMES.ABSTRACT_EXTERNAL;
  }

  public get direction() {
    return this._direction;
  }

  public set direction(direction: Vector2) {
    this._direction = direction;
  }

  public get visiable() {
    return this._visiable;
  }

  public set visiable(visiable: boolean) {
    this._visiable = visiable;

    this._sprite.visible = visiable;
  }

  public get name() {
    return this._name;
  }

  public get sprite() {
    return this._sprite;
  }
}
