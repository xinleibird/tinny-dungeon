import { Scene } from '../scene';
import { GameSound } from '../sound';
import Character, { NONPLAYER_TYPES } from './Character';

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
    this._stepSound = GameSound.get('nonplayer_step', 0.006);
    this._attackSound = GameSound.get('nonplayer_attack', 0.01);
  }
}
