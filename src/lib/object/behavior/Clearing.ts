import { Character } from '../../character';
import { StaticSystem } from '../../core';
import { Vector2 } from '../../geometry';
import { ABILITY_NAMES } from '../ability';
import Behavior, { BEHAVIOR_NAMES } from './Behavior';

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
    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);
    this._character.geometryPosition = tarPosition;
  }
}
