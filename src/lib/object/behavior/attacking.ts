import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import * as PIXI from 'pixi.js';
import { Character } from '../../character';
import { SPRITE_OPTIONS } from '../../config';
import StaticSystem from '../../core/static';
import { Vector2 } from '../../geometry';
import { updateEntitiesDislightings, updateEntitiesLightings } from '../../utils';
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
    this._character.attackSound.play();

    const geometryPosition = this._character.geometryPosition;
    const { x, y } = geometryPosition;
    const { x: dx, y: dy } = direction;

    updateEntitiesDislightings(geometryPosition);

    gsap.to(this._character, {
      duration: 0.075,
      pixi: {
        x: x * 16 + SPRITE_OFFSET_X + dx * 16,
        y: y * 16 + SPRITE_OFFSET_Y + dy * 16,
      },
    });

    gsap.to(this._character, {
      duration: 0.075,
      pixi: { x: x * 16 + SPRITE_OFFSET_X, y: y * 16 + SPRITE_OFFSET_Y },
    });

    this._character.attack(direction);

    this.triggerAbility(direction);

    updateEntitiesLightings(geometryPosition);
  }

  public canDo(direction: Vector2) {
    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);
    const { x, y } = tarPosition;

    const tarEntity = StaticSystem.entityGroup.getEntity(x, y);

    if (tarEntity.hasAbility(ABILITY_NAMES.HURTABLE)) {
      const passable = tarEntity.getAbility(ABILITY_NAMES.HURTABLE);
      if (passable.status === ABILITY_STATUS.CANHURT) {
        return true;
      }
    }

    return false;
  }

  private triggerAbility(direction: Vector2) {
    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);
    const { x, y } = tarPosition;

    const tarEntity = StaticSystem.entityGroup.getEntity(x, y);

    if (tarEntity.hasAbility(ABILITY_NAMES.HURTABLE)) {
      const hurtable = tarEntity.getAbility(ABILITY_NAMES.HURTABLE);
      if (hurtable.status === ABILITY_STATUS.CANHURT) {
        hurtable.exert(direction);
      }
    }
  }
}
