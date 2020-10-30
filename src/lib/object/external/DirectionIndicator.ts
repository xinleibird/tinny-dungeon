import * as PIXI from 'pixi.js';
import { Vector2 } from '../../geometry';
import { Loader } from '../../system';
import External, { EXTERNAL_NAMES } from './External';

export default class DirectionIndicator extends External {
  protected _direction: Vector2;
  protected _rendering: PIXI.AnimatedSprite;

  public constructor(direction: Vector2 = Vector2.down) {
    super();
    this._name = EXTERNAL_NAMES.DIRECTION_INDICATOR;
    this.initialize(direction);
  }

  public get direction() {
    return this._direction;
  }

  public set direction(direction: Vector2) {
    this._direction = direction;
    this.handleDirection(direction);
  }

  public get visiable() {
    return this._rendering.visible;
  }

  public set visiable(visiable: boolean) {
    this._rendering.visible = visiable;
  }

  private handleDirection(direction: Vector2) {
    if (direction.equals(Vector2.down)) {
      this._rendering.gotoAndStop(0);
      this._rendering.position.set(0, 18);
    }

    if (direction.equals(Vector2.up)) {
      this._rendering.gotoAndStop(1);
      this._rendering.position.set(0, 0);
    }

    if (direction.equals(Vector2.left)) {
      this._rendering.gotoAndStop(3);
      this._rendering.position.set(8, 10);
    }

    if (direction.equals(Vector2.right)) {
      this._rendering.gotoAndStop(3);
      this._rendering.position.set(8, 10);
    }
  }

  private initialize(direction: Vector2) {
    const batch = [];
    batch.push(Loader.textures.UI.arrow_down);
    batch.push(Loader.textures.UI.arrow_up);
    batch.push(Loader.textures.UI.arrow_left);
    batch.push(Loader.textures.UI.arrow_right);

    const sprite = new PIXI.AnimatedSprite(batch);
    sprite.visible = false;
    this._rendering = sprite;

    this._rendering.anchor.set(0.5, 0.5);
    this._rendering.alpha = 0.75;
    this._rendering.loop = false;

    this.handleDirection(direction);
  }
}
