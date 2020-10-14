import nipple, { JoystickManager } from 'nipplejs';
import { JOY_NAMES } from './event';
import Joy, { IJoyEventType } from './joy';

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
    this._nipple = nipple.create({ zone: document.getElementById('root') });
    this._handleJoys = {};

    this._nipple.on('dir', this.processJoyDown.bind(this));
    this._nipple.on('end', this.processJoyUp.bind(this));
  }

  private processJoyDown(event: nipple.EventData, data: nipple.JoystickOutputData) {
    this._burstIDs.push(
      setInterval(() => {
        const timeStamp = Date.now();
        const joy = data?.direction?.angle as JOY_NAMES;

        const inHandle = this._handleJoys?.[joy];

        if (inHandle) {
          const currentJoy = data.direction.angle;

          if (
            currentJoy === this._lastJoy ||
            (currentJoy !== this._lastJoy && timeStamp > this._lastDown + this._delay)
          ) {
            const event: IJoyEventType = { timeStamp, joy };
            inHandle.processJoyDown(event);
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
