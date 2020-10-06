import { IPosition, Vector2 } from '../geometry';
import Character, { PLAYER_TYPES } from './character';

export default class Player extends Character {
  public constructor(geometryPosition: Vector2 | IPosition, type: PLAYER_TYPES) {
    super(geometryPosition, type);
  }

  public get type() {
    return this._type;
  }
}
