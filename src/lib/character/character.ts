import { Vector2 } from '../geometry';
import * as PIXI from 'pixi.js';
import { Loader } from '../system';

export enum PLAYER_TYPES {
  KNIGHT_M = 'knight_m',
}

export enum NONPLAYER_TYPES {}

export const CHARACTER_TYPES = {
  ...PLAYER_TYPES,
  ...NONPLAYER_TYPES,
};

export enum CHARACTER_ANIMATION_TYPES {
  HOLD = 'hold',
  WALK = 'walk',
  ATTACK = 'attack',
  HURT = 'hurt',
}

export default class Character extends PIXI.Container {
  protected _type: PLAYER_TYPES | NONPLAYER_TYPES;
  protected _geometryPosition: Vector2;

  protected constructor(x = 0, y = 0, type: PLAYER_TYPES | NONPLAYER_TYPES) {
    super();
    this._geometryPosition = new Vector2(x, y);
    this._type = type;

    this.initialize(type);

    this.position.set(x * 16 + 24, y * 16 + 24);
  }

  public setGeometryPosition(x: number, y: number) {
    this._geometryPosition = new Vector2(x, y);
    this.position.set(x * 16 + 24, y * 16 + 24);
  }

  public get geometryPosition() {
    return this._geometryPosition;
  }

  private initialize(type: PLAYER_TYPES | NONPLAYER_TYPES) {
    const character = type.toString().toUpperCase();

    const holdBatch = Loader.textures[character][CHARACTER_ANIMATION_TYPES.HOLD];
    const walkBatch = Loader.textures[character][CHARACTER_ANIMATION_TYPES.WALK];
    const attackBatch = Loader.textures[character][CHARACTER_ANIMATION_TYPES.ATTACK];
    const hurtBatch = Loader.textures[character][CHARACTER_ANIMATION_TYPES.HURT];

    const hold = new PIXI.AnimatedSprite(holdBatch);
    const walk = new PIXI.AnimatedSprite(walkBatch);
    const attack = new PIXI.AnimatedSprite(attackBatch);
    const hurt = new PIXI.AnimatedSprite(hurtBatch);

    hold.visible = false;
    walk.visible = false;
    attack.visible = true;
    hurt.visible = false;

    const duringSecond = 0.5;
    const speed = 1 / (duringSecond / (4 / 60));

    hold.animationSpeed = speed;
    walk.animationSpeed = speed;
    attack.animationSpeed = speed;
    hurt.animationSpeed = speed;

    hold.anchor.y = 0.5;
    walk.anchor.y = 0.5;
    attack.anchor.y = 0.5;
    hurt.anchor.y = 0.5;

    this.addChild(hold, walk, attack, hurt);
  }
}
