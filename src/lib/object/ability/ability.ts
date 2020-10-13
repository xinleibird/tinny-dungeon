export enum ABILITY_NAMES {
  ABSTRACT_ABILITY = 'AbstractAbility',
  OPENABLE = 'Openable',
  PASSABLE = 'Passable',
  RESPAWNABLE = 'Respawnable',
  CLEARABLE = 'Clearable',
  DECORATEABLE = 'Decorateable',
  LIGHTABLE = 'Lightable',
}

export enum ABILITY_STATUS {
  OPEN = 'open',
  CLOSE = 'close',
  PASS = 'pass',
  STOP = 'stop',
  LIGHTING = 'lighting',
  DISLIGHTING = 'dislighting',
  UNVISIT = 'unvisit',
}
export default class Ability {
  protected _name: ABILITY_NAMES;
  protected _status: ABILITY_STATUS;

  protected constructor() {
    this._name = ABILITY_NAMES.ABSTRACT_ABILITY;
  }

  public get name() {
    return this._name;
  }

  public get status(): ABILITY_STATUS {
    return this._status;
  }

  public set status(status: ABILITY_STATUS) {
    this._status = status;
  }
}
