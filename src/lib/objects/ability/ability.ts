export enum ABILITY_NAMES {
  OPENABLE = 'Openable',
  PASSABLE = 'Passable',
  RESPAWNABLE = 'Respawnable',
  CLEARABLE = 'Clearable',
}

export enum ABILITY_STATUS {
  OPEN = 'open',
  CLOSE = 'close',
  PASS = 'pass',
  STOP = 'stop',
}
export default class Ability {
  protected _name: string;
  protected _status: ABILITY_STATUS;
  protected _event: Event;

  protected constructor() {
    this._name = 'Abstract Status';
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
