import { Vector2 } from '../../geometry';
import Entity from '../../object/entity';

export default abstract class Behavior {
  protected _entities: Entity[][] = [];

  protected _name = 'AbstractBehavior';

  protected constructor(name: string) {
    this._name = name;
  }

  public get name() {
    return this._name;
  }

  public abstract act(vector: Vector2): void;
  public abstract canAct(vector: Vector2): boolean;
}
