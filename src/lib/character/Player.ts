import { Control, StaticSystem } from '../core';
import { Vector2 } from '../geometry';
import {
  Attacking,
  BEHAVIOR_NAMES,
  Broking,
  Clearing,
  Defencing,
  Movement,
  Opening,
} from '../object/behavior';
import { GameSound } from '../sound';
import { Emitter, GAME_EVENTS } from '../system';
import { updateEntitiesLightings } from '../utils';
import Character, { PLAYER_TYPES } from './Character';
import CharacterClass from './CharacterClass';

export default class Player extends Character {
  public constructor(type: PLAYER_TYPES) {
    super(type);

    this._class = new CharacterClass({ ST: 12, DX: 12, IQ: 12, HT: 12 }, 'Sw', 'cut');

    this._class.attackBonus = 1;
    this._class.damageResistance = 1;
    StaticSystem.camera.follow(this);
  }

  public gotDamage(damage: number) {
    super.gotDamage(damage);

    if (!this.alive) {
      Emitter.emit(GAME_EVENTS.USER_DIE);
    }
  }

  public respawn(geometryPosition: Vector2) {
    Control.regist(this);
    this.geometryPosition = geometryPosition;
    Emitter.emit(GAME_EVENTS.SCENE_START);
    updateEntitiesLightings(this._geometryPosition);
  }

  public async rollBehaviors(direction: Vector2) {
    if (direction.equals(Vector2.center)) {
      if (
        this.canBehave(this._direction, BEHAVIOR_NAMES.ATTACKING) ||
        this.canBehave(this._direction, BEHAVIOR_NAMES.OPENING)
      ) {
        await super.rollBehaviors(this._direction);
      } else {
        await super.rollBehaviors(direction);
      }
    } else {
      await super.rollBehaviors(direction);
    }
  }

  protected registBehaviors() {
    const opening = new Opening(this);
    const broking = new Broking(this);
    const attacting = new Attacking(this);
    const clearing = new Clearing(this);
    const movement = new Movement(this);
    const defencing = new Defencing(this);

    this._behaviors.push(opening, broking, attacting, defencing, clearing, movement);
  }

  protected registSounds() {
    super.registSounds();
    this._stepSound = GameSound.get('player_step');
    this._attackSound = GameSound.get('player_attack');
  }
}
