import * as ROT from 'rot-js';
import { NonPlayer } from '../character';
import { StaticSystem } from '../core';
import { Vector2 } from '../geometry';
import { ABILITY_NAMES, ABILITY_STATUS, Lightable } from '../object/ability';

export const updateEntitiesLightings = (geometryPosition: Vector2, radius = 6) => {
  const entityGroup = StaticSystem.entityGroup;
  const characterGroup = StaticSystem.characterGroup;

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

      const character = characterGroup.getCharacter(x, y) as NonPlayer;
      character?.show();
    }
  });
};

export const updateEntitiesDislightings = (geometryPosition: Vector2) => {
  const entityGroup = StaticSystem.entityGroup;
  const characterGroup = StaticSystem.characterGroup;
  entityGroup.forLoop((x, y) => {
    const entity = entityGroup.getEntity(x, y);
    if (entity?.hasAbility(ABILITY_NAMES.LIGHTABLE)) {
      const lightable = entity.getAbility(ABILITY_NAMES.LIGHTABLE);
      if (lightable.status === ABILITY_STATUS.LIGHTING) {
        lightable.status = ABILITY_STATUS.DISLIGHTING;

        const character = characterGroup.getCharacter(x, y) as NonPlayer;
        character?.hide();
      }
    }
  });
};

export const findEntitiesPath = (
  sourcePosition: Vector2,
  targetPosition: Vector2,
  isStay = false
) => {
  const { x: sx, y: sy } = sourcePosition;
  const { x: tx, y: ty } = targetPosition;
  const entityGroup = StaticSystem.entityGroup;
  const characterGroup = StaticSystem.characterGroup;

  const currentCharacter = characterGroup.getCharacter(sx, sy);
  currentCharacter.inTick = true;

  let threshold = 0;

  const dijkstra = new ROT.Path.Dijkstra(
    sx,
    sy,
    (x, y) => {
      const entity = entityGroup.getEntity(x, y);

      if (threshold > 300) {
        return false;
      }

      if (entity?.hasAbility(ABILITY_NAMES.PASSABLE)) {
        const passable = entity.getAbility(ABILITY_NAMES.PASSABLE);
        const char = characterGroup.getCharacter(x, y);
        const inTick = char?.inTick;

        threshold += 1;
        if (isStay) {
          if (passable.status === ABILITY_STATUS.PASS && !inTick) {
            return true;
          }
        } else {
          if (passable.status === ABILITY_STATUS.PASS) {
            return true;
          }
        }
      }

      return false;
    },
    { topology: 4 }
  );

  const pathStack = [];
  dijkstra.compute(tx, ty, (x, y) => {
    const dir = Vector2.minus(new Vector2(x, y), sourcePosition);
    if (!Vector2.equals(Vector2.center, dir)) {
      pathStack.push(dir);
    }
  });

  return pathStack[0];
};
