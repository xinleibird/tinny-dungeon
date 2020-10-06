import * as PIXI from 'pixi.js';

import { Vector2 } from '../geometry';
import { ABILITY_NAMES } from '../objects/ability';
import Entity, { ENTITY_TYPES } from '../objects/entity';
import { generateAutotile, generateDungeon } from '../utils';
import Tile, { TILE_TYPES } from './tile';

export default class Dungeon extends PIXI.Container {
  private _tilesMap: TILE_TYPES[][] = [];
  private _entitiesMap: ENTITY_TYPES[][] = [];
  private _entities: Entity[][] = [];

  public constructor(tilesX = 0, tilesY = 0, randomSeed?: number) {
    super();
    this.initialize(tilesX, tilesY);
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

  private renderTiles() {
    const tileArray = generateAutotile(this._tilesMap);
    const ty = this._tilesMap.length;
    const tx = this._tilesMap[0].length;

    for (let y = 0; y < ty; y++) {
      for (let x = 0; x < tx; x++) {
        if (tileArray[y][x] === TILE_TYPES.EMPTY) {
          const tile = new Tile({ x, y }, tileArray[y][x], true);
          this.addChild(tile.sprite);
        } else {
          const tile = new Tile({ x, y }, tileArray[y][x]);
          this.addChild(tile.sprite);
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
        const direction = this._entitiesMap[y][x - 1] ? Vector2.up() : Vector2.right();
        const entity = new Entity(x, y, this._entitiesMap[y][x], direction);

        this._entities[y][x] = entity;
        this.addChild(entity);

        if (entity.hasAbility(ABILITY_NAMES.OPENABLE)) {
          const door = entity.getAbility(ABILITY_NAMES.OPENABLE);
          door.status = 'open';
        }
      }
    }
  }

  private initialize(tx: number, ty: number) {
    const { tiles, entitiesMap } = generateDungeon(tx, ty);
    this._tilesMap = tiles;
    this._entitiesMap = entitiesMap;
    this.renderTiles();
    this.renderEntities();
  }
}
