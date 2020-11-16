import * as PIXI from 'pixi.js';
import { Renderable } from '../../abstraction';
import { Character } from '../../character';
import { Vector2 } from '../../geometry';

export enum EXTERNAL_NAMES {
  ABSTRACT_EXTERNAL = 'AbstractExternal',
  DIRECTION_INDICATOR = 'DirectionIndicator',
  DAMAGE_INDICATOR = 'DamageIndicator',
}

export default abstract class External extends Renderable {
  protected _direction: Vector2;
  protected _name: EXTERNAL_NAMES;
  protected _visiable = true;

  protected _owner: Character;

  protected constructor(owner: Character) {
    super();
    this._name = EXTERNAL_NAMES.ABSTRACT_EXTERNAL;
    this._owner = owner;
  }

  public get rendering() {
    return this._rendering;
  }
  public set rendering(rendering: PIXI.DisplayObject) {
    this._rendering = rendering;
  }

  public get direction() {
    return this._direction;
  }

  public set direction(direction: Vector2) {
    this._direction = direction;
  }

  public abstract get visiable(): boolean;
  public abstract set visiable(visiable: boolean);

  public get name() {
    return this._name;
  }
}
