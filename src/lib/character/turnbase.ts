import * as PIXI from 'pixi.js';
import { NonPlayer, Player } from '../character';
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
import Character from './character';

enum TURN_PHASES {
  PLAYER_TURN,
  NONPLAYER_TURN,
  HOLD_TURN,
}

export default class TurnBase {
  private static _instance: TurnBase;

  public static getInstance() {
    if (!this._instance) {
      this._instance = new TurnBase();
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

  private _someKeysDown = false;
  private _lastUpTimeStamp = 0;
  private _holdDelay = 150;

  private _turnPhase: TURN_PHASES;

  private _playerLeader: Player;
  private _characters: Character[] = [];
  private _players: Player[] = [];
  private _nonPlayers: NonPlayer[] = [];

  private _playerTurnStack: any[] = [];
  private _nonPlayerTurnStack: any[] = [];

  private constructor() {
    this._turnPhase = TURN_PHASES.HOLD_TURN;

    this.handleKeyDown();
    this.handleKeyUp();

    this.handleJoyDown();
    this.handleJoyUp();

    this.registerTurnLoop();
  }

  private handleKeyDown() {
    event.on(KEY_EVENTS.KEY_DOWN, (key: KEY_NAMES, timeStamp: number) => {
      switch (KEY_NAMES[key]) {
        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_LEFT]: {
          this._turnPhase = TURN_PHASES.PLAYER_TURN;

          this._playerLeader.direction = Vector2.left;

          this._playerLeader.rollBehaviors(Vector2.left);
          this._someKeysDown = true;

          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          this._turnPhase = TURN_PHASES.PLAYER_TURN;
          this._playerLeader.direction = Vector2.right;

          this._playerLeader.rollBehaviors(Vector2.right);

          this._someKeysDown = true;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_UP]: {
          this._turnPhase = TURN_PHASES.PLAYER_TURN;
          this._playerLeader.direction = Vector2.up;

          this._playerLeader.rollBehaviors(Vector2.up);

          this._someKeysDown = true;
          break;
        }

        case KEYBOARD_CONTROLLED_KEYS[CONTROL_ACTIONS.WALK_DOWN]: {
          this._turnPhase = TURN_PHASES.PLAYER_TURN;
          this._playerLeader.direction = Vector2.down;

          this._playerLeader.rollBehaviors(Vector2.down);

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

        default:
          break;
      }
    });
  }

  private handleJoyDown() {
    event.on(JOY_EVENTS.JOY_DOWN, (joy: JOY_NAMES) => {
      switch (JOY_NAMES[joy]) {
        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_LEFT]: {
          this._turnPhase = TURN_PHASES.PLAYER_TURN;
          this._playerLeader.direction = Vector2.left;

          this._playerLeader.rollBehaviors(Vector2.left);

          this._someKeysDown = true;
          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_RIGHT]: {
          this._turnPhase = TURN_PHASES.PLAYER_TURN;
          this._playerLeader.direction = Vector2.right;

          this._playerLeader.rollBehaviors(Vector2.right);

          this._someKeysDown = true;
          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_UP]: {
          this._turnPhase = TURN_PHASES.PLAYER_TURN;
          this._playerLeader.direction = Vector2.up;

          this._playerLeader.rollBehaviors(Vector2.up);

          this._someKeysDown = true;
          break;
        }

        case JOYSTICK_CONTROLLED_JOYS[CONTROL_ACTIONS.WALK_DOWN]: {
          this._turnPhase = TURN_PHASES.PLAYER_TURN;
          this._playerLeader.direction = Vector2.down;

          this._playerLeader.rollBehaviors(Vector2.down);

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

  private registerTurnLoop() {
    PIXI.Ticker.shared.add(() => {
      if (!this._someKeysDown && Date.now() > this._lastUpTimeStamp + this._holdDelay) {
        this._turnPhase = TURN_PHASES.NONPLAYER_TURN;
      }

      if (this._turnPhase === TURN_PHASES.NONPLAYER_TURN) {
        this._turnPhase = TURN_PHASES.HOLD_TURN;
      }

      if (this._turnPhase === TURN_PHASES.HOLD_TURN) {
        this._characters.forEach((character) => {
          character.hold();
        });
      }
    });
  }
}
