import * as PIXI from 'pixi.js';
import { StaticSystem } from '../../core';
import { Vector2 } from '../../geometry';
import { Loader } from '../../system';
import Ability, { ABILITY_NAMES, ABILITY_STATUS } from './Ability';

type LightableStatus =
  | ABILITY_STATUS.LIGHTING
  | ABILITY_STATUS.DISLIGHTING
  | ABILITY_STATUS.UNVISIT;
export default class Lightable extends Ability {
  protected _rendering: PIXI.Sprite;
  protected _status: LightableStatus;

  private _lightingLevel: number;

  public constructor(
    geometryPosition: Vector2,
    initStatus: LightableStatus = ABILITY_STATUS.UNVISIT
  ) {
    super(geometryPosition);
    this._name = ABILITY_NAMES.LIGHTABLE;

    const texture = Loader.textures.LIGHTING_MASK[0];
    const sprite = new PIXI.Sprite(texture);
    this._rendering = sprite;
    this.geometryPosition = geometryPosition;

    this._status = initStatus;
    this.initialize(initStatus);

    StaticSystem.renderer.add(this);
  }

  public get rendering() {
    return this._rendering;
  }

  public get lightingLevel() {
    return this._lightingLevel;
  }

  public set lightingLevel(level: number) {
    switch (level) {
      case 0:
        break;
      case 1:
        this._rendering.alpha = 0;

        break;
      case 2:
        this._rendering.alpha = 0.05;
        break;
      case 3:
        this._rendering.alpha = 0.1;
        break;
      case 4:
        this._rendering.alpha = 0.18;
        break;
      case 5:
        this._rendering.alpha = 0.3;
        break;
      case 6:
        this._rendering.alpha = 0.46;
        break;

      default:
        break;
    }
  }

  private initialize(initStatus: LightableStatus) {
    this.switchStatus(initStatus);
  }

  private switchStatus(status: LightableStatus) {
    switch (status) {
      case ABILITY_STATUS.LIGHTING:
        this._rendering.alpha = 0;
        break;

      case ABILITY_STATUS.DISLIGHTING:
        this._rendering.alpha = 0.8;
        break;
      case ABILITY_STATUS.UNVISIT:
        this._rendering.alpha = 1;
        break;

      default:
        break;
    }
  }

  public get status() {
    return this._status;
  }

  public set status(status: LightableStatus) {
    this.switchStatus(status);
    this._status = status;
  }
}
