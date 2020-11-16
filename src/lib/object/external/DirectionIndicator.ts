import * as PIXI from 'pixi.js';
import { Character } from '../../character';
import { StaticSystem } from '../../core';
import { Vector2 } from '../../geometry';
import { Loader } from '../../system';
import External, { EXTERNAL_NAMES } from './External';

export default class DirectionIndicator extends External {
  protected _direction: Vector2;
  protected _rendering: PIXI.Container;

  public constructor(character: Character) {
    super(character);
    this._name = EXTERNAL_NAMES.DIRECTION_INDICATOR;
    this.initialize(character.direction);

    StaticSystem.renderer.add(this);
    PIXI.Ticker.shared.add(() => {
      this._rendering.position = this._owner.rendering.position;
    });
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
    const [left, right, up, down] = this._rendering.children;

    if (direction.equals(Vector2.left)) {
      left.visible = true;
      right.visible = false;
      up.visible = false;
      down.visible = false;
    }

    if (direction.equals(Vector2.right)) {
      left.visible = false;
      right.visible = true;
      up.visible = false;
      down.visible = false;
    }

    if (direction.equals(Vector2.up)) {
      left.visible = false;
      right.visible = false;
      up.visible = true;
      down.visible = false;
    }

    if (direction.equals(Vector2.down)) {
      left.visible = false;
      right.visible = false;
      up.visible = false;
      down.visible = true;
    }
  }

  private initialize(direction: Vector2) {
    const left = new PIXI.Sprite(Loader.textures.UI.arrow_left);
    const right = new PIXI.Sprite(Loader.textures.UI.arrow_right);
    const up = new PIXI.Sprite(Loader.textures.UI.arrow_up);
    const down = new PIXI.Sprite(Loader.textures.UI.arrow_down);

    left.visible = false;
    right.visible = false;
    up.visible = false;
    down.visible = false;

    left.anchor.set(1, 0);
    right.anchor.set(0, 0);
    up.anchor.set(0.5, 0.5);
    down.anchor.set(0.5, -0.5);

    this._rendering = new PIXI.Container();
    this._rendering.addChild(left, right, up, down);
    this._rendering.visible = false;
    this._rendering.alpha = 0.75;

    this.handleDirection(direction);
  }
}
