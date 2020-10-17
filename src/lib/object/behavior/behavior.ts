import { Character } from '../../character';
import { Vector2 } from '../../geometry';
import Entity from '../entity';

export enum BEHAVIOR_NAMES {
  ABSTRACT_BEHAVIOR = 'AbstractBehavior',
  OPENING = 'Opening',
  MOVEMENT = 'Movement',
  ATTACKING = 'Attacking',
}
export default abstract class Behavior {
  protected _entities: Entity[][] = [];
  protected _character: Character;

  protected _name: BEHAVIOR_NAMES;

  protected constructor(entities: Entity[][], character: Character) {
    this._name = BEHAVIOR_NAMES.ABSTRACT_BEHAVIOR;
    this._entities = entities;
    this._character = character;
  }

  public get name() {
    return this._name;
  }

  public abstract do(direction: Vector2): void;
  public abstract canDo(vector: Vector2): boolean;
}
