import { Character } from '../character';
import { Vector2 } from '../geometry';
import {
  Ability,
  ABILITY_NAMES,
  ABILITY_STATUS,
  Clearable,
  Hurtable,
  Openable,
  Passable,
  Respawnable,
} from '../object/ability';

export enum ENTITY_TYPES {
  EMPTY,
  FLOOR,
  CORRIDOR,
  DOOR,
  TRAP,
  UPSTAIR,
  DOWNSTAIR,
}

export default class Entity {
  private _entityType: ENTITY_TYPES;
  private _direction: Vector2;
  private _geometryPosition: Vector2;
  private _abilities: Ability[] = [];
  private _character: Character;

  public constructor(
    geometryPosition: Vector2,
    entityType: ENTITY_TYPES,
    direction = Vector2.right
  ) {
    this._geometryPosition = geometryPosition;
    this._entityType = entityType;
    this._direction = direction;

    this.initialize(entityType);
  }

  public get geometryPosition() {
    return this._geometryPosition;
  }

  public get type() {
    return this._entityType;
  }

  public get character() {
    return this._character;
  }

  public set character(character: Character) {
    this._character = character;
  }

  public get abilities() {
    return this._abilities;
  }

  public addAbility(...ability: Ability[]) {
    for (const abi of ability) {
      this._abilities.push(abi);
    }
  }

  public hasAbility(name: ABILITY_NAMES) {
    if (this._character) {
      for (const ability of this._character.abilities) {
        if (ability.name === name) {
          return true;
        }
      }
    }

    for (const ability of this._abilities) {
      if (ability.name === name) {
        return true;
      }
    }
    return false;
  }

  public getAbility(name: ABILITY_NAMES) {
    for (const ability of this._abilities) {
      if (ability.name === name) {
        return ability;
      }
    }
    return undefined;
  }

  public getAbilitys(name: ABILITY_NAMES) {
    const abilities = [];
    for (const ability of this._abilities) {
      if (ability.name === name) {
        abilities.push(ability);
      }
    }
    return abilities;
  }

  private initialize(entityType: ENTITY_TYPES) {
    if (entityType === ENTITY_TYPES.EMPTY) {
      const passable = new Passable(this, ABILITY_STATUS.STOP);
      this.addAbility(passable);
    }

    if (entityType === ENTITY_TYPES.FLOOR || entityType === ENTITY_TYPES.CORRIDOR) {
      const passable = new Passable(this, ABILITY_STATUS.PASS, entityType);
      this.addAbility(passable);
    }

    if (entityType === ENTITY_TYPES.DOOR) {
      const openable = new Openable(this, ABILITY_STATUS.CLOSE, this._direction);
      const passable = new Passable(this, ABILITY_STATUS.STOP);
      const hurtable = new Hurtable(this, ABILITY_STATUS.CANHURT);

      this.addAbility(openable, passable, hurtable);
    }

    if (entityType === ENTITY_TYPES.UPSTAIR) {
      const respawnable = new Respawnable(this);
      const passable = new Passable(this, ABILITY_STATUS.PASS);

      this.addAbility(respawnable, passable);
    }

    if (entityType === ENTITY_TYPES.DOWNSTAIR) {
      const clearable = new Clearable(this);
      const passable = new Passable(this, ABILITY_STATUS.PASS);

      this.addAbility(clearable, passable);
    }
  }
}
