import { Vector2 } from '../geometry';
import { GameSound } from '../sound';
import { Emitter } from '../system';
import { GAME_EVENTS } from '../system/Emitter';
import { updateEntitiesLightings } from '../utils';
import Character, { PLAYER_TYPES } from './Character';
import CharacterClass from './CharacterClass';

export default class Player extends Character {
  public constructor(type: PLAYER_TYPES) {
    super(type);

    this._class = new CharacterClass({ ST: 12, DX: 12, IQ: 12, HT: 12 }, 'Sw', 'cut');
    this._class.attackBonus = 1;
    this._class.damageResistance = 1;
    this.registSounds();
  }

  public damageHP(damage: number) {
    super.damageHP(damage);

    if (!this.alive) {
      Emitter.emit(GAME_EVENTS.USER_DIE);
    }
  }

  public respawn(geometryPosition: Vector2) {
    this.geometryPosition = geometryPosition;
    Emitter.emit(GAME_EVENTS.SCENE_START);
    updateEntitiesLightings(this._geometryPosition);
  }

  private registSounds() {
    this._stepSound = GameSound.get('player_step');
    this._attackSound = GameSound.get('player_attack');
  }
}
