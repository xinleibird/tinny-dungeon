import { Vector2 } from '../../geometry';
import Ability, { ABILITY_NAMES, ABILITY_STATUS } from './ability';

type PassableStatus = ABILITY_STATUS.PASS | ABILITY_STATUS.STOP;

export default class Passable extends Ability {
  protected _status: PassableStatus;
  public constructor(geometryPosition: Vector2, status: PassableStatus = ABILITY_STATUS.STOP) {
    super(geometryPosition);
    this._status = status;
    this._name = ABILITY_NAMES.PASSABLE;
  }

  public get rendering() {
    return null;
  }

  public set status(status: PassableStatus) {
    this._status = status;
  }

  public get status() {
    return this._status;
  }
}
