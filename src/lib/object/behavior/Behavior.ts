import { Character } from '../../character';
import { Vector2 } from '../../geometry';

export enum BEHAVIOR_NAMES {
  ABSTRACT_BEHAVIOR = 'AbstractBehavior',
  OPENING = 'Opening',
  MOVEMENT = 'Movement',
  ATTACKING = 'Attacking',
  CLEARING = 'Clearing',
}
export default abstract class Behavior {
  protected _character: Character;

  protected _name: BEHAVIOR_NAMES;

  protected constructor(character: Character) {
    this._name = BEHAVIOR_NAMES.ABSTRACT_BEHAVIOR;
    this._character = character;
  }

  public get name() {
    return this._name;
  }

  public abstract do(direction: Vector2): Promise<unknown>;
  public abstract canDo(vector: Vector2): boolean;
}
