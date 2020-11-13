import * as ROT from 'rot-js';
import { NonPlayer } from '../character';
import { Control, StaticSystem } from '../core';
import { Entity, EntityGroup, ENTITY_TYPES } from '../entity';
import { Vector2 } from '../geometry';
import { ABILITY_NAMES, ABILITY_STATUS, Passable } from '../object/ability';

export default class Scene {
  protected _entityGroup: EntityGroup;
  protected _respawnPosition: Vector2;
  protected _clearPosition: Vector2;

  protected constructor(tx: number, ty: number) {
    StaticSystem.registScene(this);
  }

  public get playerRespawnPosition() {
    return this._respawnPosition;
  }

  public get sceneClearPosition() {
    return this._clearPosition;
  }

  public destroy() {
    StaticSystem.renderer.trash();
    Control.trash();
  }

  public addNonPlayers(nonPlayers: NonPlayer[]) {
    const entities = [];
    StaticSystem.entityGroup.loop((entity) => {
      if (
        entity.hasAbility(ABILITY_NAMES.PASSABLE) &&
        !entity.hasAbility(ABILITY_NAMES.OPENABLE) &&
        !entity.hasAbility(ABILITY_NAMES.CLEARABLE) &&
        !entity.hasAbility(ABILITY_NAMES.RESPAWNABLE)
      ) {
        const passable = entity.getAbility(ABILITY_NAMES.PASSABLE) as Passable;
        if (passable.status === ABILITY_STATUS.PASS && passable.type === ENTITY_TYPES.FLOOR) {
          entities.push(entity);
        }
      }
    });

    for (const non of nonPlayers) {
      const entity: Entity = ROT.RNG.getItem(entities);
      const index = entities.indexOf(entity);
      entities.splice(index, 1);

      non.geometryPosition = entity.geometryPosition;
    }
  }
}
