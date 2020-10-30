import { Scene } from '../scene';
import { GameSound } from '../sound';
import Character, { NONPLAYER_TYPES } from './Character';
import CharacterClass from './CharacterClass';

export default class NonPlayer extends Character {
  public constructor(type: NONPLAYER_TYPES, scene?: Scene) {
    super(type);

    if (type === NONPLAYER_TYPES.SKELETON) {
      this._class = new CharacterClass({ ST: 10, DX: 11, IQ: 9, HT: 10 }, 'Thr', 'cr');
    }

    this.registSounds();
  }

  public hide() {
    this._rendering.visible = false;
  }

  public show() {
    this._rendering.visible = true;
  }

  private registSounds() {
    this._stepSound = GameSound.get('nonplayer_step', 0.006);
    this._attackSound = GameSound.get('nonplayer_attack', 0.01);
  }
}
