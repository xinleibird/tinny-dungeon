import * as PIXI from 'pixi.js';
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
  private _tilePosition: IPosition = { x: 0, y: 0 };

  public constructor(
    x = 0,
    y = 0,
    // tilePosition: IPosition,
    tileIndex: number,
    blockLight?: boolean,
    tileSize = 32
  ) {
    this._tilePosition = { x, y };
    this._blockLight = blockLight;
    const sprite = new PIXI.Sprite(Loader.tileset[tileIndex]);
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
