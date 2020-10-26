import * as PIXI from 'pixi.js';
import { TILE_OPTIONS } from '../config';
import { Vector2 } from '../geometry';

const { TILE_OFFSET_X, TILE_OFFSET_Y, TILE_SIZE } = TILE_OPTIONS;

export default abstract class Renderable {
  protected _rendering: PIXI.DisplayObject;
  protected _geometryPosition: Vector2;

  public abstract get rendering(): PIXI.DisplayObject | null;
  public abstract set rendering(rendering: PIXI.DisplayObject | null);

  public get geometryPosition() {
    return this._geometryPosition;
  }

  public set geometryPosition(geometryPosition: Vector2) {
    const { x, y } = geometryPosition;
    this._rendering?.position?.set(
      x * TILE_SIZE + TILE_OFFSET_X,
      y * TILE_SIZE + TILE_OFFSET_Y
    );

    this._geometryPosition = geometryPosition;
  }

  public setRenderingGeometryPosition(geometryPosition: Vector2) {
    this.geometryPosition = geometryPosition;
  }
}
