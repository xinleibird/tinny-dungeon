import { IPosition, Vector2 } from '../geometry';
import { event, KEY_EVENT_TYPES, KEY_NAMES } from '../input';
import { ABILITY_NAMES } from '../objects/ability';
import Entity from '../objects/entity';
import Character, { PLAYER_TYPES } from './character';

export default class Player extends Character {
  public constructor(geometryPosition: Vector2 | IPosition, type: PLAYER_TYPES) {
    super(geometryPosition, type);
    this.withControl();
  }

  public get type() {
    return this._type;
  }

  private withControl() {
    event.on(KEY_EVENT_TYPES.KEY_DOWN, (key: KEY_NAMES) => {
      switch (key) {
        case KEY_NAMES.a: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          this.redirection(Vector2.left());
          if (entities[y][x - 1]?.hasAbility(ABILITY_NAMES.PASSABLE)) {
            this.walk(Vector2.left());
          }
          break;
        }

        case KEY_NAMES.d: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          this.redirection(Vector2.right());
          if (entities[y][x + 1]?.hasAbility(ABILITY_NAMES.PASSABLE)) {
            this.walk(Vector2.right());
          }
          break;
        }

        case KEY_NAMES.w: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          if (entities[y - 1][x]?.hasAbility(ABILITY_NAMES.PASSABLE)) {
            this.walk(Vector2.up());
          }
          break;
        }
        case KEY_NAMES.s: {
          const { x, y } = this.geometryPosition;
          const entities = this.entities;

          if (entities[y + 1][x]?.hasAbility(ABILITY_NAMES.PASSABLE)) {
            this.walk(Vector2.down());
          }
          break;
        }

        default:
          break;
      }
    });

    event.on(KEY_EVENT_TYPES.KEY_UP, (key: KEY_NAMES) => {
      // console.log(key);
    });
  }
}
