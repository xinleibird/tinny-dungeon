import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { Vector2 } from '../geometry';
import { ABILITY_NAMES } from '../object/ability';
import Decorator from '../object/decorator';
import Entity, { ENTITY_TYPES } from '../object/entity';
import { generateAutotile, generateDungeon } from '../utils';
import Tile, { TILE_TYPES } from './tile';

export default class Dungeon {
  private _tilesMap: TILE_TYPES[][] = [];
  private _entitiesMap: ENTITY_TYPES[][] = [];
  private _entities: Entity[][] = [];
  private _decoratorsMap: number[][] = [];
  private _viewport: Viewport;
  private _renderPool: PIXI.Sprite[] = [];

  public constructor(tilesX = 0, tilesY = 0, viewport?: Viewport) {
    this.initialize(tilesX, tilesY, viewport);
  }

  public draw() {
    for (const sprite of this._renderPool) {
      this._viewport.addChild(sprite);
    }
  }

  public get viewport() {
    return this._viewport;
  }

  public set viewport(viewport: Viewport) {
    this._viewport = viewport;
  }

  public get entitiesMap() {
    return this._entitiesMap;
  }

  public get entities() {
    return this._entities;
  }

  public getRespawnPosition() {
    for (let y = 0; y < this._entities.length; y++) {
      for (let x = 0; x < this._entities[0].length; x++) {
        if (this._entities[y][x].hasAbility(ABILITY_NAMES.RESPAWNABLE)) {
          return new Vector2(x, y);
        }
      }
    }
  }

  private initialize(tx: number, ty: number, viewport: Viewport) {
    this._viewport = viewport;

    const { tiles, entitiesMap, decoratorsMap } = generateDungeon(tx, ty);
    this._tilesMap = tiles;
    this._entitiesMap = entitiesMap;
    this._decoratorsMap = decoratorsMap;

    this.renderTiles();
    this.renderEntities();
  }

  private renderTiles() {
    const tileArray = generateAutotile(this._tilesMap);
    const ty = this._tilesMap.length;
    const tx = this._tilesMap[0].length;

    for (let y = 0; y < ty; y++) {
      for (let x = 0; x < tx; x++) {
        if (tileArray[y][x] !== TILE_TYPES.EMPTY) {
          const tile = new Tile({ x, y }, tileArray[y][x]);
          this._renderPool.push(tile.sprite);
        }
      }
    }
  }

  private renderEntities() {
    const cy = this.entitiesMap.length;
    const cx = this.entitiesMap[0].length;

    for (let y = 0; y < cy; y++) {
      this._entities[y] = [];
      for (let x = 0; x < cx; x++) {
        const decorator = new Decorator({ x, y }, this._decoratorsMap[y][x]);

        if (decorator.sprite) {
          this._renderPool.push(decorator.sprite);
        }

        const direction =
          this._entitiesMap[y][x - 1] && this.entitiesMap[y][x + 1]
            ? Vector2.up
            : Vector2.right;

        const entity = new Entity({ x, y }, this._entitiesMap[y][x], direction);

        this._entities[y][x] = entity;
        if (entity.sprite) {
          this._renderPool.push(entity.sprite);
        }
      }
    }
  }
}
