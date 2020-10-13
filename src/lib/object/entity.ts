import * as PIXI from 'pixi.js';
import { ENTITY_OPTIONS } from '../config';
import { IPosition, Vector2 } from '../geometry';
import { Ability, ABILITY_NAMES, Clearable, Openable, Passable, Respawnable } from './ability';
import { ABILITY_STATUS } from './ability/ability';
import Decorateable from './ability/decorateable';
import Lightable from './ability/lightable';

const { TILE_OFFSET_X, TILE_OFFSET_Y, TILE_SIZE } = ENTITY_OPTIONS;

export enum ENTITY_TYPES {
  EMPTY,
  FLOOR,
  CORRIDOR,
  DOOR,
  TRAP,
  UPSTAIR,
  DOWNSTAIR,
  LIGHTING,
}

export default class Entity {
  private _entityType: ENTITY_TYPES;
  private _direction: Vector2;
  private _geometryPosition: Vector2;
  private _abilities: Ability[] = [];

  private _floorLayer: PIXI.Sprite[] = [];
  private _decoratorLayer: PIXI.Sprite[] = [];
  private _lightingLayer: PIXI.Sprite[] = [];

  public constructor(
    geometryPosition: Vector2 | IPosition,
    entityType: ENTITY_TYPES,
    direction = Vector2.right
  ) {
    if (geometryPosition instanceof Vector2) {
      this._geometryPosition = geometryPosition;
    } else {
      const { x, y } = geometryPosition;
      this._geometryPosition = new Vector2(x, y);
    }
    this._entityType = entityType;
    this._direction = direction;

    this.initialize(entityType);
  }

  public get floorLayer() {
    return this._floorLayer;
  }

  public get decoratorLayer() {
    return this._decoratorLayer;
  }

  public get lightingLayer() {
    return this._lightingLayer;
  }

  public get geometryPosition() {
    return this._geometryPosition;
  }

  public set geometryPosition(vector: Vector2) {
    this._geometryPosition = vector;
  }

  public get type() {
    return this._entityType;
  }

  public get abilities() {
    return this._abilities;
  }

  public addAbility(...ability: Ability[]) {
    for (const abi of ability) {
      if (!this.hasAbility(abi.name)) {
        this._abilities.push(...ability);
      }

      if (abi instanceof Openable || abi instanceof Respawnable || abi instanceof Clearable) {
        const { x, y } = this._geometryPosition;
        const sprite = abi.sprite;
        sprite.position.set(x * TILE_SIZE + TILE_OFFSET_X, y * TILE_SIZE + TILE_OFFSET_Y);
        this._floorLayer.push(abi.sprite);
      }

      if (abi instanceof Decorateable) {
        const { x, y } = this._geometryPosition;
        const sprite = abi.sprite;
        sprite.position.set(x * TILE_SIZE + TILE_OFFSET_X, y * TILE_SIZE + TILE_OFFSET_Y);
        this._decoratorLayer.push(sprite);
      }

      if (abi instanceof Lightable) {
        const { x, y } = this._geometryPosition;
        const sprite = abi.sprite;
        sprite.position.set(x * TILE_SIZE + TILE_OFFSET_X, y * TILE_SIZE + TILE_OFFSET_Y);
        this._lightingLayer.push(sprite);
      }
    }
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

  private initialize(entityType: ENTITY_TYPES) {
    if (entityType === ENTITY_TYPES.EMPTY) {
      const passable = new Passable(ABILITY_STATUS.STOP);
      this._abilities.push(passable);
    }

    if (entityType === ENTITY_TYPES.FLOOR || entityType === ENTITY_TYPES.CORRIDOR) {
      const passable = new Passable(ABILITY_STATUS.PASS);
      this._abilities.push(passable);
    }

    if (entityType === ENTITY_TYPES.DOOR) {
      const { x, y } = this._geometryPosition;
      const openable = this._direction.equals(Vector2.right)
        ? new Openable(ABILITY_STATUS.OPEN, Vector2.right)
        : new Openable(ABILITY_STATUS.OPEN, Vector2.up);
      const passable = new Passable(ABILITY_STATUS.PASS);
      const sprite = openable.sprite;
      sprite.position.set(x * TILE_SIZE + TILE_OFFSET_X, y * TILE_SIZE + TILE_OFFSET_Y);

      this._floorLayer.push(sprite);
      this._abilities.push(openable, passable);
    }

    if (entityType === ENTITY_TYPES.UPSTAIR) {
      const { x, y } = this._geometryPosition;
      const respawnable = new Respawnable();
      const passable = new Passable(ABILITY_STATUS.PASS);
      const sprite = respawnable.sprite;
      sprite.position.set(x * TILE_SIZE + TILE_OFFSET_X, y * TILE_SIZE + TILE_OFFSET_Y);

      this._floorLayer.push(sprite);
      this._abilities.push(respawnable, passable);
    }

    if (entityType === ENTITY_TYPES.DOWNSTAIR) {
      const { x, y } = this._geometryPosition;
      const clearable = new Clearable();
      const passable = new Passable(ABILITY_STATUS.PASS);

      const sprite = clearable.sprite;
      sprite.position.set(x * TILE_SIZE + TILE_OFFSET_X, y * TILE_SIZE + TILE_OFFSET_Y);

      this._floorLayer.push(sprite);
      this._abilities.push(clearable, passable);
    }

    if (entityType === ENTITY_TYPES.LIGHTING) {
      const { x, y } = this._geometryPosition;
      const lightable = new Lightable(ABILITY_STATUS.UNVISIT);

      const sprite = lightable.sprite;
      sprite.position.set(x * TILE_SIZE + TILE_OFFSET_X, y * TILE_SIZE + TILE_OFFSET_Y);

      this._lightingLayer.push(sprite);
      this._abilities.push(lightable);
    }
  }
}
