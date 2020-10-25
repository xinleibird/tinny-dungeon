import CharacterGroup from '../character/group';
import StaticSystem from '../core/static';
import { Vector2 } from '../geometry';
import EntityGroup from '../object/group';

export default class Scene {
  protected _entityGroup: EntityGroup;
  protected _characterGroup: CharacterGroup;
  protected _playerRespawnPosition: Vector2;
  protected _sceneClearPosition: Vector2;

  protected constructor(tx: number, ty: number) {
    this._characterGroup = new CharacterGroup(tx, ty);
    StaticSystem.registScene(this);
  }

  public get playerRespawnPosition() {
    return this._playerRespawnPosition;
  }

  public get sceneClearPosition() {
    return this._sceneClearPosition;
  }
}
