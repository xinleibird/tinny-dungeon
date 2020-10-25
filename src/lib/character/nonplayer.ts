import { Scene } from '../scene';
import { SoundEffect } from '../sound';
import Character, { NONPLAYER_TYPES } from './character';

export default class NonPlayer extends Character {
  public constructor(type: NONPLAYER_TYPES, scene?: Scene) {
    super(type);
    this.registSounds();
  }

  public hide() {
    this.rendering.alpha = 0;
  }

  public show() {
    this.rendering.alpha = 1;
  }

  private registSounds() {
    this._stepSound = SoundEffect.get('nonplayer_step', 0.006);
    this._attackSound = SoundEffect.get('nonplayer_attack', 0.01);
  }
}
