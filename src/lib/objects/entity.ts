import * as PIXI from 'pixi.js';

import { Vector2 } from '../geometry';
import { Ability, ABILITY_NAMES, Clearable, Openable, Passable, Respawnable } from './ability';

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

    if (entityType === ENTITY_TYPES.UPSTAIR) {
      const respawnable = new Respawnable();
      this._abilities.push(respawnable);

      this.position.set(x * tileSize + tileOffsetX, y * tileSize + tileOffsetY);
      this.addChild(respawnable.sprite);
    }

    if (entityType === ENTITY_TYPES.DOWNSTAIR) {
      const clearable = new Clearable();
      this._abilities.push(clearable);

      this.position.set(x * tileSize + tileOffsetX, y * tileSize + tileOffsetY);
      this.addChild(clearable.sprite);
    }
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
}
