import { CharacterGroup } from '../character';
import { EntityGroup } from '../entity';
import { Scene } from '../scene';
import Camera from './Camera';
import Renderer from './Renderer';

export default class StaticSystem {
  private static _instance: StaticSystem;

  public static getInstance() {
    if (!StaticSystem._instance) {
      StaticSystem._instance = new StaticSystem();
    }
    return StaticSystem._instance;
  }

  public static registEntityGroup(entityGroup: EntityGroup) {
    const instance = StaticSystem.getInstance();
    instance._entityGroup = entityGroup;

    return instance._entityGroup;
  }

  public static registCharacterGroup(characterGroup: CharacterGroup) {
    const instance = StaticSystem.getInstance();
    instance._characterGroup = characterGroup;

    return instance._characterGroup;
  }

  public static registCamera(camera: Camera) {
    const instance = StaticSystem.getInstance();
    instance._camera = camera;

    return instance._camera;
  }

  public static registScene(scene: Scene) {
    const instance = StaticSystem.getInstance();
    instance._scene = scene;

    return instance._scene;
  }

  public static registRenderer(renderer: Renderer) {
    const instance = StaticSystem.getInstance();
    instance._renderer = renderer;

    return instance._scene;
  }

  public static get entityGroup() {
    const instance = StaticSystem.getInstance();
    return instance._entityGroup;
  }

  public static get characterGroup() {
    const instance = StaticSystem.getInstance();
    return instance._characterGroup;
  }

  public static get camera() {
    const instance = StaticSystem.getInstance();
    return instance._camera;
  }

  public static get scene() {
    const instance = StaticSystem.getInstance();
    return instance._scene;
  }

  public static get renderer() {
    const instance = StaticSystem.getInstance();
    return instance._renderer;
  }

  private _entityGroup: EntityGroup;
  private _characterGroup: CharacterGroup;
  private _camera: Camera;
  private _scene: Scene;
  private _renderer: Renderer;

  private constructor() {}
}
