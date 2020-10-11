import * as PIXI from 'pixi.js';

import { IPosition, Vector2 } from '../geometry';
import { Ability, ABILITY_NAMES, Clearable, Openable, Passable, Respawnable } from './ability';
import { ABILITY_STATUS } from './ability/ability';

export enum ENTITY_TYPES {
  EMPTY,
  FLOOR,
  CORRIDOR,
  DOOR,
  TRAP,
  UPSTAIR,
  DOWNSTAIR,
}

export default class Entity {
  private _type: ENTITY_TYPES;
  private _direction: Vector2;
  private _geometryPosition: Vector2;
  private _abilities: Ability[] = [];
  private _sprite: PIXI.Sprite;

  public constructor(
    geometryPosition: Vector2 | IPosition,
    entityType: ENTITY_TYPES,
    direction = Vector2.right,
    tileSize = 16,
    tileOffsetX = 24,
    tileOffsetY = 32
  ) {
    this._type = entityType;
    this._direction = direction;

    if (geometryPosition instanceof Vector2) {
      this._geometryPosition = geometryPosition;
    } else {
      const { x, y } = geometryPosition;
      this._geometryPosition = new Vector2(x, y);
    }

    if (entityType !== ENTITY_TYPES.EMPTY) {
      if (entityType === ENTITY_TYPES.DOOR) {
        const passable = new Passable(ABILITY_STATUS.STOP);
        this._abilities.push(passable);
      } else {
        const passable = new Passable(ABILITY_STATUS.PASS);
        this._abilities.push(passable);
      }
    }

    if (entityType === ENTITY_TYPES.DOOR) {
      const openable = direction.equals(Vector2.right)
        ? new Openable(ABILITY_STATUS.CLOSE, Vector2.right)
        : new Openable(ABILITY_STATUS.CLOSE, Vector2.up);

      this._abilities.push(openable);

      const { x, y } = this._geometryPosition;
      this._sprite = openable.sprite;
      this._sprite.position.set(x * tileSize + tileOffsetX, y * tileSize + tileOffsetY);
    }

    if (entityType === ENTITY_TYPES.UPSTAIR) {
      const respawnable = new Respawnable();
      this._abilities.push(respawnable);

      const { x, y } = this._geometryPosition;
      this._sprite = respawnable.sprite;
      this._sprite.position.set(x * tileSize + tileOffsetX, y * tileSize + tileOffsetY);
    }

    if (entityType === ENTITY_TYPES.DOWNSTAIR) {
      const clearable = new Clearable();
      this._abilities.push(clearable);

      const { x, y } = this._geometryPosition;
      this._sprite = clearable.sprite;
      this._sprite.position.set(x * tileSize + tileOffsetX, y * tileSize + tileOffsetY);
    }
  }

  public get sprite() {
    return this._sprite;
  }

  public get geometryPosition() {
    return this._geometryPosition;
  }

  public set geometryPosition(vector: Vector2) {
    this._geometryPosition = vector;
  }

  public get type() {
    return this._type;
  }

  public get abilities() {
    return this._abilities;
  }

  public hasAbility(name: ABILITY_NAMES) {
    for (const ability of this._abilities) {
      if (ability.name === name) {
        return true;
      }
    }
    return false;
  }

  public getAbility(name: ABILITY_NAMES) {
    for (const ability of this._abilities) {
      if (ability.name === name) {
        return ability;
      }
    }
    return undefined;
  }

  public removeAbility(name: ABILITY_NAMES) {
    for (let i = 0; i < this._abilities.length; i++) {
      const ability = this._abilities[i];
      if (ability.name === name) {
        this._abilities.splice(i, 1);
        break;
      }
    }
  }
}
