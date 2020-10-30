import { GameSound } from '../sound';
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

  private registSounds() {
    this._stepSound = GameSound.get('player_step');
    this._attackSound = GameSound.get('player_attack');
  }
}
