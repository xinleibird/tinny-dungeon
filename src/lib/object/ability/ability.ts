import { Renderable } from '../../abstraction';
import { TILE_OPTIONS } from '../../config';
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

const { TILE_SIZE, TILE_OFFSET_X, TILE_OFFSET_Y } = TILE_OPTIONS;
export default abstract class Ability extends Renderable {
  protected _name: ABILITY_NAMES;
  protected _status: ABILITY_STATUS;
  protected _geometryPosition: Vector2;

  protected constructor(geometryPosition: Vector2) {
    super();
    this._name = ABILITY_NAMES.ABSTRACT_ABILITY;
    this._geometryPosition = geometryPosition;
    const { x, y } = geometryPosition;
    this._rendering?.position?.set(
      x * TILE_SIZE + TILE_OFFSET_X,
      y * TILE_SIZE + TILE_OFFSET_Y
    );
  }

  public get geometryPosition() {
    return this._geometryPosition;
  }

  public set geometryPosition(geometryPosition: Vector2) {
    const { x, y } = geometryPosition;
    this._rendering.position.set(x * TILE_SIZE + TILE_OFFSET_X, y * TILE_SIZE + TILE_OFFSET_Y);
  }

  public exert(direction: Vector2) {}

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
