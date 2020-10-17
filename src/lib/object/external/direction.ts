import * as PIXI from 'pixi.js';
import { Vector2 } from '../../geometry';
import { Loader } from '../../system';
import External, { EXTERNAL_NAMES } from './external';

export default class DirectionIndicator extends External {
  protected _sprite: PIXI.AnimatedSprite;
  protected _direction: Vector2;

  public constructor(direction: Vector2 = Vector2.down) {
    super();
    this._name = EXTERNAL_NAMES.DIRECTION_INDICATOR;
    this.initialize(direction);
  }

  public get sprite() {
    return this._sprite;
  }

  public get direction() {
    return this._direction;
  }

  public set direction(direction: Vector2) {
    this._direction = direction;
    this.handleDirection(direction);
  }

  private handleDirection(direction: Vector2) {
    if (direction.equals(Vector2.down)) {
      this._sprite.gotoAndStop(0);
      this._sprite.position.set(0, 18);
    }

    if (direction.equals(Vector2.up)) {
      this._sprite.gotoAndStop(1);
      this._sprite.position.set(0, 0);
    }

    if (direction.equals(Vector2.left)) {
      this._sprite.gotoAndStop(3);
      this._sprite.position.set(8, 10);
    }

    if (direction.equals(Vector2.right)) {
      this._sprite.gotoAndStop(3);
      this._sprite.position.set(8, 10);
    }
  }

  private initialize(direction: Vector2) {
    const batch = [];
    batch.push(Loader.textures.UI.arrow_down);
    batch.push(Loader.textures.UI.arrow_up);
    batch.push(Loader.textures.UI.arrow_left);
    batch.push(Loader.textures.UI.arrow_right);

    const sprite = new PIXI.AnimatedSprite(batch);
    this._sprite = sprite;

    this._sprite.anchor.set(0.5, 0.5);
    this._sprite.alpha = 0.75;
    this._sprite.loop = false;

    this.handleDirection(direction);
  }
}
