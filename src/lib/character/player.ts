import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { JOYSTICK_CONTROLLED_JOYS, KEYBOARD_CONTROLLED_KEYS } from '../config';
import { IPosition, Vector2 } from '../geometry';
import {
  CONTROL_ACTIONS,
  event,
  JOY_EVENTS,
  JOY_NAMES,
  KEY_EVENTS,
  KEY_NAMES,
} from '../input';
import { ABILITY_NAMES } from '../object/ability';
import { ABILITY_STATUS } from '../object/ability/ability';
import { Loader } from '../system';
import Dungeon from '../tilemap/dungeon';
import Character, { PLAYER_TYPES } from './character';

const ticker = PIXI.Ticker.shared;

export default class Player extends Character {
  private _someKeysDown = false;
  private _lastUpTimeStamp = 0;
  private _holdDelay = 300;

  public constructor(
    geometryPosition: Vector2 | IPosition,
    type: PLAYER_TYPES,
    currentDungeon: Dungeon,
    viewport?: Viewport
  ) {
    super(geometryPosition, type, currentDungeon, viewport);

    const stepSound = Loader.sounds.effects.player_step;
    stepSound.volume = 0.01;
    stepSound.loop = false;

    this._stepSound = stepSound;

    this.handleKeyDown();
    this.handleKeyUp();

    this.handleJoyDown();
    this.handleJoyUp();

    this.handleKeyFree();
  }

  public get type() {
    return this._type;
  }

  public handleKeyFree() {
    ticker.add(() => {
      if (!this._someKeysDown && Date.now() > this._lastUpTimeStamp + this._holdDelay) {
        this.hold();
      }
    });
  }

  private handleKeyDown() {
    event.on(KEY_EVENTS.KEY_DOWN, (key: KEY_NAMES) => {
      switch (KEY_NAMES[key]) {
        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_LEFT]: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          this.direction = Vector2.left;
          this.showExternal();

          const entity = entities[y][x - 1];
          if (
            entity?.hasAbility(ABILITY_NAMES.PASSABLE) &&
            entity?.getAbility(ABILITY_NAMES.PASSABLE).status === ABILITY_STATUS.PASS
          ) {
            this.walk(Vector2.left);
          }

          this._someKeysDown = true;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          this.direction = Vector2.right;
          this.showExternal();

          const entity = entities[y][x + 1];
          if (
            entity?.hasAbility(ABILITY_NAMES.PASSABLE) &&
            entity?.getAbility(ABILITY_NAMES.PASSABLE).status === ABILITY_STATUS.PASS
          ) {
            this.walk(Vector2.right);
          }

          this._someKeysDown = true;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_UP]: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          this.direction = Vector2.up;
          this.showExternal();

          const entity = entities[y - 1][x];
          if (
            entity?.hasAbility(ABILITY_NAMES.PASSABLE) &&
            entity?.getAbility(ABILITY_NAMES.PASSABLE).status === ABILITY_STATUS.PASS
          ) {
            this.walk(Vector2.up);
          }

          this._someKeysDown = true;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_DOWN]: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          this.direction = Vector2.down;
          this.showExternal();

          const entity = entities[y + 1][x];
          if (
            entity?.hasAbility(ABILITY_NAMES.PASSABLE) &&
            entity?.getAbility(ABILITY_NAMES.PASSABLE).status === ABILITY_STATUS.PASS
          ) {
            this.walk(Vector2.down);
          }

          this._someKeysDown = true;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.SHOW_EXTERNAL]: {
          this.showExternal();
          this._someKeysDown = true;
          break;
        }

        default:
          break;
      }
    });
  }

  private handleKeyUp() {
    event.on(KEY_EVENTS.KEY_UP, (key: KEY_NAMES) => {
      switch (KEY_NAMES[key]) {
        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_LEFT]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = Date.now();
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = Date.now();
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_UP]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = Date.now();
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_DOWN]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = Date.now();
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.SHOW_EXTERNAL]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = Date.now();
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
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          this.direction = Vector2.left;
          this.showExternal();

          const entity = entities[y][x - 1];
          if (
            entity?.hasAbility(ABILITY_NAMES.PASSABLE) &&
            entity?.getAbility(ABILITY_NAMES.PASSABLE).status === ABILITY_STATUS.PASS
          ) {
            this.walk(Vector2.left);
          }

          this._someKeysDown = true;
          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          this.direction = Vector2.right;
          this.showExternal();

          const entity = entities[y][x + 1];
          if (
            entity?.hasAbility(ABILITY_NAMES.PASSABLE) &&
            entity?.getAbility(ABILITY_NAMES.PASSABLE).status === ABILITY_STATUS.PASS
          ) {
            this.walk(Vector2.right);
          }

          this._someKeysDown = true;
          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_UP]: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          this.direction = Vector2.up;
          this.showExternal();

          const entity = entities[y - 1][x];
          if (
            entity?.hasAbility(ABILITY_NAMES.PASSABLE) &&
            entity?.getAbility(ABILITY_NAMES.PASSABLE).status === ABILITY_STATUS.PASS
          ) {
            this.walk(Vector2.up);
          }

          this._someKeysDown = true;
          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_DOWN]: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          this.direction = Vector2.down;
          this.showExternal();

          const entity = entities[y + 1][x];
          if (
            entity?.hasAbility(ABILITY_NAMES.PASSABLE) &&
            entity?.getAbility(ABILITY_NAMES.PASSABLE).status === ABILITY_STATUS.PASS
          ) {
            this.walk(Vector2.down);
          }

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
