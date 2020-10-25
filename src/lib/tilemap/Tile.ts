import * as PIXI from 'pixi.js';
import { Renderable } from '../abstraction';
import { Vector2 } from '../geometry';
import { Loader } from '../system';

export enum TILE_TYPES {
  EMPTY,
  FLOOR,
  CORRIDOR,
  DOOR,
}

export default class Tile extends Renderable {
  protected _rendering: PIXI.Sprite;

  private _tilePosition: Vector2 = new Vector2(0, 0);

  public constructor(tilePosition: Vector2, tileIndex: number, tileSize = 32) {
    super();
    if (tilePosition instanceof Vector2) {
      this._tilePosition = tilePosition;
    } else {
      const { x, y } = tilePosition;
      this._tilePosition = new Vector2(x, y);
    }

    if (tileIndex !== 0) {
      const { x, y } = this._tilePosition;

      const sprite = new PIXI.Sprite(Loader.tileset[tileIndex]);
      sprite.position.set(x * tileSize, y * tileSize);
      this._rendering = sprite;
    }
  }

  public get tilePosition() {
    return this._tilePosition;
  }

  public get rendering() {
    return this._rendering;
  }
}
