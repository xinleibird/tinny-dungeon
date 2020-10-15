import * as ROT from 'rot-js';
import { IPosition, Vector2 } from '../geometry';
import { ABILITY_NAMES, ABILITY_STATUS } from '../object/ability';
import { DecoratorTypesWeight } from '../object/ability/decorateable';
import Entity, { ENTITY_TYPES } from '../object/entity';
import { TILE_TYPES } from '../tilemap/tile';
import { initialize2DArray } from './array';

const fillTilesMap = (
  tilesMap: TILE_TYPES[][],
  top: number,
  bottom: number,
  left: number,
  right: number,
  tile: TILE_TYPES = TILE_TYPES.EMPTY
) => {
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      tilesMap[y][x] = tile;
    }
  }
};

const fillFloorsMap = (
  entities: ENTITY_TYPES[][],
  top: number,
  bottom: number,
  left: number,
  right: number,
  entity: ENTITY_TYPES = ENTITY_TYPES.EMPTY
) => {
  if (entity === ENTITY_TYPES.CORRIDOR || entity === ENTITY_TYPES.DOOR) {
    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        entities[y][x] = entity;

        const ppy = entities?.[y - 2]?.[x];
        if (ppy) {
          entities[y - 1][x] = ENTITY_TYPES.CORRIDOR;
        }

        const nny = entities?.[y + 2]?.[x];
        if (nny) {
          entities[y + 1][x] = ENTITY_TYPES.CORRIDOR;
        }

        const ppx = entities?.[y]?.[x - 2];
        if (ppx) {
          entities[y][x - 1] = ENTITY_TYPES.CORRIDOR;
        }

        const nnx = entities?.[y]?.[x + 2];
        if (nnx) {
          entities[y][x + 1] = ENTITY_TYPES.CORRIDOR;
        }
      }
    }
  } else {
    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        entities[y][x] = entity;
      }
    }
  }
};

const fillDecoratorsMap = (decoratorsMap: number[][], entitiesMap: number[][]) => {
  for (let y = 0; y < entitiesMap.length; y++) {
    for (let x = 0; x < entitiesMap[0].length; x++) {
      const currentMap = entitiesMap[y][x];
      if (currentMap !== ENTITY_TYPES.EMPTY) {
        const str = ROT.RNG.getWeightedValue(DecoratorTypesWeight);
        decoratorsMap[y][x] = parseInt(str, 10);
      }
    }
  }
};

const normalize = (top: number, bottom: number, left: number, right: number) => {
  let swapX1 = left;
  let swapX2 = right;
  let swapY1 = top;
  let swapY2 = bottom;

  if (left > right) {
    swapX1 = right;
    swapX2 = left;
  }

  if (top > bottom) {
    swapY1 = bottom;
    swapY2 = top;
  }

  return { top: swapY1, bottom: swapY2, left: swapX1, right: swapX2 };
};

// eslint-disable-next-line complexity
export const generateDungeon = (dungeonW: number, dungeonH: number) => {
  const tilesW = ~~(dungeonW / 2) + 1;
  const tilesH = ~~(dungeonH / 2) + 1;

  const tilesMap = initialize2DArray(tilesW, tilesH, TILE_TYPES.EMPTY);
  const floorsMap = initialize2DArray(dungeonW, dungeonH, ENTITY_TYPES.EMPTY);
  const decoratorsMap = initialize2DArray(dungeonW, dungeonH, 0);

  const dungeon = new ROT.Map.Digger(tilesW, tilesH, {
    roomHeight: [2, 6],
    roomWidth: [2, 6],
    dugPercentage: 0.618,
    corridorLength: [1, 2],
    timeLimit: 2000,
  }).create();

  const rooms = dungeon.getRooms();

  rooms.forEach((room) => {
    const roomLeft = room.getLeft();
    const roomRight = room.getRight();
    const roomTop = room.getTop();
    const roomBottom = room.getBottom();

    fillTilesMap(tilesMap, roomTop, roomBottom, roomLeft, roomRight, TILE_TYPES.FLOOR);

    fillFloorsMap(
      floorsMap,
      roomTop * 2 - 1,
      roomBottom * 2 - 1,
      roomLeft * 2 - 1,
      roomRight * 2 - 1,
      ENTITY_TYPES.FLOOR
    );

    room.getDoors((x, y) => {
      fillTilesMap(tilesMap, y, y, x, x, TILE_TYPES.DOOR);

      fillFloorsMap(floorsMap, 2 * y - 1, 2 * y - 1, 2 * x - 1, 2 * x - 1, ENTITY_TYPES.DOOR);
    });
  });

  const corridors = dungeon.getCorridors();
  corridors.forEach((corridor) => {
    const { _startX, _startY, _endX, _endY } = corridor;
    const { top, bottom, left, right } = normalize(_startY, _endY, _startX, _endX);

    fillTilesMap(tilesMap, top, bottom, left, right, TILE_TYPES.CORRIDOR);

    fillFloorsMap(
      floorsMap,
      top * 2 - 1,
      bottom * 2 - 1,
      left * 2 - 1,
      right * 2 - 1,
      ENTITY_TYPES.CORRIDOR
    );
  });

  fillDecoratorsMap(decoratorsMap, floorsMap);

  const canRespawn = [];
  for (let y = 0; y < floorsMap.length; y++) {
    for (let x = 0; x < floorsMap[0].length; x++) {
      if (
        (floorsMap[y][x] === ENTITY_TYPES.FLOOR ||
          floorsMap[y][x] === ENTITY_TYPES.CORRIDOR) &&
        floorsMap[y - 1][x] === ENTITY_TYPES.EMPTY &&
        floorsMap[y - 1][x - 1] === ENTITY_TYPES.EMPTY &&
        floorsMap[y - 1][x + 1] === ENTITY_TYPES.EMPTY
      ) {
        canRespawn.push({ rx: x, ry: y });
      }
    }
  }
  const { rx, ry } = ROT.RNG.getItem(canRespawn);
  fillFloorsMap(floorsMap, ry, ry, rx, rx, ENTITY_TYPES.UPSTAIR);

  const canClear = [];
  for (let y = 0; y < floorsMap.length; y++) {
    for (let x = 0; x < floorsMap[0].length; x++) {
      const finalDistance = Vector2.manhattan(new Vector2(rx, ry), new Vector2(x, y));
      if (
        floorsMap[y][x] === ENTITY_TYPES.FLOOR &&
        finalDistance > (dungeonW + dungeonH) * 0.2 &&
        floorsMap[y + 1][x] !== ENTITY_TYPES.EMPTY &&
        floorsMap[y + 1][x] !== ENTITY_TYPES.CORRIDOR &&
        floorsMap[y - 1][x] !== ENTITY_TYPES.CORRIDOR &&
        floorsMap[y][x - 1] !== ENTITY_TYPES.CORRIDOR &&
        floorsMap[y][x + 1] !== ENTITY_TYPES.CORRIDOR
      ) {
        canClear.push({ cx: x, cy: y });
      }
    }
  }
  const { cx, cy } = ROT.RNG.getItem(canClear);
  fillFloorsMap(floorsMap, cy, cy, cx, cx, ENTITY_TYPES.DOWNSTAIR);

  return { tilesMap, floorsMap, decoratorsMap };
};

export const updateEntitiesLightings = (
  geometryPosition: IPosition | Vector2,
  entities: Entity[][]
) => {
  const fov = new ROT.FOV.RecursiveShadowcasting((x, y) => {
    const entity = entities?.[y]?.[x];
    if (
      entity?.hasAbility(ABILITY_NAMES.LIGHTABLE) &&
      entity?.hasAbility(ABILITY_NAMES.PASSABLE)
    ) {
      const passable = entity.getAbility(ABILITY_NAMES.PASSABLE);
      if (passable.status === ABILITY_STATUS.PASS) {
        return true;
      }
    }
    return false;
  });

  const { x, y } = geometryPosition;
  fov.compute(x, y, 6, (ex, ey, r) => {
    const entity = entities?.[ey]?.[ex];

    if (entity?.hasAbility(ABILITY_NAMES.LIGHTABLE)) {
      const lightable = entity.getAbility(ABILITY_NAMES.LIGHTABLE);
      lightable.status = ABILITY_STATUS.LIGHTING;
    }
  });
};

export const updateEntitiesDislightings = (
  geometryPosition: IPosition | Vector2,
  entities: Entity[][]
) => {
  for (const row of entities) {
    for (const entity of row) {
      if (entity?.hasAbility(ABILITY_NAMES.LIGHTABLE)) {
        const lightable = entity.getAbility(ABILITY_NAMES.LIGHTABLE);
        if (lightable.status === ABILITY_STATUS.LIGHTING) {
          lightable.status = ABILITY_STATUS.DISLIGHTING;
        }
      }
    }
  }
};
