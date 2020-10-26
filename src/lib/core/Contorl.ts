import { Character, NonPlayer, Player } from '../character';
import {
  CONTROL_ACTIONS,
  JOYSTICK_CONTROLLED_JOYS,
  KEYBOARD_CONTROLLED_KEYS,
} from '../config';
import { StaticSystem } from '../core';
import { Vector2 } from '../geometry';
import { JOY_NAMES, KEY_NAMES } from '../input';
import { Trace } from '../object/strategy';
import { Emitter, JOY_EVENTS, KEY_EVENTS } from '../system';
import { TurnBase, TurnEvent } from '../turn/';
import { updateEntitiesDislightings, updateEntitiesLightings } from '../utils';

export default class Control {
  private static _instance: Control;
  private static _turnBase: TurnBase = TurnBase.getInstance();

  public static getInstance() {
    if (!this._instance) {
      this._instance = new Control();
    }
    return this._instance;
  }

  public static regist(character: Character) {
    const instance = this.getInstance();
    instance._characters.push(character);

    if (character instanceof Player) {
      const player = character as Player;

      instance._player = player;
    }

    if (character instanceof NonPlayer) {
      instance._nonPlayers.push(character);
    }

    return instance;
  }

  public get turnBase() {
    return Control._turnBase;
  }

  private _lastDownTimeStamp = 0;
  private _delay = 150;

  private _characters: Character[] = [];

  private _player: Player;
  private _nonPlayers: NonPlayer[] = [];

  private _lock = false;

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

        default:
          break;
      }
    });
  }

  private async processTurn(direction: Vector2) {
    if (Date.now() > this._lastDownTimeStamp + this._delay && !this._lock) {
      if (!this._player.canBehave(direction)) {
        return;
      }

      this._lock = true;

      Control._turnBase.add(new TurnEvent(this._player, direction));

      this._nonPlayers.forEach((char) => {
        char.strategy = new Trace(char, this._player);
        char.decide();
      });

      await Control._turnBase.tickTurnAll();

      Control._turnBase.clear();

      this._lastDownTimeStamp = Date.now();
      this._lock = false;

      StaticSystem.renderer.characterLayer.sortChildren();

      updateEntitiesDislightings(this._player.geometryPosition);
      updateEntitiesLightings(this._player.geometryPosition);
    }
  }
}
