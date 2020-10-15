import { Character } from '../character';
import { Vector2 } from '../geometry';
import Entity from '../object/entity';

export default abstract class Behavior {
  protected _entities: Entity[][] = [];
  protected _character: Character;

  protected _name = 'AbstractBehavior';

  protected constructor(name: string, entities: Entity[][], character: Character) {
    this._name = name;
    this._entities = entities;
    this._character = character;
  }

  public get name() {
    return this._name;
  }

  public abstract do(direction: Vector2): void;
  public abstract canDo(vector: Vector2): boolean;
}
