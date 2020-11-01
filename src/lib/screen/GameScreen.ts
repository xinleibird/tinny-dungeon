import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { Renderable } from '../abstraction';
import { StaticSystem } from '../core';

export default abstract class GameScreen extends Renderable {
  protected _rendering: PIXI.Container = new PIXI.Container();

  private _size: { width: number; height: number } = { width: 0, height: 0 };

  public constructor(width: number, height: number) {
    super();
    this._size = { width, height };
    this._rendering.interactive = true;
    this.follow(StaticSystem.camera.viewport);
  }

  public resize(width: number, height: number) {
    this._size = { width, height };
    this._rendering.width = width;
    this._rendering.height = height;
  }

  public get rendering() {
    return this._rendering;
  }

  private follow(viewport: Viewport) {
    PIXI.Ticker.shared.add(() => {
      this._rendering.position = viewport.center;
    });
  }
}
