import * as PIXI from 'pixi.js';
import { Renderable } from '../abstraction';
import { Character, Player } from '../character';
import { Vector2 } from '../geometry';
import { Ability, Lightable } from '../object/ability';
import { Tile } from '../tilemap';
import Camera from './Camera';
import StaticSystem from './StaticSystem';

export default class Renderer {
  private _camera: Camera;

  private _tileLayer: PIXI.DisplayObject[] = [];
  private _floorLayer: PIXI.DisplayObject[] = [];
  private _characterLayer: PIXI.Container = new PIXI.Container();
  private _lightingLayer: PIXI.DisplayObject[] = [];

  private _player: Player;

  public constructor() {
    this._camera = StaticSystem.camera;
    StaticSystem.registRenderer(this);
  }

  public render() {
    this._tileLayer.length > 0 && this._camera.addChild(...this._tileLayer);
    this._floorLayer.length > 0 && this._camera.viewport.addChild(...this._floorLayer);
    this._characterLayer.children.length > 0 &&
      this._camera.viewport.addChild(this._characterLayer);
    this._lightingLayer.length > 0 && this._camera.viewport.addChild(...this._lightingLayer);
  }

  public trash() {
    this._tileLayer = [];
    this._floorLayer = [];
    this._lightingLayer = [];

    this._characterLayer.removeChildren();
    StaticSystem.camera.removeChildren();

    this._player.geometryPosition = new Vector2(0, 0);
    this.add(this._player);
  }

  public get characterLayer() {
    return this._characterLayer;
  }

  public setCharIndex(obj: PIXI.DisplayObject, index: number) {
    this._characterLayer.setChildIndex(obj, index);
  }

  public add(obj: Renderable) {
    if (obj instanceof Tile) {
      this._tileLayer.push(obj.rendering);
    }

    if (obj instanceof Ability) {
      if (obj instanceof Lightable) {
        this._lightingLayer.push(obj.rendering);
      } else {
        this._floorLayer.push(obj.rendering);
      }
    }

    if (obj instanceof Character) {
      this._characterLayer.addChild(obj.rendering);

      if (obj instanceof Player) {
        this._player = obj;
      }
    }
  }
}
