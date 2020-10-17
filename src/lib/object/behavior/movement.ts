import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import * as PIXI from 'pixi.js';
import { Character } from '../../character';
import { SPRITE_OPTIONS } from '../../config';
import { Vector2 } from '../../geometry';
import { updateEntitiesDislightings, updateEntitiesLightings } from '../../utils';
import { ABILITY_NAMES, ABILITY_STATUS } from '../ability';
import Entity from '../entity';
import Behavior, { BEHAVIOR_NAMES } from './behavior';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const { SPRITE_OFFSET_X, SPRITE_OFFSET_Y } = SPRITE_OPTIONS;

export default class Movement extends Behavior {
  public constructor(entities: Entity[][], character: Character) {
    super(entities, character);
    this._name = BEHAVIOR_NAMES.MOVEMENT;
  }

  public do(direction: Vector2) {
    const geometryPosition = this._character.geometryPosition;
    updateEntitiesDislightings(geometryPosition, this._entities);

    const { x, y } = geometryPosition;

    geometryPosition.combine(direction);

    const { x: tarX, y: tarY } = geometryPosition;

    this._entities[tarY][tarX].character = this._character;
    this._entities[y][x].character = null;

    gsap.to(this._character, {
      duration: 0.15,
      pixi: { x: tarX * 16 + SPRITE_OFFSET_X, y: tarY * 16 + SPRITE_OFFSET_Y },
    });

    updateEntitiesLightings(geometryPosition, this._entities);
  }

  public canDo(direction: Vector2) {
    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);
    const { x, y } = tarPosition;

    const tarEntity = this._entities?.[y]?.[x];

    if (tarEntity.hasAbility(ABILITY_NAMES.PASSABLE)) {
      const passable = tarEntity.getAbility(ABILITY_NAMES.PASSABLE);
      if (passable.status === ABILITY_STATUS.PASS) {
        return true;
      }
    }

    return false;
  }
}
