import { CONTROLLED_KEYS } from '../config';
import Keyboard from './keyboard';

export enum CONTROL_ACTIONS {
  WALK_LEFT = 'walkLeft',
  WALK_RIGHT = 'walkRight',
  WALK_UP = 'walkUp',
  WALK_DOWN = 'walkDown',
}

export default class Controller {
  private _keyboard: Keyboard;
  public constructor() {
    const keyboard = new Keyboard();
    console.log(CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_DOWN]);

    for (const key in CONTROLLED_KEYS) {
      if (Object.prototype.hasOwnProperty.call(CONTROLLED_KEYS, key)) {
        keyboard.addHandleKey(CONTROLLED_KEYS[key]);
      }
    }

    this._keyboard = keyboard;
  }
}
