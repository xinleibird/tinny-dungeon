import { KEY_NAMES } from './event';
import Keyboard from './keyboard';

export enum CONTROL_ACTIONS {
  WALK_LEFT = 'walkLeft',
  WALK_RIGHT = 'walkRight',
  WALK_UP = 'walkUp',
  WALK_DOWN = 'walkDown',
}

export const controlledKeys = {
  [CONTROL_ACTIONS.WALK_LEFT]: KEY_NAMES.a,
  [CONTROL_ACTIONS.WALK_RIGHT]: KEY_NAMES.d,
  [CONTROL_ACTIONS.WALK_UP]: KEY_NAMES.w,
  [CONTROL_ACTIONS.WALK_DOWN]: KEY_NAMES.s,
};

export default class Controller {
  private _keyboard: Keyboard;
  public constructor() {
    const keyboard = new Keyboard();

    for (const key in controlledKeys) {
      if (Object.prototype.hasOwnProperty.call(controlledKeys, key)) {
        keyboard.addHandleKey(controlledKeys[key]);
      }
    }

    this._keyboard = keyboard;
  }
}
