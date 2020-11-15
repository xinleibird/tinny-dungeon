import * as ROT from 'rot-js';
import { StaticSystem } from '../core';
import { Entity, EntityGroup, ENTITY_TYPES } from '../entity';
import { Vector2 } from '../geometry';
import {
  ABILITY_NAMES,
  ABILITY_STATUS,
  Brokeable,
  BROKEABLE_TYPES,
  Decorateable,
  Lightable,
  Passable,
} from '../object/ability';
import { Tile, TILE_TYPES } from '../tilemap';
import { generateAutoTile, generateDungeonMapToAutoTile } from '../utils';
import Scene from './Scene';

export default class Dungeon extends Scene {
  private _tilesMap: TILE_TYPES[][] = [];
  private _floorsMap: ENTITY_TYPES[][] = [];
  private _decoratorsMap: number[][] = [];

  public constructor(tilesX = 0, tilesY = 0) {
    super(tilesX, tilesY);
    this.initialize(tilesX, tilesY);
  }

  private getRespawnPosition() {
    let pos = Vector2.center;
    const entityGroup = this._entityGroup;
    entityGroup.forLoop((x, y) => {
      if (entityGroup.getEntity(x, y).hasAbility(ABILITY_NAMES.RESPAWNABLE)) {
        pos = new Vector2(x, y);
      }
    });

    return pos;
  }

  private getClearPosition() {
    let pos = Vector2.center;
    const entityGroup = this._entityGroup;
    entityGroup.forLoop((x, y) => {
      if (entityGroup.getEntity(x, y).hasAbility(ABILITY_NAMES.CLEARABLE)) {
        pos = new Vector2(x, y);
      }
    });

    return pos;
  }

  private initialize(tx: number, ty: number) {
    const { tilesMap, floorsMap, decoratorsMap } = generateDungeonMapToAutoTile(tx, ty);
    this._tilesMap = tilesMap;
    this._floorsMap = floorsMap;
    this._decoratorsMap = decoratorsMap;

    this.fillTiles();
    this.fillEntities();
    this.fillLightings();
    this.fillAttachments();

    this._respawnPosition = this.getRespawnPosition();
    this._clearPosition = this.getClearPosition();
  }

  private fillTiles() {
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

  private fillEntities() {
    const fy = this._floorsMap.length;
    const fx = this._floorsMap[0].length;
    const entityGroup = new EntityGroup(fx, fy);
    this._entityGroup = entityGroup;

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

        if (this._floorsMap?.[y]?.[x - 1] || this._floorsMap?.[y]?.[x + 1]) {
          direction = Vector2.center;
        }
      }

      const entity = new Entity(new Vector2(x, y), this._floorsMap[y][x], direction);

      const decoratorIndex = this._decoratorsMap[y][x];
      if (decoratorIndex !== 0) {
        const decoratorable = new Decorateable(entity, decoratorIndex);
        entity.addAbility(decoratorable);
      }

      entityGroup.setEntity(x, y, entity);
    });
  }

  private fillAttachments() {
    const entityGroup = this._entityGroup;
    const entities = [];

    entityGroup.loop((entity) => {
      if (entity.hasAbility(ABILITY_NAMES.PASSABLE)) {
        const { x, y } = entity.geometryPosition;

        if (
          entity.hasAbility(ABILITY_NAMES.PASSABLE) &&
          !entity.hasAbility(ABILITY_NAMES.OPENABLE) &&
          !entity.hasAbility(ABILITY_NAMES.CLEARABLE) &&
          !entity.hasAbility(ABILITY_NAMES.RESPAWNABLE)
        ) {
          const passable = entity.getAbility(ABILITY_NAMES.PASSABLE) as Passable;
          if (
            passable.status === ABILITY_STATUS.PASS &&
            passable.type === ENTITY_TYPES.FLOOR
          ) {
            const upper = this._floorsMap?.[y - 1]?.[x];

            if (upper !== ENTITY_TYPES.DOWNSTAIR && upper !== ENTITY_TYPES.UPSTAIR) {
              entities.push(entity);
            }
          }
        }
      }
    });

    const num = ~~((entityGroup.width * entityGroup.height) / 100);

    for (let i = 0; i < num; i++) {
      const entity: Entity = ROT.RNG.getItem(entities);
      const index = entities.indexOf(entity);
      entities.splice(index, 1);

      const type = ROT.RNG.getItem([
        BROKEABLE_TYPES.POT,
        BROKEABLE_TYPES.CONTAINER,
        BROKEABLE_TYPES.BARREL,
      ]);
      entity?.addAbility(new Brokeable(entity, type));
    }
  }

  private fillLightings() {
    const entityGroup = this._entityGroup;
    entityGroup.forLoop((x: number, y: number) => {
      const entity = entityGroup.getEntity(x, y);
      if (entity.getAbility(ABILITY_NAMES.PASSABLE)) {
        const lightable = new Lightable(entity, ABILITY_STATUS.UNVISIT);
        entity.addAbility(lightable);
        entityGroup.setEntity(x, y, entity);
      }
    });
  }
}
