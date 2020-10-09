import * as PIXI from 'pixi.js';

import { IPosition, Vector2 } from '../geometry';
import { Loader } from '../system';

export enum TILE_TYPES {
  EMPTY,
  FLOOR,
  CORRIDOR,
  DOOR,
}

export default class Tile {
  private _sprite: PIXI.Sprite;
  private _tilePosition: Vector2 = new Vector2(0, 0);

  public constructor(tilePosition: Vector2 | IPosition, tileIndex: number, tileSize = 32) {
    if (tilePosition instanceof Vector2) {
      this._tilePosition = tilePosition;
    } else {
      const { x, y } = tilePosition;
      this._tilePosition = new Vector2(x, y);
    }

    if (tileIndex !== 0) {
      const sprite = new PIXI.Sprite(Loader.tileset[tileIndex]);
      const { x, y } = this._tilePosition;
      sprite.position.set(x * tileSize, y * tileSize);

      this._sprite = sprite;
    }
  }

  public get tilePosition() {
    return this._tilePosition;
  }

  public get sprite() {
    return this._sprite;
  }
}
