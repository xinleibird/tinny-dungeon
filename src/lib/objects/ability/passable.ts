import Ability, { ABILITY_NAMES } from './ability';

export default class Passable extends Ability {
  public constructor() {
    super();
    this._name = ABILITY_NAMES.PASSABLE;
  }
}
