import { SoundEffect } from '../sound';
import Character, { PLAYER_TYPES } from './character';

export default class Player extends Character {
  public constructor(type: PLAYER_TYPES) {
    super(type);

    this.registSounds();
  }

  private registSounds() {
    this._stepSound = SoundEffect.get('player_step');
    this._attackSound = SoundEffect.get('player_attack');
  }
}
