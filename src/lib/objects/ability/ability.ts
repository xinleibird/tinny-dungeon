export default class Ability {
  protected _name: string;
  protected _status: string;
  protected _event: Event;

  protected constructor() {
    this._name = 'Abstract Status';
  }

  public get name() {
    return this._name;
  }

  public get status() {
    return this._status;
  }

  public set status(status: string) {
    this._status = status;
  }
}
