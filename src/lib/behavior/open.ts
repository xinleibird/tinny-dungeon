import * as PIXI from 'pixi.js';
import { Character } from '../character';
import { Vector2 } from '../geometry';
import { ABILITY_NAMES, ABILITY_STATUS } from '../object/ability';
import Entity from '../object/entity';
import { Loader } from '../system';
import { updateEntitiesLightings } from '../utils';
import Behavior from './behavior';

export default class Open extends Behavior {
  private _doorOpenSound: PIXI.sound.Sound;
  public constructor(entities: Entity[][], character: Character) {
    super('Open', entities, character);
    const doorOpenSound = Loader.sounds.effects.door_open;
    doorOpenSound.volume = 0.1;
    doorOpenSound.loop = false;

    this._doorOpenSound = doorOpenSound;
  }

  public do(direction: Vector2) {
    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);
    const { x, y } = tarPosition;
    const tarEntity = this._entities?.[y]?.[x];

    const openable = tarEntity.getAbility(ABILITY_NAMES.OPENABLE);
    openable.status = ABILITY_STATUS.OPEN;

    const passable = tarEntity.getAbility(ABILITY_NAMES.PASSABLE);
    passable.status = ABILITY_STATUS.PASS;

    this._doorOpenSound.play();
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
