import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import { Character } from '../../character';
import { StaticSystem } from '../../core';
import { Vector2 } from '../../geometry';
import { GameSound } from '../../sound';
import { ABILITY_NAMES, ABILITY_STATUS } from '../ability';
import { EXTERNAL_NAMES } from '../external/External';
import Behavior, { BEHAVIOR_NAMES } from './Behavior';

export default class Picking extends Behavior {
  public constructor(character: Character) {
    super(character);
    this._name = BEHAVIOR_NAMES.PICKING;
  }

  public do(direction: Vector2) {
    return new Promise((resolve, reject) => {
      this._character.showExternal(EXTERNAL_NAMES.DIRECTION_INDICATOR);
      this._character.isStay = true;
      setTimeout(() => {
        const filter = new PIXI.filters.ColorMatrixFilter();
        this._character.rendering.filters = [filter];
        gsap.to(this._character.rendering, {
          duration: 0.2,
          onStart: () => {
            filter.contrast(1, true);
            GameSound.play('picking');
          },
          onComplete: () => {
            this._character.rendering.filters = [];
            this._character.hideExternal(EXTERNAL_NAMES.DIRECTION_INDICATOR);
            resolve(true);
          },
        });

        const { x, y } = this._character.geometryPosition;
        const entity = StaticSystem.entityGroup.getEntity(x, y);
        const pickupables = entity.getAbilitys(ABILITY_NAMES.PICKUPABLE);

        for (const pick of pickupables) {
          if (pick.status === ABILITY_STATUS.NOUSE) {
            pick.exert(Vector2.center, this._character);
            return;
          }
        }
      }, 50);
    });
  }

  public canDo(direction: Vector2) {
    if (direction?.equals(Vector2.center)) {
      const { x, y } = this._character.geometryPosition;
      const entity = StaticSystem.entityGroup.getEntity(x, y);

      if (entity.hasAbility(ABILITY_NAMES.PICKUPABLE)) {
        const pickupables = entity.getAbilitys(ABILITY_NAMES.PICKUPABLE);
        for (const pick of pickupables) {
          if (pick.status === ABILITY_STATUS.NOUSE) {
            return true;
          }
        }
      }
    }

    return false;
  }
}
