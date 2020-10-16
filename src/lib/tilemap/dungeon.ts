import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { Vector2 } from '../geometry';
import {
  ABILITY_NAMES,
  ABILITY_STATUS,
  Decorateable,
  Lightable,
  LIGHT_TYPES,
} from '../object/ability';
import Entity, { ENTITY_TYPES } from '../object/entity';
import { generateAutotile, generateDungeon } from '../utils';
import Tile, { TILE_TYPES } from './tile';

export default class Dungeon {
  private _tilesMap: TILE_TYPES[][] = [];
  private _tilesRenderPool: PIXI.Sprite[] = [];

  private _entities: Entity[][] = [];

  private _floorsMap: ENTITY_TYPES[][] = [];
  private _decoratorsMap: number[][] = [];
  private _lightingsMap: LIGHT_TYPES[][] = [];

  // Entities Pools
  private _decoratorsRenderPool: PIXI.Sprite[] = [];
  private _floorRenderPool: PIXI.Sprite[] = [];

  // Lighting
  private _lightingRenderPool: PIXI.Sprite[] = [];

  private _viewport: Viewport;

  public constructor(tilesX = 0, tilesY = 0, viewport?: Viewport) {
    this.initialize(tilesX, tilesY, viewport);
  }

  public draw() {
    if (this._tilesRenderPool.length > 0) {
      this._viewport.addChild(...this._tilesRenderPool);
    }
    if (this._decoratorsRenderPool.length > 0) {
      this._viewport.addChild(...this._decoratorsRenderPool);
    }
    if (this._floorRenderPool.length > 0) {
      this._viewport.addChild(...this._floorRenderPool);
    }
    if (this._lightingRenderPool.length > 0) {
      this._viewport.addChild(...this._lightingRenderPool);
    }
  }

  public get viewport() {
    return this._viewport;
  }

  public set viewport(viewport: Viewport) {
    this._viewport = viewport;
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

    const { tilesMap, floorsMap, decoratorsMap } = generateDungeon(tx, ty);
    this._tilesMap = tilesMap;
    this._floorsMap = floorsMap;
    this._decoratorsMap = decoratorsMap;

    this.generateTilesPool();
    this.generateEntitiesPool();
    this.generateLightingsPool();
  }

  private generateTilesPool() {
    const tileArray = generateAutotile(this._tilesMap);
    const ty = this._tilesMap.length;
    const tx = this._tilesMap[0].length;

    for (let y = 0; y < ty; y++) {
      for (let x = 0; x < tx; x++) {
        if (tileArray[y][x] !== TILE_TYPES.EMPTY) {
          const tile = new Tile({ x, y }, tileArray[y][x]);
          this._tilesRenderPool.push(tile.sprite);
        }
      }
    }
  }

  private generateEntitiesPool() {
    const fy = this._floorsMap.length;
    const fx = this._floorsMap[0].length;

    for (let y = 0; y < fy; y++) {
      this._entities[y] = [];
      for (let x = 0; x < fx; x++) {
        let direction = Vector2.center;

        if (this._floorsMap?.[y]?.[x - 1] && this._floorsMap?.[y]?.[x + 1]) {
          direction = Vector2.right;

          if (this._floorsMap?.[y - 1]?.[x] || this._floorsMap?.[y + 1]?.[x]) {
            direction = Vector2.center;
          }
        }

        if (this._floorsMap?.[y - 1]?.[x] && this._floorsMap?.[y + 1]?.[x]) {
          direction = Vector2.up;

          if (this._floorsMap?.[y]?.[x - 1] && this._floorsMap?.[y]?.[x + 1]) {
            direction = Vector2.center;
          }
        }

        const entity = new Entity({ x, y }, this._floorsMap[y][x], direction);

        const decoratorIndex = this._decoratorsMap[y][x];
        if (decoratorIndex !== 0) {
          const decoratorable = new Decorateable(decoratorIndex);
          entity.addAbility(decoratorable);
        }

        this._entities[y][x] = entity;

        if (entity.floorLayer.length > 0) {
          this._floorRenderPool.push(...entity.floorLayer);
        }

        if (entity.decoratorLayer.length > 0) {
          this._decoratorsRenderPool.push(...entity.decoratorLayer);
        }
      }
    }
  }

  private generateLightingsPool() {
    const ey = this._entities.length;
    const ex = this._entities[0].length;
    for (let y = 0; y < ey; y++) {
      for (let x = 0; x < ex; x++) {
        const entity = this._entities[y][x];
        if (entity.getAbility(ABILITY_NAMES.PASSABLE)) {
          const lightable = new Lightable(ABILITY_STATUS.UNVISIT);
          entity.addAbility(lightable);
          this._lightingRenderPool.push(...entity.lightingLayer);
        }
      }
    }
  }
}
