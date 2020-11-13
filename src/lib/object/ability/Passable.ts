import { Character } from '../../character';
import { Entity, ENTITY_TYPES } from '../../entity';
import Ability, { ABILITY_NAMES, ABILITY_STATUS } from './Ability';

type PassableStatus = ABILITY_STATUS.PASS | ABILITY_STATUS.STOP;

export default class Passable extends Ability {
  protected _status: PassableStatus;
  private _type: any;

  public constructor(
    owner: Character | Entity,
    status: PassableStatus = ABILITY_STATUS.STOP,
    type?: ENTITY_TYPES.FLOOR | ENTITY_TYPES.CORRIDOR
  ) {
    super(owner);
    this._status = status;
    this._type = type;
    this._name = ABILITY_NAMES.PASSABLE;
  }

  public exert() {}

  public get type() {
    return this._type;
  }

  public set status(status: PassableStatus) {
    this._status = status;
  }

  public get status() {
    return this._status;
  }
}
