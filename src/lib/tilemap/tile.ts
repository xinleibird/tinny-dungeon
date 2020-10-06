import * as PIXI from 'pixi.js';

import { Vector2 } from '../geometry';
import { Loader } from '../system';
import Dungeon from './dungeon';

export enum TILE_TYPES {
  EMPTY,
  FLOOR,
  CORRIDOR,
  DOOR,
}

interface IPosition {
  x: number;
  y: number;
}

export default class Tile {
  private _sprite: PIXI.Sprite;
  private _blockLight = false;
  private _reside: Dungeon;
  private _lightLevel = 0;
  private _renderLightLevel = 0;
  private _discovered = false;
  private _tilePosition: Vector2 = new Vector2(0, 0);

  public constructor(
    // x = 0,
    // y = 0,
    tilePosition: Vector2 | IPosition,
    tileIndex: number,
    blockLight?: boolean,
    tileSize = 32
  ) {
    if (tilePosition instanceof Vector2) {
      this._tilePosition = tilePosition;
    } else {
      const { x, y } = tilePosition;
      this._tilePosition = new Vector2(x, y);
    }

    this._blockLight = blockLight;
    const sprite = new PIXI.Sprite(Loader.tileset[tileIndex]);
    const { x, y } = this._tilePosition;
    sprite.position.set(x * tileSize, y * tileSize);

    this._sprite = sprite;
  }

  public get tilePosition() {
    return this._tilePosition;
  }

  public get sprite() {
    return this._sprite;
  }

  public get isBlockLight() {
    return this._blockLight;
  }
}
