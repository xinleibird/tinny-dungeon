import * as PIXI from 'pixi.js';
import { Renderable } from '../../abstraction';
import { Character } from '../../character';
import { Entity } from '../../entity';
import { Vector2 } from '../../geometry';

export enum ABILITY_NAMES {
  ABSTRACT_ABILITY = 'AbstractAbility',
  OPENABLE = 'Openable',
  PASSABLE = 'Passable',
  RESPAWNABLE = 'Respawnable',
  CLEARABLE = 'Clearable',
  DECORATEABLE = 'Decorateable',
  LIGHTABLE = 'Lightable',
  HURTABLE = 'Hurtable',
}

export enum ABILITY_STATUS {
  OPEN = 'open',
  CLOSE = 'close',
  PASS = 'pass',
  STOP = 'stop',
  LIGHTING = 'lighting',
  DISLIGHTING = 'dislighting',
  UNVISIT = 'unvisit',
  CANHURT = 'canhurt',
  NOHURT = 'nohurt',
}

export default abstract class Ability extends Renderable {
  protected _name: ABILITY_NAMES;
  protected _status: ABILITY_STATUS;
  protected _owner: Character | Entity;

  protected constructor(owner: Character | Entity) {
    super();
    this._name = ABILITY_NAMES.ABSTRACT_ABILITY;
    this._geometryPosition = owner.geometryPosition;
    this._owner = owner;
  }

  public get rendering() {
    return this._rendering;
  }

  public set rendering(rendering: PIXI.DisplayObject | null) {
    this._rendering = rendering;
    this.geometryPosition = this._geometryPosition;
  }

  public abstract exert(direction: Vector2, value?: any): void;

  public get name() {
    return this._name;
  }

  public get status(): ABILITY_STATUS {
    return this._status;
  }

  public set status(status: ABILITY_STATUS) {
    this._status = status;
  }
}
