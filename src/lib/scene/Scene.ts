import { Control, StaticSystem } from '../core';
import { EntityGroup } from '../entity';
import { Vector2 } from '../geometry';

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
}
