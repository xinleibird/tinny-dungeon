import StaticSystem from '../../core/static';
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

  public exert(originDirection: Vector2) {
    if (this._status === ABILITY_STATUS.CANHURT) {
      const { x, y } = this._geometryPosition;
      const character = StaticSystem.characterGroup.getCharacter(x, y);

      character.hurt();
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
