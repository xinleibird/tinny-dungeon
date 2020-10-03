import * as PIXI from 'pixi.js';
import * as ROT from 'rot-js';
import { Vector2 } from '../geometry';
import Entity, { ENTITY_TYPES } from '../objects/entity';
import { generateAutotile, initialize2DArray, generateDungeon } from '../utils';
import Tile, { TILE_TYPES } from './tile';

export default class Dungeon extends PIXI.Container {
  private _tiles: TILE_TYPES[][] = [];
  private _entities: ENTITY_TYPES[][] = [];

  public constructor(tilesX = 0, tilesY = 0, randomSeed?: number) {
    super();
    this.initialize(tilesX, tilesY);
  }

  public get entities() {
    return this._entities;
  }

  private renderTiles() {
    const tileArray = generateAutotile(this._tiles);
    const ty = this._tiles.length;
    const tx = this._tiles[0].length;

    for (let y = 0; y < ty; y++) {
      for (let x = 0; x < tx; x++) {
        if (tileArray[y][x] === TILE_TYPES.EMPTY) {
          const tile = new Tile(x, y, tileArray[y][x], true);
          this.addChild(tile.sprite);
        } else {
          const tile = new Tile(x, y, tileArray[y][x]);
          this.addChild(tile.sprite);
        }
      }
    }
  }

  private renderEntities() {
    const cy = this.entities.length;
    const cx = this.entities[0].length;

    for (let y = 0; y < cy; y++) {
      for (let x = 0; x < cx; x++) {
        const direction = this._entities[y][x - 1] ? Vector2.up() : Vector2.right();
        const entity = new Entity(x, y, this._entities[y][x], direction);

        this.addChild(entity);

        entity.abilities[0]?.status && (entity.abilities[0].status = 'open');
      }
    }
  }

  private initialize(tx: number, ty: number) {
    const { tiles, entities } = generateDungeon(tx, ty);
    this._tiles = tiles;
    this._entities = entities;
    this.renderTiles();
    this.renderEntities();
  }
}
