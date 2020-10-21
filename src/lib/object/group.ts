import { Groupable } from '../abstraction';
import StaticSystem from '../core/static';
import { Vector2 } from '../geometry';
import { initialize2DArray } from '../utils';
import Entity, { ENTITY_TYPES } from './entity';

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
}
