import { Character } from '../../character';
import { Vector2 } from '../../geometry';
import { SoundEffect } from '../../sound';
import { updateEntitiesLightings } from '../../utils';
import { ABILITY_NAMES, ABILITY_STATUS } from '../ability';
import Entity from '../entity';
import Behavior, { BEHAVIOR_NAMES } from './behavior';

export default class Open extends Behavior {
  public constructor(entities: Entity[][], character: Character) {
    super(entities, character);
    this._name = BEHAVIOR_NAMES.OPENING;
  }

  public do(direction: Vector2) {
    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);
    const { x, y } = tarPosition;
    const tarEntity = this._entities?.[y]?.[x];

    const openable = tarEntity.getAbility(ABILITY_NAMES.OPENABLE);
    openable.status = ABILITY_STATUS.OPEN;

    const passable = tarEntity.getAbility(ABILITY_NAMES.PASSABLE);
    passable.status = ABILITY_STATUS.PASS;

    SoundEffect.play('door_open');

    updateEntitiesLightings(this._character.geometryPosition, this._entities);
  }

  public canDo(direction: Vector2) {
    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);
    const { x, y } = tarPosition;
    const tarEntity = this._entities?.[y]?.[x];

    if (tarEntity.hasAbility(ABILITY_NAMES.OPENABLE)) {
      const openable = tarEntity.getAbility(ABILITY_NAMES.OPENABLE);
      if (openable.status === ABILITY_STATUS.CLOSE) {
        return true;
      }
    }

    return false;
  }
}
