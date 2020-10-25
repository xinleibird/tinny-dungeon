import { GameSound } from '../sound';
import Character, { PLAYER_TYPES } from './Character';

export default class Player extends Character {
  public constructor(type: PLAYER_TYPES) {
    super(type);

    this.registSounds();
  }

  private registSounds() {
    this._stepSound = GameSound.get('player_step');
    this._attackSound = GameSound.get('player_attack');
  }
}
