import nipple, { JoystickManager } from 'nipplejs';
import { Emitter } from '../system';
import { GAME_EVENTS } from '../system/Emitter';
import Joy, { IJoyEventType, JOY_NAMES } from './Joy';

type HandleJoysType = {
  [key in JOY_NAMES]?: Joy;
};

export default class Joystick {
  private _handleJoys: HandleJoysType = {};
  private _lastDown = 0;
  private _lastJoy: JOY_NAMES;
  private _delay = 100;

  private _nipple: JoystickManager;

  private _burstIDs: any[] = [];

  public constructor() {
    this.initialize();
  }

  public addHandleJoy(joy: JOY_NAMES) {
    const inHandle = this._handleJoys?.[joy];
    if (!inHandle) {
      this._handleJoys[joy] = new Joy(joy);
    }
  }

  private initialize() {
    this._nipple = nipple.create({ zone: document.body });
    this._handleJoys = {};

    Emitter.on(GAME_EVENTS.SCENE_START, () => {
      this._nipple.on('plain', this.processJoyDown.bind(this));
      this._nipple.on('end', this.processJoyUp.bind(this));
    });

    Emitter.on(GAME_EVENTS.USER_DIE, () => {
      this._nipple.destroy();
    });
  }

  private processJoyDown(event: nipple.EventData, data: nipple.JoystickOutputData) {
    const joy = data?.direction?.angle as JOY_NAMES;
    const inHandleJoy = this._handleJoys?.[joy];

    this._burstIDs.push(
      setInterval(() => {
        const timeStamp = Date.now();

        if (inHandleJoy) {
          if (
            joy === this._lastJoy ||
            (joy !== this._lastJoy && timeStamp > this._lastDown + this._delay)
          ) {
            const event: IJoyEventType = { timeStamp, joy };
            inHandleJoy.processJoyDown(event);
            this._lastJoy = joy as JOY_NAMES;
            this._lastDown = timeStamp;
          }
        }
      }, 50)
    );
  }

  private processJoyUp(event: nipple.EventData, data: nipple.JoystickOutputData) {
    const timeStamp = Date.now();

    for (const inHandle in this._handleJoys) {
      if (Object.prototype.hasOwnProperty.call(this._handleJoys, inHandle)) {
        const event: IJoyEventType = { timeStamp };
        this._handleJoys[inHandle].processJoyUp(event);
      }
    }

    this._burstIDs.forEach((id) => {
      clearInterval(id);
    });
  }
}
