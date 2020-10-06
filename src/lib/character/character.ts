import gsap, { TweenMax } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import * as PIXI from 'pixi.js';

import { IPosition, Vector2 } from '../geometry';
import { Loader } from '../system';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

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
  private _geometryPosition: Vector2;
  private _spriteOffset: { x: number; y: number };

  protected constructor(
    geometryPosition: Vector2 | IPosition,
    type: PLAYER_TYPES | NONPLAYER_TYPES,
    spriteOffset = { x: 32, y: 24 }
  ) {
    super();
    if (geometryPosition instanceof Vector2) {
      this._geometryPosition = geometryPosition;
    } else {
      const { x, y } = geometryPosition;
      this._geometryPosition = new Vector2(x, y);
    }
    this._type = type;
    this._spriteOffset = spriteOffset;

    this.initialize(type);

    const { x, y } = this._geometryPosition;
    this.position.set(x * 16 + spriteOffset.x, y * 16 + spriteOffset.y);
  }

  public set geometryPosition(position: Vector2) {
    this._geometryPosition = position;
    const { x, y } = position;
    this.position.set(x * 16 + this._spriteOffset.x, y * 16 + this._spriteOffset.y);
  }

  public get geometryPosition() {
    return this._geometryPosition;
  }

  public hold() {
    const [hold, walk, attack, hurt] = this.children as PIXI.AnimatedSprite[];
    hold.visible = true;
    walk.visible = false;
    attack.visible = false;
    hurt.visible = false;

    hold.play();
  }

  public walk(direction: Vector2) {
    const [hold, walk, attack, hurt] = this.children as PIXI.AnimatedSprite[];
    hold.visible = false;
    walk.visible = true;
    attack.visible = false;
    hurt.visible = false;

    this._geometryPosition.combine(direction);
    const { x, y } = this._geometryPosition;

    // this.position.set(x * 16 + this._spriteOffset.x, y * 16 + this._spriteOffset.y);
    gsap.to(this, {
      duration: 0.5,
      pixi: {
        x: x * 16 + this._spriteOffset.x,
        y: y * 16 + this._spriteOffset.y,
      },
      ease: 'back.inOut(1.4)',
      onStart: () => {
        walk.play();
      },
      onComplete: () => {
        // walk.play();
        this.hold();
      },
    });

    if (direction.equals(Vector2.left())) {
      this.scale.x = -1;
    }

    if (direction.equals(Vector2.right())) {
      this.scale.x = 1;
    }
  }

  public attack(direction: Vector2) {
    const [hold, walk, attack, hurt] = this.children as PIXI.AnimatedSprite[];
    hold.visible = false;
    walk.visible = false;
    attack.visible = true;
    hurt.visible = false;

    this._geometryPosition.combine(direction);
    attack.play();
  }

  public hurt() {
    const [hold, walk, attack, hurt] = this.children as PIXI.AnimatedSprite[];
    hold.visible = false;
    walk.visible = false;
    attack.visible = false;
    hurt.visible = true;

    hurt.play();
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
    attack.visible = false;
    hurt.visible = false;

    const duringSecond = 0.5;
    const speed = 1 / (duringSecond / (4 / 60));
    console.log(speed);

    hold.animationSpeed = speed;
    walk.animationSpeed = speed;
    attack.animationSpeed = speed;
    hurt.animationSpeed = speed;

    hold.anchor.set(0.5, 0.5);
    walk.anchor.set(0.5, 0.5);
    attack.anchor.set(0.5, 0.5);
    hurt.anchor.set(0.5, 0.5);

    this.addChild(hold, walk, attack, hurt);
  }
}
