import { gsap } from 'gsap';
import { Character, NonPlayer } from '../../character';
import { SPRITE_OPTIONS } from '../../config';
import { StaticSystem } from '../../core';
import { Vector2 } from '../../geometry';
import { ABILITY_NAMES, ABILITY_STATUS } from '../ability';
import Behavior, { BEHAVIOR_NAMES } from './Behavior';

const { SPRITE_OFFSET_X, SPRITE_OFFSET_Y } = SPRITE_OPTIONS;

export default class Attacking extends Behavior {
  public constructor(character: Character) {
    super(character);
    this._name = BEHAVIOR_NAMES.ATTACKING;
  }

  public do(direction: Vector2) {
    return new Promise((resolve, reject) => {
      this._character.direction = direction;

      const geometryPosition = this._character.geometryPosition;
      const { x, y } = geometryPosition;

      this._character.lastGeometryPosition = new Vector2(x, y);

      const { x: dx, y: dy } = direction;

      setTimeout(() => {
        gsap.to(this._character.rendering, {
          duration: 0.15,
          pixi: {
            x: x * 16 + SPRITE_OFFSET_X + dx * 8,
            y: y * 16 + SPRITE_OFFSET_Y + dy * 8,
          },
          onStart: () => {
            this._character.attackSound.play();
            this._character.attack(direction);
          },
          onComplete: () => {
            gsap.to(this._character.rendering, {
              duration: 0.05,
              pixi: { x: x * 16 + SPRITE_OFFSET_X, y: y * 16 + SPRITE_OFFSET_Y },
              onComplete: () => {
                resolve(true);
              },
            });
          },
        });
      }, 50);

      this.exertAbility(direction);
    });
  }

  public canDo(direction: Vector2) {
    if (!direction || direction.equals(Vector2.center)) {
      return false;
    }

    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);

    const tarEntity = StaticSystem.entityGroup.getEntity(tarPosition);
    const tarCharacter = StaticSystem.entityGroup.getCharacter(tarPosition);

    if (tarCharacter?.hasAbility(ABILITY_NAMES.HURTABLE)) {
      const hurtable = tarCharacter?.getAbility(ABILITY_NAMES.HURTABLE);
      if (hurtable?.status === ABILITY_STATUS.CANHURT) {
        if (this._character instanceof NonPlayer && tarCharacter instanceof NonPlayer) {
          return false;
        }
        return true;
      }
    }

    if (tarEntity?.hasAbility(ABILITY_NAMES.HURTABLE)) {
      const hurtable = tarEntity?.getAbility(ABILITY_NAMES.HURTABLE);
      if (hurtable?.status === ABILITY_STATUS.CANHURT) {
        return true;
      }
    }

    return false;
  }

  private exertAbility(direction: Vector2) {
    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);

    const tarEntity = StaticSystem.entityGroup.getEntity(tarPosition);
    const tarCharacter = StaticSystem.entityGroup.getCharacter(tarPosition);

    const attackRoll = this._character?.class?.attackRoll();
    let damage = 0;

    if (attackRoll !== -1) {
      const defenceRoll = tarCharacter?.class?.defenceRoll();

      if (!defenceRoll) {
        damage = this._character?.class?.damageRoll();
      }
    } else {
      damage = this._character?.class?.damageRoll();
    }

    const hurtableEntity = tarEntity?.getAbility(ABILITY_NAMES.HURTABLE);
    const hurtableCharacter = tarCharacter?.getAbility(ABILITY_NAMES.HURTABLE);

    if (hurtableEntity?.status === ABILITY_STATUS.CANHURT) {
      hurtableEntity?.exert(direction);
      return;
    }

    if (hurtableCharacter?.status === ABILITY_STATUS.CANHURT) {
      hurtableCharacter?.exert(direction, damage);
      return;
    }
  }
}
