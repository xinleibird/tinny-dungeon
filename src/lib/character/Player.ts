import { Control, StaticSystem } from '../core';
import { Vector2 } from '../geometry';
import { Attacking, BEHAVIOR_NAMES, Clearing, Movement, Opening } from '../object/behavior';
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

  public getDamage(damage: number) {
    super.getDamage(damage);

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
    let isDo = false;
    for (const behavior of this._behaviors) {
      if (behavior.canDo(direction)) {
        await behavior.do(direction);
        isDo = true;
        break;
      }
    }

    if (!isDo) {
      const attack = this._behaviors.find((e) => {
        return e.name === BEHAVIOR_NAMES.ATTACKING;
      });

      if (attack?.canDo(this._direction)) {
        await attack?.do(this._direction);
      }
    }
  }

  protected registBehaviors() {
    const opening = new Opening(this);
    const attacting = new Attacking(this);
    const clearing = new Clearing(this);
    const movement = new Movement(this);

    this._behaviors.push(opening, attacting, clearing, movement);
  }

  protected registSounds() {
    super.registSounds();
    this._stepSound = GameSound.get('player_step');
    this._attackSound = GameSound.get('player_attack');
  }
}
