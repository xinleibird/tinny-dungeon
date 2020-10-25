export enum INTERNAL_NAMES {
  ABSTRACT_EXTERNAL = 'AbstractInternal',
  CHARACTER_STATUS = 'CharacterStatus',
}

export default class Internal {
  protected _name: INTERNAL_NAMES;

  protected _value: any;

  protected constructor() {
    this._name = INTERNAL_NAMES.ABSTRACT_EXTERNAL;
  }

  public get name() {
    return this._name;
  }

  public get value() {
    return this._value;
  }
}
