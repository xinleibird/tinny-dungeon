import { KEY_NAMES } from './event';
import Keyboard from './keyboard';

export enum CONTROL_ACTIONS {
  WALK_LEFT = 'walkLeft',
  WALK_RIGHT = 'walkRight',
  WALK_UP = 'walkUp',
  WALK_DOWN = 'walkDown',
}

export const CONTROLLED_KEYS = {
  [CONTROL_ACTIONS.WALK_LEFT]: KEY_NAMES.a,
  [CONTROL_ACTIONS.WALK_RIGHT]: KEY_NAMES.d,
  [CONTROL_ACTIONS.WALK_UP]: KEY_NAMES.w,
  [CONTROL_ACTIONS.WALK_DOWN]: KEY_NAMES.s,
};

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
