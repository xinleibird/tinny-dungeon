import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { Character, Player } from '../character';
import { Vector2 } from '../geometry';
import { ABILITY_NAMES, ABILITY_STATUS, Decorateable, Lightable } from '../object/ability';
import Entity, { ENTITY_TYPES } from '../object/entity';
import { Music, SoundEffect } from '../sound';
import Tile, { TILE_TYPES } from '../tilemap/tile';
import { generateAutoTile, generateDungeonMapToAutoTile } from '../utils';

export default class Dungeon {
  private _tilesMap: TILE_TYPES[][] = [];
  private _tilesRenderPool: PIXI.Sprite[] = [];

  private _characters: Character[] = [];
  private _respawnPosition: Vector2;
  private _clearPosition: Vector2;

  private _entities: Entity[][] = [];
  private _floorsMap: ENTITY_TYPES[][] = [];
  private _decoratorsMap: number[][] = [];

  // Entities Pools
  private _decoratorsRenderPool: PIXI.Sprite[] = [];
  private _floorsRenderPool: PIXI.Sprite[] = [];

  // Lighting
  private _lightingsRenderPool: PIXI.Sprite[] = [];

  private _viewport: Viewport;

  public constructor(tilesX = 0, tilesY = 0, viewport?: Viewport) {
    this.initialize(tilesX, tilesY, viewport);
  }

  public addCharacter(character: Character) {
    if (character instanceof Player) {
      this._characters.push(character);
      const { x, y } = this._respawnPosition;
      character.geometryPosition = new Vector2(x, y);
      this._entities[y][x].character = character;
    } else {
      this._characters.push(character);
      const { x, y } = character.geometryPosition;
      this._entities[y][x].character = character;
    }
  }

  public draw() {
    if (this._tilesRenderPool.length > 0) {
      this._viewport.addChild(...this._tilesRenderPool);
    }
    if (this._decoratorsRenderPool.length > 0) {
      this._viewport.addChild(...this._decoratorsRenderPool);
    }
    if (this._floorsRenderPool.length > 0) {
      this._viewport.addChild(...this._floorsRenderPool);
    }
    if (this._lightingsRenderPool.length > 0) {
      this._viewport.addChild(...this._lightingsRenderPool);
    }
    Music.play('main');
    SoundEffect.play('cave_airflow', 0.02, true);
  }

  public get respawnPosition() {
    return this._respawnPosition;
  }

  public get clearPosition() {
    return this._clearPosition;
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

  private getRespawnPosition() {
    for (let y = 0; y < this._entities.length; y++) {
      for (let x = 0; x < this._entities[0].length; x++) {
        if (this._entities[y][x].hasAbility(ABILITY_NAMES.RESPAWNABLE)) {
          return new Vector2(x, y);
        }
      }
    }
  }

  private getClearPosition() {
    for (let y = 0; y < this._entities.length; y++) {
      for (let x = 0; x < this._entities[0].length; x++) {
        if (this._entities[y][x].hasAbility(ABILITY_NAMES.CLEARABLE)) {
          return new Vector2(x, y);
        }
      }
    }
  }

  private initialize(tx: number, ty: number, viewport: Viewport) {
    this._viewport = viewport;

    const { tilesMap, floorsMap, decoratorsMap } = generateDungeonMapToAutoTile(tx, ty);
    this._tilesMap = tilesMap;
    this._floorsMap = floorsMap;
    this._decoratorsMap = decoratorsMap;

    this.generateTilesPool();
    this.generateEntitiesPool();
    this.generateLightingsPool();

    this._respawnPosition = this.getRespawnPosition();
    this._clearPosition = this.getClearPosition();
  }

  private generateTilesPool() {
    const tileArray = generateAutoTile(this._tilesMap);
    const ty = this._tilesMap.length;
    const tx = this._tilesMap[0].length;

    for (let y = 0; y < ty; y++) {
      for (let x = 0; x < tx; x++) {
        if (tileArray[y][x] !== TILE_TYPES.EMPTY) {
          const tile = new Tile(new Vector2(x, y), tileArray[y][x]);
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

        const entity = new Entity(new Vector2(x, y), this._floorsMap[y][x], direction);

        const decoratorIndex = this._decoratorsMap[y][x];
        if (decoratorIndex !== 0) {
          const decoratorable = new Decorateable(decoratorIndex);
          entity.addAbility(decoratorable);
        }

        this._entities[y][x] = entity;

        if (entity.floorLayer.length > 0) {
          this._floorsRenderPool.push(...entity.floorLayer);
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
          this._lightingsRenderPool.push(...entity.lightingLayer);
        }
      }
    }
  }
}
