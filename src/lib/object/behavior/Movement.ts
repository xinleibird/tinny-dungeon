import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import * as PIXI from 'pixi.js';
import { Character, Player } from '../../character';
import { SPRITE_OPTIONS } from '../../config';
import { StaticSystem } from '../../core';
import { Vector2 } from '../../geometry';
import { ABILITY_NAMES, ABILITY_STATUS } from '../ability';
import { EXTERNAL_NAMES } from '../external/External';
import Behavior, { BEHAVIOR_NAMES } from './Behavior';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const { SPRITE_OFFSET_X, SPRITE_OFFSET_Y } = SPRITE_OPTIONS;

export default class Movement extends Behavior {
  public constructor(character: Character) {
    super(character);
    this._name = BEHAVIOR_NAMES.MOVEMENT;
  }

  public async do(direction: Vector2) {
    this._character.direction = direction;

    const geometryPosition = this._character.geometryPosition;
    const { x, y } = geometryPosition;
    this._character.lastGeometryPosition = new Vector2(x, y);

    geometryPosition.combine(direction);

    const { x: tarX, y: tarY } = geometryPosition;

    const entityGroup = StaticSystem.entityGroup;
    entityGroup.setCharacter(tarX, tarY, this._character);
    entityGroup.setCharacter(x, y, null);

    gsap.to(this._character.rendering, {
      duration: 0.2,
      pixi: { x: tarX * 16 + SPRITE_OFFSET_X, y: tarY * 16 + SPRITE_OFFSET_Y },
      onStart: async () => {
        this._character.stepSound.play();
        this._character.walk(direction);
      },
    });

    if (this._character instanceof Player) {
      this._character.showExternal(EXTERNAL_NAMES.DIRECTION_INDICATOR);
    }
  }

  public canDo(direction: Vector2) {
    if (!direction || direction.equals(Vector2.center)) {
      return false;
    }

    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);

    const tarCharacter = StaticSystem.entityGroup.getCharacter(tarPosition);
    const tarEntity = StaticSystem.entityGroup.getEntity(tarPosition);

    if (tarCharacter?.hasAbility(ABILITY_NAMES.PASSABLE)) {
      const passable = tarCharacter?.getAbility(ABILITY_NAMES.PASSABLE);
      if (passable?.status === ABILITY_STATUS.STOP) {
        return false;
      }
    }

    if (tarEntity.hasAbility(ABILITY_NAMES.PASSABLE)) {
      const passable = tarEntity.getAbility(ABILITY_NAMES.PASSABLE);
      if (passable.status === ABILITY_STATUS.STOP) {
        return false;
      }
    }

    return true;
  }
}
