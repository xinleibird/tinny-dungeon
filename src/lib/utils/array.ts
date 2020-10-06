import { Vector2 } from '../geometry';
import Entity, { ENTITY_TYPES } from '../objects/entity';

export const initialize2DArray = (
  w: number,
  h: number,
  val: number | boolean | Entity = 0
) => {
  const matrix = [];
  for (let y = 0; y < h; y++) {
    matrix[y] = [];
    for (let x = 0; x < w; x++) {
      if (val instanceof Entity) {
        const entity = new Entity(x, y, val.type);
        matrix[y][x] = entity;
      } else {
        matrix[y][x] = val;
      }
    }
  }
  return matrix;
};
