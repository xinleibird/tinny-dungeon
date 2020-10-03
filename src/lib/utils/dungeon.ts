import { ENTITY_TYPES } from '../objects/entity';
import { initialize2DArray } from './array';
import * as ROT from 'rot-js';
import { TILE_TYPES } from '../tilemap/tile';

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

const fillEntities = (
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

export const generateDungeon = (dungeonW: number, dungeonH: number) => {
  const tilesW = ~~(dungeonW / 2) + 1;
  const tilesH = ~~(dungeonH / 2) + 1;

  const tiles = initialize2DArray(tilesW, tilesH, TILE_TYPES.EMPTY);
  const entities = initialize2DArray(dungeonW, dungeonH, ENTITY_TYPES.EMPTY);

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

    console.log(tiles);

    fillTiles(tiles, roomTop, roomBottom, roomLeft, roomRight, TILE_TYPES.FLOOR);

    fillEntities(
      entities,
      roomTop * 2 - 1,
      roomBottom * 2 - 1,
      roomLeft * 2 - 1,
      roomRight * 2 - 1,
      ENTITY_TYPES.FLOOR
    );

    room.getDoors((x, y) => {
      fillTiles(tiles, y, y, x, x, TILE_TYPES.DOOR);

      fillEntities(entities, 2 * y - 1, 2 * y - 1, 2 * x - 1, 2 * x - 1, ENTITY_TYPES.DOOR);
    });
  });

  const corridors = dungeon.getCorridors();
  corridors.forEach((corridor) => {
    const { _startX, _startY, _endX, _endY } = corridor;
    const { top, bottom, left, right } = normalize(_startY, _endY, _startX, _endX);

    fillTiles(tiles, top, bottom, left, right, TILE_TYPES.CORRIDOR);

    fillEntities(
      entities,
      top * 2 - 1,
      bottom * 2 - 1,
      left * 2 - 1,
      right * 2 - 1,
      ENTITY_TYPES.CORRIDOR
    );
  });

  return { tiles, entities };
};
