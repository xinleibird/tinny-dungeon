import { KEY_NAMES } from './event';
import Key from './key';

type HandleKeysType = {
  [key in KEY_NAMES]?: Key;
};
export default class Keyboard {
  private _handleKeys: HandleKeysType = {};

  public constructor() {
    this.initialize();
  }

  public addHandleKey(key: KEY_NAMES) {
    const inHandle = this._handleKeys?.[key];

    if (!inHandle) {
      this._handleKeys[key] = new Key(key);
    }
  }

  private initialize() {
    this._handleKeys = {};
    window.addEventListener('keydown', this.processKeyDown.bind(this));
    window.addEventListener('keyup', this.processKeyUp.bind(this));
  }

  private processKeyDown(event: KeyboardEvent) {
    const inHandle = this._handleKeys?.[event.key] as Key;

    if (inHandle) {
      event.preventDefault();
      inHandle.processKeyDown(event);
    }
  }

  private processKeyUp(event: KeyboardEvent) {
    const inHandle = this._handleKeys?.[event.key] as Key;
    if (inHandle) {
      inHandle.processKeyUp(event);
    }
  }
}
