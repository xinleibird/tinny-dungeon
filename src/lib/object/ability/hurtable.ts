import { Vector2 } from '../../geometry';
import Ability, { ABILITY_NAMES, ABILITY_STATUS } from './ability';

type HurtableStatus = ABILITY_STATUS.CANHURT | ABILITY_STATUS.NOHURT;

export default class Hurtable extends Ability {
  protected _status: HurtableStatus;

  public constructor(
    geometryPosition: Vector2,
    initStatus: HurtableStatus = ABILITY_STATUS.CANHURT
  ) {
    super(geometryPosition);
    this._name = ABILITY_NAMES.HURTABLE;
    this._status = initStatus;
  }

  public exert(sourceDirection: Vector2) {
    if (this._status === ABILITY_STATUS.CANHURT) {
      //
    }
  }

  public get rendering() {
    return null;
  }

  public get status() {
    return this._status;
  }

  public set status(status: HurtableStatus) {
    this._status = status;
  }
}
