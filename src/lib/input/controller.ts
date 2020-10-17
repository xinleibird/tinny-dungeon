import { JOYSTICK_CONTROLLED_JOYS, KEYBOARD_CONTROLLED_KEYS } from '../config';
import Joystick from './joystick';
import Keyboard from './keyboard';

export enum CONTROL_ACTIONS {
  WALK_LEFT = 'walkLeft',
  WALK_RIGHT = 'walkRight',
  WALK_UP = 'walkUp',
  WALK_DOWN = 'walkDown',
  SHOW_EXTERNAL = 'showExternal',
  ATTACK = 'attack',
}

export default class Controller {
  private _keyboard: Keyboard;
  private _joystick: Joystick;
  public constructor() {
    this._keyboard = new Keyboard();

    for (const key in KEYBOARD_CONTROLLED_KEYS) {
      if (Object.prototype.hasOwnProperty.call(KEYBOARD_CONTROLLED_KEYS, key)) {
        this._keyboard.addHandleKey(KEYBOARD_CONTROLLED_KEYS[key]);
      }
    }

    this._joystick = new Joystick();
    for (const joy in JOYSTICK_CONTROLLED_JOYS) {
      if (Object.prototype.hasOwnProperty.call(JOYSTICK_CONTROLLED_JOYS, joy)) {
        this._joystick.addHandleJoy(JOYSTICK_CONTROLLED_JOYS[joy]);
      }
    }
  }
}
