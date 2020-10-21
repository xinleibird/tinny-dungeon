import { Character } from '../../character';
import StaticSystem from '../../core/static';
import { Vector2 } from '../../geometry';
import { SoundEffect } from '../../sound';
import { updateEntitiesLightings } from '../../utils';
import { ABILITY_NAMES, ABILITY_STATUS } from '../ability';
import Behavior, { BEHAVIOR_NAMES } from './behavior';

export default class Open extends Behavior {
  public constructor(character: Character) {
    super(character);
    this._name = BEHAVIOR_NAMES.OPENING;
  }

  public do(direction: Vector2) {
    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);
    const { x, y } = tarPosition;

    const tarEntity = StaticSystem.entityGroup.getEntity(x, y);

    const openable = tarEntity.getAbility(ABILITY_NAMES.OPENABLE);
    openable.status = ABILITY_STATUS.OPEN;

    const passable = tarEntity.getAbility(ABILITY_NAMES.PASSABLE);
    passable.status = ABILITY_STATUS.PASS;

    SoundEffect.play('door_open');

    updateEntitiesLightings(this._character.geometryPosition);
  }

  public canDo(direction: Vector2) {
    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);
    const { x, y } = tarPosition;
    const tarEntity = StaticSystem.entityGroup.getEntity(x, y);

    if (tarEntity.hasAbility(ABILITY_NAMES.OPENABLE)) {
      const openable = tarEntity.getAbility(ABILITY_NAMES.OPENABLE);
      if (openable.status === ABILITY_STATUS.CLOSE) {
        return true;
      }
    }

    return false;
  }
}
