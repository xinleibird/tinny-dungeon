import * as PIXI from 'pixi.js';
import { Renderable } from '../abstraction';
import { Character, Player } from '../character';
import {
  Ability,
  Brokeable,
  Clearable,
  Lightable,
  Pickupable,
  Respawnable,
} from '../object/ability';
import { External } from '../object/external';
import { BackgroundScreen, ForegroundScreen, GameScreen } from '../screen';
import { Tile } from '../tilemap';
import { UserInterface } from '../ui';
import Camera from './Camera';
import StaticSystem from './StaticSystem';

export default class Renderer {
  private _camera: Camera;

  private _backgroundLayer: PIXI.Container = new PIXI.Container();
  private _tileLayer: PIXI.DisplayObject[] = [];
  private _floorLayer: PIXI.DisplayObject[] = [];
  private _characterLayer: PIXI.Container = new PIXI.Container();
  private _lightingLayer: PIXI.DisplayObject[] = [];
  private _externalLayer: PIXI.Container = new PIXI.Container();
  private _uiLayer: PIXI.DisplayObject[] = [];
  private _foregroundLayer: PIXI.Container = new PIXI.Container();

  private _player: Player;

  public constructor() {
    this._camera = StaticSystem.camera;
    StaticSystem.registRenderer(this);
  }

  public render() {
    this._camera.viewport.addChild(this._backgroundLayer);
    this._tileLayer.length > 0 && this._camera.addChild(...this._tileLayer);
    this._floorLayer.length > 0 && this._camera.viewport.addChild(...this._floorLayer);
    this._camera.viewport.addChild(this._characterLayer);
    this._lightingLayer.length > 0 && this._camera.viewport.addChild(...this._lightingLayer);
    this._camera.viewport.addChild(this._externalLayer);
    this._uiLayer.length > 0 && this._camera.viewport.addChild(...this._uiLayer);
    this._camera.viewport.addChild(this._foregroundLayer);
  }

  public trash() {
    this._tileLayer = [];
    this._floorLayer = [];
    this._characterLayer.removeChildren();
    this._lightingLayer = [];
    this._externalLayer.removeChildren();
    this._uiLayer = [];
    StaticSystem.camera.removeChildren();
    StaticSystem.camera.addChild(this._backgroundLayer);
    StaticSystem.camera.addChild(this._foregroundLayer);
  }

  public get characterLayer() {
    return this._characterLayer;
  }

  public remove(obj: Renderable) {
    if (obj instanceof Ability) {
      if (obj instanceof Pickupable) {
        this._characterLayer.removeChild(obj.rendering);
        return;
      }
    }
  }

  public add(obj: Renderable) {
    if (obj instanceof Tile) {
      this._tileLayer.push(obj.rendering);
      return;
    }

    if (obj instanceof Ability) {
      if (obj instanceof Respawnable || obj instanceof Clearable || obj instanceof Brokeable) {
        this._floorLayer.push(obj.rendering);
        return;
      }

      if (obj instanceof Lightable) {
        this._lightingLayer.push(obj.rendering);
        return;
      }

      if (obj instanceof Pickupable) {
        this._characterLayer.addChild(obj.rendering);
        return;
      }

      this._floorLayer.push(obj.rendering);
      return;
    }

    if (obj instanceof Character) {
      this._characterLayer.addChild(obj.rendering);

      if (obj instanceof Player) {
        this._player = obj;
      }
      return;
    }

    if (obj instanceof External) {
      this._externalLayer.addChild(obj.rendering);
    }

    if (obj instanceof GameScreen) {
      if (obj instanceof BackgroundScreen) {
        this._backgroundLayer.addChild(obj.rendering);
      }

      if (obj instanceof ForegroundScreen) {
        this._foregroundLayer.addChild(obj.rendering);
      }
    }

    if (obj instanceof UserInterface) {
      this._uiLayer.push(obj.rendering);
    }
  }
}
