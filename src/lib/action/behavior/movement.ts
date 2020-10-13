import { Vector2 } from '../../geometry';
import Entity from '../../object/entity';
import Behavior from './behavior';

export default class Movement extends Behavior {
  public constructor(entities: Entity[][]) {
    super('Movement');
    this._entities = entities;
  }

  public act(direction: Vector2) {
    //
  }

  public canAct(direction: Vector2) {
    //
    return true;
  }
}
