import { SoundEffect } from '../sound';
import { updateEntitiesLightings } from '../utils';
import Character, { PLAYER_TYPES } from './character';

export default class Player extends Character {
  public constructor(type: PLAYER_TYPES) {
    super(type);

    this.registSounds();
  }

  protected updateLighting() {
    updateEntitiesLightings(this.geometryPosition);
  }

  private registSounds() {
    this._stepSound = SoundEffect.get('player_step');
    this._attackSound = SoundEffect.get('player_attack');
  }
}
