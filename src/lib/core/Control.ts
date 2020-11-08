import { Character, NonPlayer, Player } from '../character';
import {
  CONTROL_ACTIONS,
  JOYSTICK_CONTROLLED_JOYS,
  KEYBOARD_CONTROLLED_KEYS,
} from '../config';
import { StaticSystem } from '../core';
import { Vector2 } from '../geometry';
import { JOY_NAMES, KEY_NAMES } from '../input';
import { EXTERNAL_NAMES } from '../object/external/External';
import { Disable, Trace } from '../object/strategy';
import { Emitter, GAME_EVENTS, JOY_EVENTS, KEY_EVENTS } from '../system';
import { TurnBase, TurnEvent } from '../turn/';
import { updateEntitiesDislightings, updateEntitiesLightings } from '../utils';

export default class Control {
  private static _instance: Control;

  public static getInstance() {
    if (!this._instance) {
      this._instance = new Control();
    }
    return this._instance;
  }

  public static regist(character: Character) {
    const instance = this.getInstance();

    if (character instanceof Player) {
      const player = character as Player;

      instance._player = player;
    }

    if (character instanceof NonPlayer) {
      instance._nonPlayers.push(character);
    }

    return instance;
  }

  public static get turnBase() {
    const instance = this.getInstance();
    return instance._turnBase;
  }

  public static trash() {
    const instance = this.getInstance();
    instance._player = null;
    instance._nonPlayers = [];
  }

  public get turnBase() {
    return this._turnBase;
  }

  private _lastDownTimeStamp = 0;
  private _delay = 150;

  private _player: Player;
  private _nonPlayers: NonPlayer[] = [];

  private _lock = false;
  private _showUI = false;

  private _turnBase: TurnBase = TurnBase.getInstance();

  private constructor() {
    this.handleKeyDown();
    this.handleJoyDown();
  }

  private handleKeyDown() {
    Emitter.on(KEY_EVENTS.KEY_DOWN, (key: KEY_NAMES) => {
      switch (KEY_NAMES[key]) {
        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_LEFT]: {
          this.processTurn(Vector2.left);

          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          this.processTurn(Vector2.right);

          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_UP]: {
          this.processTurn(Vector2.up);

          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_DOWN]: {
          this.processTurn(Vector2.down);

          break;
        }

        default:
          break;
      }
    });
  }

  private handleJoyDown() {
    Emitter.on(JOY_EVENTS.JOY_DOWN, async (joy: JOY_NAMES) => {
      switch (JOY_NAMES[joy]) {
        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_LEFT]: {
          await this.processTurn(Vector2.left);

          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          await this.processTurn(Vector2.right);

          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_UP]: {
          await this.processTurn(Vector2.up);

          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_DOWN]: {
          await this.processTurn(Vector2.down);

          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.CONFIRM]: {
          if (!this._showUI) {
            this._player.showExternal(EXTERNAL_NAMES.DIRECTION_INDICATOR);
            this._showUI = true;
          } else {
            this._player.hideExternal(EXTERNAL_NAMES.DIRECTION_INDICATOR);
            this._showUI = false;
          }

          break;
        }

        default:
          break;
      }
    });
  }

  private async processTurn(direction: Vector2, count?: number) {
    if (Emitter.phase === GAME_EVENTS.SCENE_RUNNING) {
      if (Date.now() > this._lastDownTimeStamp + this._delay && !this._lock) {
        if (!this?._player?.canBehave(direction)) {
          return;
        }

        if (this._player.alive) {
          this._lock = true;
          this.turnBase.add(new TurnEvent(this._player, direction));

          this._nonPlayers.forEach((non) => {
            if (!non.alive) {
              non.strategy = new Disable(non);
            } else {
              non.strategy = new Trace(non, this._player);
            }

            non.decide();
          });

          await this.turnBase.tickTurnAll();

          this.turnBase.clear();

          this._lastDownTimeStamp = Date.now();
          this._lock = false;

          StaticSystem.renderer.characterLayer.sortChildren();

          updateEntitiesDislightings(this._player.geometryPosition);
          updateEntitiesLightings(this._player.geometryPosition);
        } else {
          this.turnBase.clear();
          Emitter.emit(GAME_EVENTS.GAME_OVER);
        }
      }
    }
  }
}
