import * as ROT from 'rot-js';
interface MajorAbility {
  ST: number;
  DX: number;
  IQ: number;
  HT: number;
}

interface MinorAbility {
  Dmg: {
    Thr: {
      d: number;
      a: number;
    };
    Sw: {
      d: number;
      a: number;
    };
  };
  BL: number;
  HP: number;
  Will: number;
  Per: number;
  FP: number;
  BS: number;
  BM: number;
  SM: number;
  Dodge: number;
}

interface Ability {
  majorAbility: MajorAbility;
  minorAbility: MinorAbility;
}

const damageTableThr = [
  { d: 0, a: 0 },
  { d: 1, a: -6 },
  { d: 1, a: -6 },
  { d: 1, a: -5 },
  { d: 1, a: -5 },
  { d: 1, a: -4 },
  { d: 1, a: -4 },
  { d: 1, a: -3 },
  { d: 1, a: -3 },
  { d: 1, a: -2 },
  { d: 1, a: -2 },
  { d: 1, a: -1 },
  { d: 1, a: -1 },
  { d: 1, a: 0 },
  { d: 1, a: 0 },
  { d: 1, a: 1 },
  { d: 1, a: 1 },
  { d: 1, a: 2 },
  { d: 1, a: 2 },
  { d: 2, a: -1 },
  { d: 2, a: -1 },
  { d: 2, a: 0 },
  { d: 2, a: 0 },
  { d: 2, a: 1 },
  { d: 2, a: 1 },
  { d: 2, a: 2 },
  { d: 2, a: 2 },
  { d: 3, a: -1 },
  { d: 3, a: -1 },
  { d: 3, a: 0 },
  { d: 3, a: 0 },
];

const damageTableSw = [
  { d: 0, a: 0 },
  { d: 1, a: -5 },
  { d: 1, a: -5 },
  { d: 1, a: -4 },
  { d: 1, a: -4 },
  { d: 1, a: -3 },
  { d: 1, a: -3 },
  { d: 1, a: -2 },
  { d: 1, a: -2 },
  { d: 1, a: -1 },
  { d: 1, a: 0 },
  { d: 1, a: 1 },
  { d: 1, a: 2 },
  { d: 2, a: -1 },
  { d: 2, a: 0 },
  { d: 2, a: 1 },
  { d: 2, a: 2 },
  { d: 3, a: -1 },
  { d: 3, a: 0 },
  { d: 3, a: 1 },
  { d: 3, a: 2 },
  { d: 4, a: -1 },
  { d: 4, a: 0 },
  { d: 4, a: 1 },
  { d: 4, a: 2 },
  { d: 5, a: -1 },
  { d: 5, a: 0 },
  { d: 5, a: 1 },
  { d: 5, a: 1 },
  { d: 5, a: 2 },
  { d: 5, a: 2 },
];

const damageMultiple = {
  cr: 1,
  cut: 1.5,
  imp: 2,
};

export default class CharacterClass {
  private _majorAbility: MajorAbility;
  private _minorAbility: MinorAbility;

  private _level: number;

  private _attackBonus: number;
  private _damageType: 'Thr' | 'Sw';
  private _damageResistance: number;
  private _damageMultipleType: 'cr' | 'cut' | 'imp';

  public constructor(
    majorAbility: MajorAbility = { ST: 10, DX: 10, IQ: 10, HT: 10 },
    damageType: 'Thr' | 'Sw' = 'Sw',
    damageMultipleType: 'cr' | 'cut' | 'imp' = 'cr'
  ) {
    const { ST, DX, IQ, HT } = majorAbility;

    this._majorAbility = majorAbility;
    this._minorAbility = {
      Dmg: {
        Thr: damageTableThr[ST],
        Sw: damageTableSw[ST],
      },
      BL: ~~(ST ** 2 / 5),
      HP: ST,
      Will: IQ,
      Per: IQ,
      FP: HT,
      BS: (DX + HT) / 4,
      BM: ~~((DX + HT) / 4),
      SM: 0,
      Dodge: ~~((DX + HT) / 4) + 3,
    };

    this._level = 1;
    this._attackBonus = 0;
    this._damageType = damageType;
    this._damageResistance = 0;
    this._damageMultipleType = damageMultipleType;
  }

  public get attackBonus() {
    return this._attackBonus;
  }

  public set attackBonus(bonus: number) {
    this._attackBonus = ~~bonus;
  }

  public get damageResistance() {
    return this._damageResistance;
  }

  public set damageResistance(resistance: number) {
    this._damageResistance = ~~resistance;
  }

  public get damageType() {
    return this.damageType;
  }

  public set damageType(type: 'Thr' | 'Sw') {
    this._damageType = type;
  }

  public attackRoll() {
    const roll = this.d6(3);

    // Great Success
    if (roll <= 4) {
      return -1;
    }

    if (roll >= 17) {
      return 0;
    }

    if (roll < this._majorAbility.ST + this._attackBonus) {
      return 1;
    }

    return 0;
  }

  public damageRoll(isCritical = false) {
    const damageModel = this._minorAbility.Dmg[this._damageType];
    const { d, a } = damageModel;
    let damage = ~~(this.d6(d, a) * damageMultiple[this._damageMultipleType]);

    if (isCritical) {
      damage *= 2;
    }

    damage = damage ? damage - this._damageResistance : damage;
    damage = damage < 0 ? 0 : damage;

    return damage;
  }

  public defenceRoll() {
    const roll = this.d6(3);

    if (roll <= 4) {
      return true;
    }

    if (roll >= 17) {
      return false;
    }

    if (roll < this._minorAbility.Dodge) {
      return true;
    }

    return false;
  }

  public damageHP(damage: number) {
    this._minorAbility.HP -= damage;
    if (this._minorAbility.HP < 0) {
      this._minorAbility.HP = 0;
    }

    return this._minorAbility.HP;
  }

  private d6(times = 1, bonus = 0) {
    let count = 0;
    for (let i = 0; i < times; i++) {
      count += ROT.RNG.getUniformInt(1, 6);
    }

    return count + bonus;
  }
}
