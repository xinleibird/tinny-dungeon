import { NonPlayer, Player } from '.';
import {
  CONTROL_ACTIONS,
  JOYSTICK_CONTROLLED_JOYS,
  KEYBOARD_CONTROLLED_KEYS,
} from '../config';
import { StaticSystem } from '../core';
import { Vector2 } from '../geometry';
import { JOY_NAMES, KEY_NAMES } from '../input';
import { Emitter, JOY_EVENTS, KEY_EVENTS } from '../system';
import { TurnBase, TurnEvent } from '../turn/';
import {
  findEntitiesPath,
  updateEntitiesDislightings,
  updateEntitiesLightings,
} from '../utils';
import Character from './Character';

enum TURN_PHASES {
  PLAYER_TURN,
  NONPLAYER_TURN,
  HOLD_TURN,
}

export default class Turn {
  private static _instance: Turn;

  private static _manager: TurnBase = TurnBase.getInstance();

  public static getInstance() {
    if (!this._instance) {
      this._instance = new Turn();
    }
    return this._instance;
  }

  public static regist(character: Character) {
    const instance = this.getInstance();
    instance._characters.push(character);

    if (character instanceof Player) {
      const player = character as Player;
      instance._players.push(player);

      instance._playerLeader = instance._players[0];
    }

    if (character instanceof NonPlayer) {
      instance._nonPlayers.push(character);
    }

    return instance;
  }

  private _lastDownTimeStamp = 0;
  private _delay = 150;

  private _playerLeader: Player;
  private _characters: Character[] = [];
  private _players: Player[] = [];
  private _nonPlayers: NonPlayer[] = [];

  private _lock = false;

  private constructor() {
    this.handleKeyDown();

    this.handleJoyDown();
  }

  private handleKeyDown() {
    Emitter.on(KEY_EVENTS.KEY_DOWN, (key: KEY_NAMES, timeStamp: number) => {
      switch (KEY_NAMES[key]) {
        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_LEFT]: {
          this.doit(Vector2.left);

          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          this.doit(Vector2.right);

          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_UP]: {
          this.doit(Vector2.up);

          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_DOWN]: {
          this.doit(Vector2.down);

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
          await this.doit(Vector2.left);

          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          await this.doit(Vector2.right);

          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_UP]: {
          await this.doit(Vector2.up);

          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_DOWN]: {
          await this.doit(Vector2.down);

          break;
        }

        default:
          break;
      }
    });
  }

  private async doit(direction: Vector2) {
    if (Date.now() > this._lastDownTimeStamp + this._delay && !this._lock) {
      this._lock = true;
      Turn._manager.add(new TurnEvent(this._playerLeader, direction));

      this._nonPlayers.forEach((char) => {
        const dir = findEntitiesPath(
          char.geometryPosition,
          this._playerLeader.geometryPosition,
          this._playerLeader.isStay
        );

        Turn._manager.add(new TurnEvent(char, dir));
      });

      await Turn._manager.next();
      await Turn._manager.next();
      await Turn._manager.next();
      await Turn._manager.next();
      await Turn._manager.next();
      await Turn._manager.next();
      // await Turn._manager.tickAll();
      Turn._manager.clear();

      this._lastDownTimeStamp = Date.now();
      this._lock = false;
      StaticSystem.renderer.characterLayer.sortChildren();
      updateEntitiesDislightings(this._playerLeader.geometryPosition);
      updateEntitiesLightings(this._playerLeader.geometryPosition);
    }
  }
}
