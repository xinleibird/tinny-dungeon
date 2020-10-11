import { Vector2 } from '../../geometry';
import Entity from '../../object/entity';

export default class Movement {
  private _entities: Entity[][];

  public constructor(entities: Entity[][]) {
    this._entities = entities;
  }

  protected canMove(direction: Vector2) {}
}
