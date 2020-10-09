import * as PIXI from 'pixi.js';

import { IPosition, Vector2 } from '../geometry';
import { Loader } from '../system';

export default class Entity {
  private _geometryPosition: Vector2;
  private _sprite: PIXI.Sprite;

  public constructor(
    geometryPosition: Vector2 | IPosition,
    decoratorIndex: number,
    tileSize = 16,
    tileOffsetX = 24,
    tileOffsetY = 32
  ) {
    if (geometryPosition instanceof Vector2) {
      this._geometryPosition = geometryPosition;
    } else {
      const { x, y } = geometryPosition;
      this._geometryPosition = new Vector2(x, y);
    }

    if (decoratorIndex !== 0) {
      const sprite = new PIXI.Sprite(Loader.textures.FLOOR_DECORATORS[decoratorIndex]);
      const { x, y } = this._geometryPosition;
      sprite.position.set(x * tileSize + tileOffsetX, y * tileSize + tileOffsetY);

      sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;

      this._sprite = sprite;
    }
  }

  public get geometryPosition() {
    return this._geometryPosition;
  }

  public set geometryPosition(vector: Vector2) {
    this._geometryPosition = vector;
  }

  public get sprite() {
    return this._sprite;
  }
}
