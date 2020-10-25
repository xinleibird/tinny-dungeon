import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import * as PIXI from 'pixi.js';
import { Character, NonPlayer } from '../../character';
import { SPRITE_OPTIONS } from '../../config';
import StaticSystem from '../../core/static';
import { Vector2 } from '../../geometry';
import { ABILITY_NAMES, ABILITY_STATUS } from '../ability';
import Behavior, { BEHAVIOR_NAMES } from './behavior';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const { SPRITE_OFFSET_X, SPRITE_OFFSET_Y } = SPRITE_OPTIONS;

export default class Attacking extends Behavior {
  public constructor(character: Character) {
    super(character);
    this._name = BEHAVIOR_NAMES.ATTACKING;
  }

  public do(direction: Vector2) {
    return new Promise((resolve, reject) => {
      this._character.attackSound.play();

      const geometryPosition = this._character.geometryPosition;
      const { x, y } = geometryPosition;

      this._character.lastGeometryPosition = new Vector2(x, y);

      const { x: dx, y: dy } = direction;

      gsap.to(this._character.rendering, {
        duration: 0.15,
        pixi: {
          x: x * 16 + SPRITE_OFFSET_X + dx * 8,
          y: y * 16 + SPRITE_OFFSET_Y + dy * 8,
        },
        onComplete: () => {
          gsap.to(this._character.rendering, {
            duration: 0.05,
            pixi: { x: x * 16 + SPRITE_OFFSET_X, y: y * 16 + SPRITE_OFFSET_Y },
            onComplete: () => {
              this._character.hold();
              resolve(true);
            },
          });
        },
      });

      this.exertAbility(direction);

      this._character.direction = direction;
      this._character.attack(direction);
    });
  }

  public canDo(direction: Vector2) {
    if (!direction || direction.equals(Vector2.center)) {
      return false;
    }

    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);
    const { x, y } = tarPosition;

    const tarEntity = StaticSystem.entityGroup.getEntity(x, y);
    const tarCharacter = StaticSystem.characterGroup.getCharacter(x, y);

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
    const { x, y } = tarPosition;

    const tarEntity = StaticSystem.entityGroup.getEntity(x, y);
    const tarCharacter = StaticSystem.characterGroup.getCharacter(x, y);

    if (tarCharacter?.hasAbility(ABILITY_NAMES.HURTABLE)) {
      const hurtable = tarCharacter?.getAbility(ABILITY_NAMES.HURTABLE);
      if (hurtable?.status === ABILITY_STATUS.CANHURT) {
        hurtable?.exert(direction);
      }
    } else if (tarEntity?.hasAbility(ABILITY_NAMES.HURTABLE)) {
      const hurtable = tarEntity?.getAbility(ABILITY_NAMES.HURTABLE);
      if (hurtable?.status === ABILITY_STATUS.CANHURT) {
        hurtable?.exert(direction);
      }
    }
  }
}
