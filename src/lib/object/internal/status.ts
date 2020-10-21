import Internal, { INTERNAL_NAMES } from './internal';

interface MajorAbilityTypes {
  ST: number;
  DX: number;
  IQ: number;
  HT: number;
}

interface MinorAbility {
  HP: number;
  DR: number;
  Dmg: number;
  BS: number;
}

export default class CharacterStatus extends Internal {
  private _majorAbility: MajorAbilityTypes = {
    ST: 10,
    DX: 10,
    IQ: 10,
    HT: 10,
  };

  private _minorAbility: MinorAbility = {
    HP: 10,
    Dmg: 10,
    DR: 0,
    BS: 5,
  };

  private _dodging: number;

  public constructor(majorAbility: MajorAbilityTypes = { ST: 10, DX: 10, IQ: 10, HT: 10 }) {
    super();
    this._name = INTERNAL_NAMES.CHARACTER_STATUS;
    this._majorAbility = majorAbility;
    this._minorAbility = {
      HP: majorAbility.ST,
      Dmg: majorAbility.ST,
      DR: 0,
      BS: (majorAbility.HT + majorAbility.ST) / 4,
    };

    this._dodging = ~~this._minorAbility.BS + 3;
  }

  public get majorAbility() {
    return this._majorAbility;
  }

  public get minorAbility() {
    return this._minorAbility;
  }

  public get HP() {
    return this._minorAbility.HP;
  }

  public get Dmg() {
    return this._minorAbility.Dmg;
  }

  public get dodging() {
    return this._dodging;
  }
}
