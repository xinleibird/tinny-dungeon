import CharacterGroup from '../character/group';
import StaticSystem from '../core/static';
import { Vector2 } from '../geometry';
import { ABILITY_NAMES, ABILITY_STATUS, Decorateable, Lightable } from '../object/ability';
import Entity, { ENTITY_TYPES } from '../object/entity';
import EntityGroup from '../object/group';
import Tile, { TILE_TYPES } from '../tilemap/tile';
import { generateAutoTile, generateDungeonMapToAutoTile } from '../utils';
import Scene from './scene';

export default class Dungeon extends Scene {
  private static _dungeon: Dungeon;

  private _tilesMap: TILE_TYPES[][] = [];
  private _floorsMap: ENTITY_TYPES[][] = [];
  private _decoratorsMap: number[][] = [];

  public constructor(tilesX = 0, tilesY = 0) {
    super();
    this.initialize(tilesX, tilesY);
  }

  private getRespawnPosition() {
    const entityGroup = StaticSystem.entityGroup;
    for (let y = 0; y < entityGroup.height; y++) {
      for (let x = 0; x < entityGroup.width; x++) {
        if (entityGroup.getEntity(x, y).hasAbility(ABILITY_NAMES.RESPAWNABLE)) {
          return new Vector2(x, y);
        }
      }
    }
  }

  private getClearPosition() {
    const entityGroup = StaticSystem.entityGroup;
    for (let y = 0; y < entityGroup.height; y++) {
      for (let x = 0; x < entityGroup.width; x++) {
        if (entityGroup.getEntity(x, y).hasAbility(ABILITY_NAMES.CLEARABLE)) {
          return new Vector2(x, y);
        }
      }
    }
  }

  private initialize(tx: number, ty: number) {
    const { tilesMap, floorsMap, decoratorsMap } = generateDungeonMapToAutoTile(tx, ty);
    this._tilesMap = tilesMap;
    this._floorsMap = floorsMap;
    this._decoratorsMap = decoratorsMap;
    this._characterGroup = new CharacterGroup(tx, ty);

    this.fillTileLayer();
    this.fillEntityLayer();
    this.fillLightingLayer();

    this._playerRespawnPosition = this.getRespawnPosition();
    this._sceneClearPosition = this.getClearPosition();
  }

  private fillTileLayer() {
    const tileArray = generateAutoTile(this._tilesMap);
    const ty = this._tilesMap.length;
    const tx = this._tilesMap[0].length;

    for (let y = 0; y < ty; y++) {
      for (let x = 0; x < tx; x++) {
        if (tileArray[y][x] !== TILE_TYPES.EMPTY) {
          const tile = new Tile(new Vector2(x, y), tileArray[y][x]);
          StaticSystem.renderer.add(tile);
        }
      }
    }
  }

  private fillEntityLayer() {
    const fy = this._floorsMap.length;
    const fx = this._floorsMap[0].length;
    const entityGroup = new EntityGroup(fx, fy);

    entityGroup.forLoop((x: number, y: number) => {
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
        const decoratorable = new Decorateable(new Vector2(x, y), decoratorIndex);
        entity.addAbility(decoratorable);
      }

      entityGroup.setEntity(x, y, entity);
    });
  }

  private fillLightingLayer() {
    const entityGroup = StaticSystem.entityGroup;
    entityGroup.forLoop((x: number, y: number) => {
      const entity = entityGroup.getEntity(x, y);
      if (entity.getAbility(ABILITY_NAMES.PASSABLE)) {
        const lightable = new Lightable(new Vector2(x, y), ABILITY_STATUS.UNVISIT);
        entity.addAbility(lightable);
        entityGroup.setEntity(x, y, entity);
      }
    });
  }
}
