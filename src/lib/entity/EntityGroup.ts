import { Groupable } from '../abstraction';
import { Character } from '../character';
import { StaticSystem } from '../core';
import { Vector2 } from '../geometry';
import { initialize2DArray } from '../utils';
import Entity, { ENTITY_TYPES } from './Entity';

export default class EntityGroup extends Groupable {
  private _entities: Entity[][];

  public constructor(width: number, height: number) {
    super(width, height);
    this._entities = initialize2DArray(
      width,
      height,
      new Entity(new Vector2(), ENTITY_TYPES.EMPTY)
    );

    StaticSystem.registEntityGroup(this);
  }

  public setEntity(x: number, y: number, entity: Entity) {
    this._entities[y][x] = entity;
  }

  public getEntity(x: number, y: number) {
    return this._entities[y][x];
  }

  public setCharacter(x: number, y: number, character: Character) {
    this._entities[y][x].character = character;
  }

  public getCharacter(x: number, y: number) {
    return this._entities[y][x].character;
  }
}
