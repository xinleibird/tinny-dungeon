import { event, KEY_EVENT_TYPES, KEY_NAMES } from './event';

export default class Key {
  private _keyName: KEY_NAMES;
  private _isDown = false;
  private _isUp = true;
  private _lastDown = 0;
  private _lastUp = 0;
  private _delay = 100;
  private onDown = event;
  private onUp = event;

  public constructor(key: KEY_NAMES) {
    this._keyName = key;
  }

  public processKeyDown(event: KeyboardEvent) {
    if (this._isDown) {
      if (event.timeStamp > this._lastDown + this._delay) {
        this.onDown.emit(KEY_EVENT_TYPES.KEY_DOWN, this._keyName);
        this._lastDown = event.timeStamp;
      }
    } else {
      this._isDown = true;
      this._isUp = false;

      this.onDown.emit(KEY_EVENT_TYPES.KEY_DOWN, this._keyName);
      this._lastDown = event.timeStamp;
    }
  }

  public processKeyUp(event: KeyboardEvent) {
    this._isDown = false;
    this._isUp = true;
    this._lastUp = event.timeStamp;

    this.onUp.emit(KEY_EVENT_TYPES.KEY_UP, this._keyName);
  }
}
