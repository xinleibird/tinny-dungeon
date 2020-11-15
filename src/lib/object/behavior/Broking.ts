import { gsap } from 'gsap';
import { Character, NonPlayer } from '../../character';
import { SPRITE_OPTIONS } from '../../config';
import { StaticSystem } from '../../core';
import { Vector2 } from '../../geometry';
import { GameSound } from '../../sound';
import { ABILITY_NAMES, ABILITY_STATUS } from '../ability';
import Behavior, { BEHAVIOR_NAMES } from './Behavior';

const { SPRITE_OFFSET_X, SPRITE_OFFSET_Y } = SPRITE_OPTIONS;

export default class Broking extends Behavior {
  public constructor(character: Character) {
    super(character);
    this._name = BEHAVIOR_NAMES.BROKING;
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
            GameSound.play('broking');
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

    if (tarCharacter?.hasAbility(ABILITY_NAMES.BROKEABLE)) {
      const brokeable = tarCharacter?.getAbility(ABILITY_NAMES.BROKEABLE);
      if (brokeable?.status === ABILITY_STATUS.ENTIRE) {
        if (this._character instanceof NonPlayer && tarCharacter instanceof NonPlayer) {
          return false;
        }
        return true;
      }
    }

    if (tarEntity?.hasAbility(ABILITY_NAMES.BROKEABLE)) {
      const brokeable = tarEntity?.getAbility(ABILITY_NAMES.BROKEABLE);
      if (brokeable?.status === ABILITY_STATUS.ENTIRE) {
        return true;
      }
    }

    return false;
  }

  private exertAbility(direction: Vector2) {
    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);

    const tarEntity = StaticSystem.entityGroup.getEntity(tarPosition);
    const tarCharacter = StaticSystem.entityGroup.getCharacter(tarPosition);

    const brokeableEntity = tarEntity?.getAbility(ABILITY_NAMES.BROKEABLE);
    const brokeableCharacter = tarCharacter?.getAbility(ABILITY_NAMES.BROKEABLE);

    if (brokeableEntity?.status === ABILITY_STATUS.ENTIRE) {
      brokeableEntity?.exert(direction);
      return;
    }

    if (brokeableCharacter?.status === ABILITY_STATUS.ENTIRE) {
      brokeableCharacter?.exert(direction);
      return;
    }
  }
}
