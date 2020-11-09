import { Character } from '../../character';
import { SPRITE_OPTIONS } from '../../config';
import { StaticSystem } from '../../core';
import { Vector2 } from '../../geometry';
import { GameSound } from '../../sound';
import { Emitter, GAME_EVENTS } from '../../system';
import { ABILITY_NAMES } from '../ability';
import Behavior, { BEHAVIOR_NAMES } from './Behavior';

const { SPRITE_OFFSET_X, SPRITE_OFFSET_Y, SPRITE_SIZE } = SPRITE_OPTIONS;

export default class Clearing extends Behavior {
  public constructor(character: Character) {
    super(character);
    this._name = BEHAVIOR_NAMES.CLEARING;
  }

  public canDo(direction: Vector2) {
    if (!direction || direction.equals(Vector2.center)) {
      return false;
    }

    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);
    const tarEntity = StaticSystem.entityGroup.getEntity(tarPosition);

    if (tarEntity.hasAbility(ABILITY_NAMES.CLEARABLE)) {
      return true;
    }
    return false;
  }

  public async do(direction: Vector2) {
    await this._character.doBehavior(BEHAVIOR_NAMES.MOVEMENT, direction);
    GameSound.play('stair', 0.05, true, 2000);

    Emitter.emit(GAME_EVENTS.SCENE_CLEAR);
  }
}
