import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { JOYSTICK_CONTROLLED_JOYS, KEYBOARD_CONTROLLED_KEYS } from '../config';
import { Vector2 } from '../geometry';
import {
  CONTROL_ACTIONS,
  event,
  JOY_EVENTS,
  JOY_NAMES,
  KEY_EVENTS,
  KEY_NAMES,
} from '../input';
import Entity from '../object/entity';
import { SoundEffect } from '../sound';
import Character, { PLAYER_TYPES } from './character';

export default class Player extends Character {
  private _someKeysDown = false;
  private _lastUpTimeStamp = 0;
  private _holdDelay = 150;

  public constructor(type: PLAYER_TYPES, entities: Entity[][], viewport?: Viewport) {
    super(type, entities, viewport);

    this.registSounds();

    this.handleKeyDown();
    this.handleKeyUp();

    this.handleJoyDown();
    this.handleJoyUp();

    this.handleKeyFree();
  }

  public get type() {
    return this._type;
  }

  private registSounds() {
    this._stepSound = SoundEffect.get('player_step');
    this._attackSound = SoundEffect.get('player_attack');
  }

  private handleKeyFree() {
    PIXI.Ticker.shared.add(() => {
      if (!this._someKeysDown && Date.now() > this._lastUpTimeStamp + this._holdDelay) {
        this.hold();
      }
    });
  }

  private handleKeyDown() {
    event.on(KEY_EVENTS.KEY_DOWN, (key: KEY_NAMES, timeStamp: number) => {
      switch (KEY_NAMES[key]) {
        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_LEFT]: {
          this.direction = Vector2.left;
          this.showExternal();

          this.walk(Vector2.left);

          this._someKeysDown = true;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          this.direction = Vector2.right;
          this.showExternal();

          this.walk(Vector2.right);

          this._someKeysDown = true;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_UP]: {
          this.direction = Vector2.up;
          this.showExternal();

          this.walk(Vector2.up);

          this._someKeysDown = true;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_DOWN]: {
          this.direction = Vector2.down;
          this.showExternal();

          this.walk(Vector2.down);

          this._someKeysDown = true;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.SHOW_EXTERNAL]: {
          this.showExternal();
          this._someKeysDown = true;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.ATTACK]: {
          this.attack(this._direction);
          this._someKeysDown = true;
          break;
        }

        default:
          break;
      }
    });
  }

  private handleKeyUp() {
    event.on(KEY_EVENTS.KEY_UP, (key: KEY_NAMES, timeStamp: number) => {
      switch (KEY_NAMES[key]) {
        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_LEFT]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = timeStamp;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = timeStamp;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_UP]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = timeStamp;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_DOWN]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = timeStamp;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.SHOW_EXTERNAL]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = timeStamp;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.ATTACK]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = timeStamp;
          break;
        }

        default:
          break;
      }
    });
  }

  private handleJoyDown() {
    event.on(JOY_EVENTS.JOY_DOWN, (joy: JOY_NAMES) => {
      switch (JOY_NAMES[joy]) {
        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_LEFT]: {
          this.direction = Vector2.left;
          this.showExternal();

          this.walk(Vector2.left);

          this._someKeysDown = true;
          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          this.direction = Vector2.right;
          this.showExternal();

          this.walk(Vector2.right);

          this._someKeysDown = true;
          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_UP]: {
          this.direction = Vector2.up;
          this.showExternal();

          this.walk(Vector2.up);

          this._someKeysDown = true;
          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_DOWN]: {
          this.direction = Vector2.down;
          this.showExternal();

          this.walk(Vector2.down);

          this._someKeysDown = true;
          break;
        }

        default:
          break;
      }
    });
  }

  private handleJoyUp() {
    event.on(JOY_EVENTS.JOY_UP, (joy: JOY_NAMES) => {
      switch (JOY_NAMES[joy]) {
        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_LEFT]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = Date.now();
          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = Date.now();
          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_UP]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = Date.now();
          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_DOWN]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = Date.now();
          break;
        }

        default:
          break;
      }
    });
  }
}
