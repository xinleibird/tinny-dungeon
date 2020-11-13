import { Character, CHARACTER_TYPES, NonPlayer, Player } from '../../character';
import { StaticSystem } from '../../core';
import { Entity } from '../../entity';
import { Vector2 } from '../../geometry';
import DamageIndicator from '../external/DamageIndicator';
import { EXTERNAL_NAMES } from '../external/External';
import Ability, { ABILITY_NAMES, ABILITY_STATUS } from './Ability';

type HurtableStatus = ABILITY_STATUS.CANHURT | ABILITY_STATUS.NOHURT;

export default class Hurtable extends Ability {
  protected _status: HurtableStatus;

  public constructor(
    owner: Character | Entity,
    initStatus: HurtableStatus = ABILITY_STATUS.CANHURT
  ) {
    super(owner);
    this._name = ABILITY_NAMES.HURTABLE;
    this._status = initStatus;
  }

  public exert(originDirection: Vector2, damage: number) {
    if (this._status === ABILITY_STATUS.CANHURT) {
      const { x, y } = this._geometryPosition;
      const character = StaticSystem.entityGroup.getCharacter(x, y);

      const dir = Vector2.flip(originDirection);
      character.direction = dir;

      setTimeout(() => {
        if (damage) {
          character.damageSound.play();
          character.hurt();
        } else {
          character.dodgeSound.play();
          character.dodge();
        }

        const di = character.getExternal(EXTERNAL_NAMES.DAMAGE_INDICATOR) as DamageIndicator;
        if (this._owner instanceof Player) {
          di.addDamageText(damage, CHARACTER_TYPES.PLAYER);
          this._owner.getDamage(damage);
        }

        if (this._owner instanceof NonPlayer) {
          di.addDamageText(damage, CHARACTER_TYPES.NON_PLAYER);
          this._owner.getDamage(damage);
        }

        character.showExternal(EXTERNAL_NAMES.DAMAGE_INDICATOR);
      }, 50);
    }
  }

  public get status() {
    return this._status;
  }

  public set status(status: HurtableStatus) {
    this._status = status;
  }
}
