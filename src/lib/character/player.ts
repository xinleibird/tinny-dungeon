import * as PIXI from 'pixi.js';

import { CONTROLLED_KEYS } from '../config';
import { IPosition, Vector2 } from '../geometry';
import { CONTROL_ACTIONS, event, KEY_EVENT_TYPES, KEY_NAMES } from '../input';
import { ABILITY_NAMES } from '../objects/ability';
import Character, { PLAYER_TYPES } from './character';

const ticker = PIXI.Ticker.shared;

export default class Player extends Character {
  private _someKeysDown = false;
  private _lastUpTimeStamp = 0;
  private _holdDelay = 300;

  public constructor(geometryPosition: Vector2 | IPosition, type: PLAYER_TYPES) {
    super(geometryPosition, type);
    this.handleDown();
    this.handleUp();
    this.handleHold();
  }

  public get type() {
    return this._type;
  }

  public handleHold() {
    ticker.add(() => {
      if (!this._someKeysDown && Date.now() > this._lastUpTimeStamp + this._holdDelay) {
        this.hold();
      }
    });
  }

  private handleDown() {
    event.on(KEY_EVENT_TYPES.KEY_DOWN, (key: KEY_NAMES) => {
      switch (KEY_NAMES[key]) {
        case CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_LEFT]: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          this.changeDirection(Vector2.left());
          if (entities[y][x - 1]?.hasAbility(ABILITY_NAMES.PASSABLE)) {
            this.walk(Vector2.left());
          }

          this._someKeysDown = true;
          break;
        }

        case CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          this.changeDirection(Vector2.right());
          if (entities[y][x + 1]?.hasAbility(ABILITY_NAMES.PASSABLE)) {
            this.walk(Vector2.right());
          }

          this._someKeysDown = true;
          break;
        }

        case CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_UP]: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          if (entities[y - 1][x]?.hasAbility(ABILITY_NAMES.PASSABLE)) {
            this.walk(Vector2.up());
          }

          this._someKeysDown = true;
          break;
        }

        case CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_DOWN]: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          if (entities[y + 1][x]?.hasAbility(ABILITY_NAMES.PASSABLE)) {
            this.walk(Vector2.down());
          }

          this._someKeysDown = true;
          break;
        }

        default:
          break;
      }
    });
  }

  private handleUp() {
    event.on(KEY_EVENT_TYPES.KEY_UP, (key: KEY_NAMES) => {
      switch (KEY_NAMES[key]) {
        case CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_LEFT]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = Date.now();
          break;
        }

        case CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = Date.now();
          break;
        }

        case CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_UP]: {
          this._someKeysDown = false;
          this._lastUpTimeStamp = Date.now();
          break;
        }

        case CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_DOWN]: {
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
