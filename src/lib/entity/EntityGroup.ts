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

  public loop(fb: (entity: Entity) => void) {
    this.forLoop((x, y) => {
      fb(this._entities[y][x]);
    });
  }

  public setEntity(
    ...args:
      | [x: number, y: number, entity: Entity]
      | [geometryPosition: Vector2, entity: Entity]
  ) {
    if (args.length === 3) {
      const [x, y, entity] = args;
      this._entities[y][x] = entity;
    }
    if (args.length === 2) {
      const [geometryPosition, entity] = args;
      const { x, y } = geometryPosition;
      this._entities[y][x] = entity;
    }
  }

  public getEntity(...args: [x: number, y: number] | [geometryPosition: Vector2]) {
    if (args.length === 2) {
      const [x, y] = args;

      return this._entities?.[y]?.[x];
    }
    if (args.length === 1) {
      const [geometryPosition] = args;
      const { x, y } = geometryPosition;
      return this._entities?.[y]?.[x];
    }
  }

  public setCharacter(
    ...args:
      | [x: number, y: number, character: Character]
      | [geometryPosition: Vector2, character: Character]
  ) {
    if (args.length === 3) {
      const [x, y, character] = args;
      this._entities[y][x].character = character;
    }
    if (args.length === 2) {
      const [geometryPosition, character] = args;
      const { x, y } = geometryPosition;
      this._entities[y][x].character = character;
    }
  }

  public getCharacter(...args: [x: number, y: number] | [geometryPosition: Vector2]) {
    if (args.length === 2) {
      const [x, y] = args;
      return this._entities[y][x].character;
    }
    if (args.length === 1) {
      const [geometryPosition] = args;
      const { x, y } = geometryPosition;
      return this._entities[y][x].character;
    }
  }
}
