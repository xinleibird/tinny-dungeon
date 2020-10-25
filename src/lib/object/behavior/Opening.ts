import { Character } from '../../character';
import { StaticSystem } from '../../core';
import { Vector2 } from '../../geometry';
import { ABILITY_NAMES, ABILITY_STATUS } from '../ability';
import Behavior, { BEHAVIOR_NAMES } from './Behavior';

export default class Opening extends Behavior {
  public constructor(character: Character) {
    super(character);
    this._name = BEHAVIOR_NAMES.OPENING;
  }

  public async do(direction: Vector2) {
    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);
    const { x, y } = tarPosition;

    const tarEntity = StaticSystem.entityGroup.getEntity(x, y);

    const openable = tarEntity?.getAbility(ABILITY_NAMES.OPENABLE);
    openable.status = ABILITY_STATUS.OPEN;

    const passable = tarEntity?.getAbility(ABILITY_NAMES.PASSABLE);
    passable.status = ABILITY_STATUS.PASS;

    const hurtable = tarEntity?.getAbility(ABILITY_NAMES.HURTABLE);
    hurtable.status = ABILITY_STATUS.NOHURT;
  }

  public canDo(direction: Vector2) {
    if (!direction || direction.equals(Vector2.center)) {
      return false;
    }

    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);
    const { x, y } = tarPosition;
    const tarEntity = StaticSystem.entityGroup.getEntity(x, y);

    if (tarEntity?.hasAbility(ABILITY_NAMES.OPENABLE)) {
      const openable = tarEntity?.getAbility(ABILITY_NAMES.OPENABLE);
      if (openable?.status === ABILITY_STATUS.CLOSE) {
        return true;
      }
    }

    return false;
  }
}
