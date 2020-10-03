import * as PIXI from 'pixi.js';
import { Vector2 } from '../geometry';
import { Ability, Openable, Passable } from './ability';

export enum ENTITY_TYPES {
  EMPTY,
  FLOOR,
  CORRIDOR,
  DOOR,
  TRAP,
  UPSTAIR,
  DOWNSTAIR,
}

export default class Entity extends PIXI.Container {
  private _type: ENTITY_TYPES;
  private _direction: Vector2;
  private _geometryPosition: Vector2;
  private _abilities: Ability[] = [];

  public constructor(
    x = 0,
    y = 0,
    entityType: ENTITY_TYPES,
    direction = Vector2.right(),
    tileSize = 16,
    tileOffsetX = 24,
    tileOffsetY = 32
  ) {
    super();
    this._type = entityType;
    this._direction = direction;
    this._geometryPosition = new Vector2(x, y);

    if (entityType !== ENTITY_TYPES.EMPTY) {
      const passable = new Passable();
      this._abilities.push(passable);
    }

    if (entityType === ENTITY_TYPES.DOOR) {
      const openable = direction.equals(Vector2.right())
        ? new Openable('close', Vector2.right())
        : new Openable('close', Vector2.up());

      this._abilities.push(openable);

      this.position.set(x * tileSize + tileOffsetX, y * tileSize + tileOffsetY);

      this.addChild(openable.sprite);
    }
  }

  public get geometryPosition() {
    return this._geometryPosition;
  }

  public get type() {
    return this._type;
  }

  public get abilities() {
    return this._abilities;
  }
}
