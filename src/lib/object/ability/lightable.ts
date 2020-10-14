import * as PIXI from 'pixi.js';
import { Loader } from '../../system';
import Entity from '../entity';
import Ability, { ABILITY_NAMES, ABILITY_STATUS } from './ability';

export enum LIGHT_TYPES {
  UNVISIT,
  LIGHTING,
  DISLIGHTING,
}

export default class Lightable extends Ability {
  protected _status:
    | ABILITY_STATUS.LIGHTING
    | ABILITY_STATUS.DISLIGHTING
    | ABILITY_STATUS.UNVISIT;

  private _entity: Entity;
  private _sprite: PIXI.Sprite;

  public constructor(
    initStatus:
      | ABILITY_STATUS.LIGHTING
      | ABILITY_STATUS.DISLIGHTING
      | ABILITY_STATUS.UNVISIT = ABILITY_STATUS.UNVISIT
  ) {
    super();
    this._name = ABILITY_NAMES.LIGHTABLE;

    const texture = Loader.textures.LIGHTING_MASK[0];
    const sprite = new PIXI.Sprite(texture);
    this._sprite = sprite;

    this._status = initStatus;
    this.initialize(initStatus);
  }

  private initialize(
    initStatus: ABILITY_STATUS.LIGHTING | ABILITY_STATUS.DISLIGHTING | ABILITY_STATUS.UNVISIT
  ) {
    this.switchStatus(initStatus);
  }

  private switchStatus(
    status: ABILITY_STATUS.LIGHTING | ABILITY_STATUS.DISLIGHTING | ABILITY_STATUS.UNVISIT
  ) {
    switch (status) {
      case ABILITY_STATUS.LIGHTING:
        this._sprite.alpha = 0;
        break;

      case ABILITY_STATUS.DISLIGHTING:
        this._sprite.alpha = 0.618;
        break;
      case ABILITY_STATUS.UNVISIT:
        this._sprite.alpha = 1;
        break;

      default:
        break;
    }
  }

  public get sprite() {
    return this._sprite;
  }

  public get status() {
    return this._status;
  }

  public set status(
    status: ABILITY_STATUS.LIGHTING | ABILITY_STATUS.DISLIGHTING | ABILITY_STATUS.UNVISIT
  ) {
    this.switchStatus(status);
    this._status = status;
  }
}
