import * as PIXI from 'pixi.js';

export default abstract class Renderable {
  protected _rendering: PIXI.DisplayObject;

  public abstract get rendering(): PIXI.DisplayObject | null;
}
