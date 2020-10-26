import { Character } from '../../character';
import { TurnEvent } from '../../turn';

export default abstract class Strategy {
  protected _self: Character;
  protected _target: Character;

  protected constructor(self: Character, target?: Character) {
    this._self = self;
    this._target = target;
  }

  public abstract execute(): TurnEvent[];
}
