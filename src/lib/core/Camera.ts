import Cull from 'pixi-cull';
import { Viewport, ViewportOptions } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { Character } from '../character';
import { GAME_OPTIONS } from '../config';
import StaticSystem from './StaticSystem';

const { PIXEL_SCALE, MAX_DUNGEON_SIZE } = GAME_OPTIONS;

const defaultViewportOptions: ViewportOptions = {
  screenWidth: (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio,
  screenHeight: (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio,
  worldHeight: MAX_DUNGEON_SIZE * 16 + window.innerWidth,
  worldWidth: MAX_DUNGEON_SIZE * 16 + window.innerHeight,
};

export default class Camera {
  private _viewport: Viewport;

  public constructor(options?: ViewportOptions) {
    if (options) {
      this._viewport = new Viewport(options);
    } else {
      this._viewport = new Viewport(defaultViewportOptions);
    }

    StaticSystem.registCamera(this);
    this.cullViewport();
  }

  public addChild(...obj: PIXI.DisplayObject[]) {
    this._viewport.addChild(...obj);
  }

  public removeChild(obj: PIXI.DisplayObject) {
    this._viewport.removeChild(obj);
  }

  public removeChildren() {
    this._viewport.removeChildren();
  }

  public follow(character: Character) {
    this._viewport.follow(character.rendering);
  }

  public get viewport() {
    return this._viewport;
  }

  private cullViewport() {
    const cull = new Cull.Simple({
      dirtyTest: false,
    });

    cull.addList(this._viewport.children);
    cull.cull(this._viewport.getVisibleBounds());

    PIXI.Ticker.shared.add(() => {
      if (this._viewport.dirty) {
        cull.cull(this._viewport.getVisibleBounds());
        this._viewport.dirty = false;
      }
    });
  }
}
