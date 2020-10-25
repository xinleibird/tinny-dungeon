import { emitter, KEY_EVENTS } from '../system';

export enum KEY_NAMES {
  Backspace = 'Backspace',
  Tab = 'Tab',
  Enter = 'Enter',
  Shift = 'Shift',
  Control = 'Control',
  Alt = 'Alt',
  CapsLock = 'CapsLock',
  Escape = 'Escape',
  Space = 'Space',
  PageUp = 'PageUp',
  PageDown = 'PageDown',
  End = 'End',
  Home = 'Home',
  ArrowLeft = 'ArrowLeft',
  ArrowUp = 'ArrowUp',
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',
  Left = 'Left',
  Up = 'Up',
  Right = 'Right',
  Down = 'Down',
  Insert = 'Insert',
  Delete = 'Delete',
  Zero = '0',
  ClosedParen = ')',
  One = '1',
  ExclamationMark = '!',
  Two = '2',
  AtSign = '@',
  Three = '3',
  PoundSign = '£',
  Hash = '#',
  Four = '4',
  DollarSign = '$',
  Five = '5',
  PercentSign = '%',
  Six = '6',
  Caret = '^',
  Hat = '^',
  Seven = '7',
  Ampersand = '&',
  Eight = '8',
  Star = '*',
  Asterisk = '*',
  Nine = '9',
  OpenParen = '(',
  a = 'a',
  b = 'b',
  c = 'c',
  d = 'd',
  e = 'e',
  f = 'f',
  g = 'g',
  h = 'h',
  i = 'i',
  j = 'j',
  k = 'k',
  l = 'l',
  m = 'm',
  n = 'n',
  o = 'o',
  p = 'p',
  q = 'q',
  r = 'r',
  s = 's',
  t = 't',
  u = 'u',
  v = 'v',
  w = 'w',
  x = 'x',
  y = 'y',
  z = 'z',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
  I = 'I',
  J = 'J',
  K = 'K',
  L = 'L',
  M = 'M',
  N = 'N',
  O = 'O',
  P = 'P',
  Q = 'Q',
  R = 'R',
  S = 'S',
  T = 'T',
  U = 'U',
  V = 'V',
  W = 'W',
  X = 'X',
  Y = 'Y',
  Z = 'Z',
  Meta = 'Meta',
  LeftWindowKey = 'Meta',
  RightWindowKey = 'Meta',
  Numpad0 = '0',
  Numpad1 = '1',
  Numpad2 = '2',
  Numpad3 = '3',
  Numpad4 = '4',
  Numpad5 = '5',
  Numpad6 = '6',
  Numpad7 = '7',
  Numpad8 = '8',
  Numpad9 = '9',
  Multiply = '*',
  Add = '+',
  Subtract = '-',
  DecimalPoint = '.',
  MSDecimalPoint = 'Decimal',
  Divide = '/',
  F1 = 'F1',
  F2 = 'F2',
  F3 = 'F3',
  F4 = 'F4',
  F5 = 'F5',
  F6 = 'F6',
  F7 = 'F7',
  F8 = 'F8',
  F9 = 'F9',
  F10 = 'F10',
  F11 = 'F11',
  F12 = 'F12',
  NumLock = 'NumLock',
  ScrollLock = 'ScrollLock',
  SemiColon = ';',
  Equals = '=',
  Comma = ',',
  Dash = '-',
  Period = '.',
  UnderScore = '_',
  PlusSign = '+',
  ForwardSlash = '/',
  Tilde = '~',
  GraveAccent = '`',
  OpenBracket = '[',
  ClosedBracket = ']',
  Quote = "'",
}
export default class Key {
  private _keyName: KEY_NAMES;
  private _isDown = false;
  private _isUp = true;
  private _lastDown = 0;
  private _lastUp = 0;
  private _delay = 50;
  private onDown = emitter;
  private onUp = emitter;

  public constructor(key: KEY_NAMES) {
    this._keyName = key;
  }

  public processKeyDown(event: KeyboardEvent) {
    if (this._isDown) {
      if (event.timeStamp > this._lastDown + this._delay) {
        this.onDown.emit(KEY_EVENTS.KEY_DOWN, this._keyName, Date.now());
        this._lastDown = event.timeStamp;
      }
    } else {
      this._isDown = true;
      this._isUp = false;

      this.onDown.emit(KEY_EVENTS.KEY_DOWN, this._keyName, Date.now());
      this._lastDown = event.timeStamp;
    }
  }

  public processKeyUp(event: KeyboardEvent) {
    this._isDown = false;
    this._isUp = true;
    this._lastUp = event.timeStamp;

    this.onUp.emit(KEY_EVENTS.KEY_UP, this._keyName, Date.now());
  }
}
