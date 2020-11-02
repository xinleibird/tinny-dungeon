import nipple, { JoystickManager } from 'nipplejs';
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
    this._nipple = nipple.create({ zone: document.body, color: '#5a697b', threshold: 0.6 });
    this._handleJoys = {};

    this._nipple.on('dir', this.processJoyDown.bind(this));
    this._nipple.on('end', this.processJoyUp.bind(this));
    this._nipple.on('start', this.processJoyCenter.bind(this));
  }

  private processJoyCenter(event: nipple.EventData, data: nipple.JoystickOutputData & 1) {
    const joy = JOY_NAMES.center;
    const inHandleJoy = this._handleJoys?.[joy];
    const timeStamp = Date.now();
    if (inHandleJoy) {
      const event: IJoyEventType = { timeStamp, joy };
      inHandleJoy.processJoyDown(event);
      this._lastJoy = joy as JOY_NAMES;
      this._lastDown = timeStamp;
    }
  }

  private processJoyDown(event: nipple.EventData, data: nipple.JoystickOutputData & 1) {
    this.clearAllInterval();

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

    this.clearAllInterval();
  }

  private clearAllInterval() {
    this._burstIDs.forEach((id) => {
      clearInterval(id);
    });
  }
}
