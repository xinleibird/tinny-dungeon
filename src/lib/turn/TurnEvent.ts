import { Character } from '../character';
import { Vector2 } from '../geometry';

export default class TurnEvent {
  private _occured: Character;
  private _direction: Vector2;
  private _life: number;
  private _time: number;

  public constructor(occured: Character, direction: Vector2, time = 0, life = 1) {
    this._occured = occured;
    this._direction = direction;
    this._time = time;
    this._life = life;
  }

  public async occur() {
    await this._occured.rollBehaviors(this._direction);
  }

  public get occurd() {
    return this._occured;
  }

  public get life() {
    return this._life;
  }

  public set life(life: number) {
    this._life = life;
  }

  public get time() {
    return this._time;
  }

  public set time(time: number) {
    this._time = time;
  }
}
