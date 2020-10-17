import * as ROT from 'rot-js';
import { NonPlayer } from '../character';
import { Vector2 } from '../geometry';
import { ABILITY_NAMES, ABILITY_STATUS, Lightable } from '../object/ability';
import Entity from '../object/entity';

export const updateEntitiesLightings = (geometryPosition: Vector2, entities: Entity[][]) => {
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
      const lightable = entity.getAbility(ABILITY_NAMES.LIGHTABLE) as Lightable;
      lightable.status = ABILITY_STATUS.LIGHTING;
      lightable.lightingLevel = r;

      const character = entity?.character;

      if (character instanceof NonPlayer) {
        character.show();
      }
    }
  });
};

export const updateEntitiesDislightings = (
  geometryPosition: Vector2,
  entities: Entity[][]
) => {
  for (const row of entities) {
    for (const entity of row) {
      if (entity?.hasAbility(ABILITY_NAMES.LIGHTABLE)) {
        const lightable = entity.getAbility(ABILITY_NAMES.LIGHTABLE);
        if (lightable.status === ABILITY_STATUS.LIGHTING) {
          lightable.status = ABILITY_STATUS.DISLIGHTING;

          const character = entity?.character;
          if (character instanceof NonPlayer) {
            character.hide();
          }
        }
      }
    }
  }
};
