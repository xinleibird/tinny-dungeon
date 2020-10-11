import Ability, { ABILITY_NAMES, ABILITY_STATUS } from './ability';

export default class Passable extends Ability {
  protected _status: ABILITY_STATUS.PASS | ABILITY_STATUS.STOP;
  public constructor(status: ABILITY_STATUS.PASS | ABILITY_STATUS.STOP = ABILITY_STATUS.STOP) {
    super();
    this._status = status;
    this._name = ABILITY_NAMES.PASSABLE;
  }

  public set status(status: ABILITY_STATUS.PASS | ABILITY_STATUS.STOP) {
    this._status = status;
  }

  public get status() {
    return this._status;
  }
}
