import * as PIXI from 'pixi.js';
import { Character } from '../../character';
import { StaticSystem } from '../../core';
import { Entity } from '../../entity';
import { GameSound } from '../../sound';
import { Loader } from '../../system';
import Ability, { ABILITY_NAMES, ABILITY_STATUS } from './Ability';

export enum BROKEABLE_TYPES {
  CONTAINER = 'container',
  POT = 'pot',
  BARREL = 'barrel',
}
type BrokeableStatus = ABILITY_STATUS.ENTIRE | ABILITY_STATUS.BROKEN;

export default class Brokeable extends Ability {
  protected _status: BrokeableStatus;
  protected _rendering: PIXI.Container;

  private _type: BROKEABLE_TYPES;

  public constructor(
    owner: Character | Entity,
    type: BROKEABLE_TYPES = BROKEABLE_TYPES.CONTAINER,
    initStatus: BrokeableStatus = ABILITY_STATUS.ENTIRE
  ) {
    super(owner);
    this._name = ABILITY_NAMES.BROKEABLE;
    this._type = type;
    this._status = initStatus;

    if (initStatus === ABILITY_STATUS.ENTIRE) {
      this._owner.getAbility(ABILITY_NAMES.PASSABLE).status = ABILITY_STATUS.STOP;
    } else {
      this._owner.getAbility(ABILITY_NAMES.PASSABLE).status = ABILITY_STATUS.PASS;
    }

    this.initialize(initStatus, type);
  }

  public exert() {
    this.status = ABILITY_STATUS.BROKEN;
  }

  private initialize(initStatus: BrokeableStatus, type: BROKEABLE_TYPES) {
    let sprite: PIXI.AnimatedSprite = null;
    let shadow: PIXI.AnimatedSprite = null;

    if (type === BROKEABLE_TYPES.CONTAINER) {
      const batch = Loader.textures.ATTACHMENTS.container;
      sprite = new PIXI.AnimatedSprite(batch);
      shadow = new PIXI.AnimatedSprite(batch);
    }

    if (type === BROKEABLE_TYPES.POT) {
      const batch = Loader.textures.ATTACHMENTS.pot;
      sprite = new PIXI.AnimatedSprite(batch);
      shadow = new PIXI.AnimatedSprite(batch);
    }

    if (type === BROKEABLE_TYPES.BARREL) {
      const batch = Loader.textures.ATTACHMENTS.barrel;
      sprite = new PIXI.AnimatedSprite(batch);
      shadow = new PIXI.AnimatedSprite(batch);
    }

    sprite.anchor.y = 0.5;
    shadow.anchor.y = 0.5;

    sprite.loop = false;
    shadow.loop = false;

    sprite.animationSpeed = 0.2;
    shadow.animationSpeed = 0.2;

    shadow.tint = 0x000000;
    shadow.position.y = -5;
    shadow.alpha = 0.5;

    if (initStatus === ABILITY_STATUS.ENTIRE) {
      sprite.gotoAndStop(0);
    } else {
      sprite.gotoAndStop(3);
    }

    const contain = new PIXI.Container();
    contain.addChild(sprite, shadow);
    this.rendering = contain;
    StaticSystem.renderer.add(this);
  }

  public get status() {
    return this._status;
  }

  public set status(status: BrokeableStatus) {
    if (status === ABILITY_STATUS.ENTIRE) {
      return;
    }

    if (this._status === ABILITY_STATUS.ENTIRE) {
      this._owner.getAbility(ABILITY_NAMES.PASSABLE).status = ABILITY_STATUS.PASS;

      const [sprite, shadow] = this._rendering.children as PIXI.AnimatedSprite[];
      setTimeout(() => {
        GameSound.play('broke', 0.1);
        sprite.play();
        shadow.play();
      }, 200);

      sprite.onComplete = () => {
        shadow.alpha = 0;
      };

      this._status = status;
    }

    return;
  }
}
