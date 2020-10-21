import * as ROT from 'rot-js';
import StaticSystem from '../core/static';
import { Vector2 } from '../geometry';
import { ABILITY_NAMES, ABILITY_STATUS, Lightable } from '../object/ability';

export const updateEntitiesLightings = (geometryPosition: Vector2, radius = 6) => {
  const entityGroup = StaticSystem.entityGroup;
  const fov = new ROT.FOV.RecursiveShadowcasting((x, y) => {
    const entity = entityGroup.getEntity(x, y);
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

  const { x: sx, y: sy } = geometryPosition;
  fov.compute(sx, sy, radius, (x, y, r) => {
    const entityGroup = StaticSystem.entityGroup;
    const entity = entityGroup.getEntity(x, y);

    if (entity?.hasAbility(ABILITY_NAMES.LIGHTABLE)) {
      const lightable = entity.getAbility(ABILITY_NAMES.LIGHTABLE) as Lightable;
      lightable.status = ABILITY_STATUS.LIGHTING;

      lightable.lightingLevel = r;
    }
  });
};

export const updateEntitiesDislightings = (geometryPosition: Vector2) => {
  const entityGroup = StaticSystem.entityGroup;
  entityGroup.forLoop((x, y) => {
    const entity = entityGroup.getEntity(x, y);
    if (entity?.hasAbility(ABILITY_NAMES.LIGHTABLE)) {
      const lightable = entity.getAbility(ABILITY_NAMES.LIGHTABLE);
      if (lightable.status === ABILITY_STATUS.LIGHTING) {
        lightable.status = ABILITY_STATUS.DISLIGHTING;
      }
    }
  });
};

export const findEntitiesPath = (sourcePosition: Vector2, targetPosition: Vector2) => {
  const { x: sx, y: sy } = sourcePosition;
  const entityGroup = StaticSystem.entityGroup;

  const dijkstra = new ROT.Path.Dijkstra(
    sx,
    sy,
    (x, y) => {
      const entity = entityGroup.getEntity(x, y);
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
    },
    { topology: 4 }
  );

  const { x: tx, y: ty } = targetPosition;

  const pathStack = [];
  dijkstra.compute(tx, ty, (x, y) => {
    pathStack.push(new Vector2(x, y));
  });

  return pathStack;
};
