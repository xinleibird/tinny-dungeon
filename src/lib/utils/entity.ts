import * as ROT from 'rot-js';
import { NonPlayer } from '../character';
import { StaticSystem } from '../core';
import { Vector2 } from '../geometry';
import { ABILITY_NAMES, ABILITY_STATUS, Lightable } from '../object/ability';

export const updateEntitiesLightings = (geometryPosition: Vector2, radius = 6) => {
  if (!geometryPosition) {
    return;
  }

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

  if (geometryPosition.equals(Vector2.center)) {
    entityGroup.forLoop((x, y) => {
      const entity = entityGroup.getEntity(x, y);
      if (entity?.hasAbility(ABILITY_NAMES.LIGHTABLE)) {
        const lightable = entity.getAbility(ABILITY_NAMES.LIGHTABLE);
        lightable.status = ABILITY_STATUS.UNVISIT;
        return;
      }
    });
  }

  const { x: sx, y: sy } = geometryPosition;
  fov.compute(sx, sy, radius, (x, y, r) => {
    const entityGroup = StaticSystem.entityGroup;
    const entity = entityGroup.getEntity(x, y);

    if (entity?.hasAbility(ABILITY_NAMES.LIGHTABLE)) {
      const lightable = entity.getAbility(ABILITY_NAMES.LIGHTABLE) as Lightable;
      lightable.status = ABILITY_STATUS.LIGHTING;

      lightable.lightingLevel = r;

      const character = entityGroup.getCharacter(x, y) as NonPlayer;
      character?.show();
    }
  });
};

export const updateEntitiesDislightings = (geometryPosition: Vector2) => {
  if (!geometryPosition) {
    return;
  }

  const entityGroup = StaticSystem.entityGroup;

  if (geometryPosition.equals(Vector2.center)) {
    entityGroup.forLoop((x, y) => {
      const entity = entityGroup.getEntity(x, y);
      if (entity?.hasAbility(ABILITY_NAMES.LIGHTABLE)) {
        const lightable = entity.getAbility(ABILITY_NAMES.LIGHTABLE);
        lightable.status = ABILITY_STATUS.UNVISIT;
        return;
      }
    });
  }

  entityGroup.forLoop((x, y) => {
    const entity = entityGroup.getEntity(x, y);
    if (entity?.hasAbility(ABILITY_NAMES.LIGHTABLE)) {
      const lightable = entity.getAbility(ABILITY_NAMES.LIGHTABLE);
      if (lightable.status === ABILITY_STATUS.LIGHTING) {
        lightable.status = ABILITY_STATUS.DISLIGHTING;

        const character = entityGroup.getCharacter(x, y);
        if (character instanceof NonPlayer) {
          character?.hide();
        }
      }

      if (lightable.status === ABILITY_STATUS.DISLIGHTING) {
        const character = entityGroup.getCharacter(x, y);
        if (character instanceof NonPlayer) {
          character?.hide();
        }
      }
    }
  });
};
