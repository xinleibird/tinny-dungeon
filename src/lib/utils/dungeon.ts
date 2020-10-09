import * as ROT from 'rot-js';

import { Vector2 } from '../geometry';
import { ENTITY_TYPES } from '../objects/entity';
import { TILE_TYPES } from '../tilemap/tile';
import { initialize2DArray } from './array';

const fillTiles = (
  tiles: TILE_TYPES[][],
  top: number,
  bottom: number,
  left: number,
  right: number,
  tile: TILE_TYPES = TILE_TYPES.EMPTY
) => {
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      tiles[y][x] = tile;
    }
  }
};

const fillEntitiesMap = (
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

const fillDecoratorsMap = (decoratorsMap, entitiesMap) => {
  const decoratorTypesWeight = {
    '0': 50,
    '1': 1,
    '2': 1,
    '3': 1,
    '4': 1,
    '5': 1,
    '6': 1,
    '7': 1,
    '8': 1,
    '9': 1,
    '10': 1,
    '11': 1,
    '12': 1,
    '13': 1,
    '14': 1,
    '15': 1,
    '16': 1,
    '17': 1,
    '18': 1,
    '19': 1,
    '20': 1,
  };

  for (let y = 0; y < entitiesMap.length; y++) {
    for (let x = 0; x < entitiesMap[0].length; x++) {
      const currentMap = entitiesMap[y][x];
      if (currentMap !== ENTITY_TYPES.EMPTY) {
        const str = ROT.RNG.getWeightedValue(decoratorTypesWeight);
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

  const tiles = initialize2DArray(tilesW, tilesH, TILE_TYPES.EMPTY);
  const entitiesMap = initialize2DArray(dungeonW, dungeonH, ENTITY_TYPES.EMPTY);
  const decoratorsMap = initialize2DArray(dungeonW, dungeonH, 0);

  const dungeon = new ROT.Map.Digger(tilesW, tilesH, {
    roomHeight: [2, 5],
    roomWidth: [2, 5],
    dugPercentage: 0.618,
    corridorLength: [1, 2],
    timeLimit: 1000,
  }).create();

  const rooms = dungeon.getRooms();

  rooms.forEach((room) => {
    const roomLeft = room.getLeft();
    const roomRight = room.getRight();
    const roomTop = room.getTop();
    const roomBottom = room.getBottom();

    fillTiles(tiles, roomTop, roomBottom, roomLeft, roomRight, TILE_TYPES.FLOOR);

    fillEntitiesMap(
      entitiesMap,
      roomTop * 2 - 1,
      roomBottom * 2 - 1,
      roomLeft * 2 - 1,
      roomRight * 2 - 1,
      ENTITY_TYPES.FLOOR
    );

    room.getDoors((x, y) => {
      fillTiles(tiles, y, y, x, x, TILE_TYPES.DOOR);

      fillEntitiesMap(
        entitiesMap,
        2 * y - 1,
        2 * y - 1,
        2 * x - 1,
        2 * x - 1,
        ENTITY_TYPES.DOOR
      );
    });
  });

  const corridors = dungeon.getCorridors();
  corridors.forEach((corridor) => {
    const { _startX, _startY, _endX, _endY } = corridor;
    const { top, bottom, left, right } = normalize(_startY, _endY, _startX, _endX);

    fillTiles(tiles, top, bottom, left, right, TILE_TYPES.CORRIDOR);

    fillEntitiesMap(
      entitiesMap,
      top * 2 - 1,
      bottom * 2 - 1,
      left * 2 - 1,
      right * 2 - 1,
      ENTITY_TYPES.CORRIDOR
    );
  });

  fillDecoratorsMap(decoratorsMap, entitiesMap);

  const canRespawn = [];
  for (let y = 0; y < entitiesMap.length; y++) {
    for (let x = 0; x < entitiesMap[0].length; x++) {
      if (
        (entitiesMap[y][x] === ENTITY_TYPES.FLOOR ||
          entitiesMap[y][x] === ENTITY_TYPES.CORRIDOR) &&
        entitiesMap[y - 1][x] === ENTITY_TYPES.EMPTY &&
        entitiesMap[y - 1][x - 1] === ENTITY_TYPES.EMPTY &&
        entitiesMap[y - 1][x + 1] === ENTITY_TYPES.EMPTY
      ) {
        canRespawn.push({ rx: x, ry: y });
      }
    }
  }
  const { rx, ry } = ROT.RNG.getItem(canRespawn);
  fillEntitiesMap(entitiesMap, ry, ry, rx, rx, ENTITY_TYPES.UPSTAIR);

  const canClear = [];
  for (let y = 0; y < entitiesMap.length; y++) {
    for (let x = 0; x < entitiesMap[0].length; x++) {
      const finalDistance = Vector2.manhattan(new Vector2(rx, ry), new Vector2(x, y));
      if (
        entitiesMap[y][x] === ENTITY_TYPES.FLOOR &&
        finalDistance > (dungeonW + dungeonH) * 0.2 &&
        entitiesMap[y + 1][x] !== ENTITY_TYPES.EMPTY &&
        entitiesMap[y + 1][x] !== ENTITY_TYPES.CORRIDOR &&
        entitiesMap[y - 1][x] !== ENTITY_TYPES.CORRIDOR &&
        entitiesMap[y][x - 1] !== ENTITY_TYPES.CORRIDOR &&
        entitiesMap[y][x + 1] !== ENTITY_TYPES.CORRIDOR
      ) {
        canClear.push({ cx: x, cy: y });
      }
    }
  }
  const { cx, cy } = ROT.RNG.getItem(canClear);
  fillEntitiesMap(entitiesMap, cy, cy, cx, cx, ENTITY_TYPES.DOWNSTAIR);

  return { tiles, entitiesMap, decoratorsMap };
};
