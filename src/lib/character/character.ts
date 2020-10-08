import gsap, { TweenMax } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import * as PIXI from 'pixi.js';

import { IPosition, Vector2 } from '../geometry';
import Entity from '../objects/entity';
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

  private _entities: Entity[][];
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

    const shadowFloorY = this._geometryPosition.y * 16 + this._spriteOffset.y * 2;
    const [filter] = this.filters;
    filter.uniforms.floorY = shadowFloorY;
  }

  public get geometryPosition() {
    return this._geometryPosition;
  }

  public get entities() {
    return this._entities;
  }

  public set entities(entities: Entity[][]) {
    this._entities = entities;
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

    gsap.to(this, {
      duration: 0.2,
      pixi: {
        x: x * 16 + this._spriteOffset.x,
        y: y * 16 + this._spriteOffset.y,
      },
      onStart: () => {
        walk.play();
      },
    });

    const shadowFloorY = this._geometryPosition.y * 16 + this._spriteOffset.y * 2;
    const [filter] = this.filters;
    filter.uniforms.floorY = shadowFloorY;
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

  protected get Entities() {
    return this.Entities;
  }

  protected changeDirection(direction: Vector2) {
    if (direction.equals(Vector2.left())) {
      this.scale.x = -1;
    }

    if (direction.equals(Vector2.right())) {
      this.scale.x = 1;
    }
  }

  private generateShadowFilter() {
    const shadowVertex = `
      attribute vec2 aVertexPosition;
      attribute vec2 aTextureCoord;

      uniform mat3 projectionMatrix;

      varying vec2 vTextureCoord;

      void main(void) {
          gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
          vTextureCoord = aTextureCoord;
      }
      `;

    const shadowFragment = `
      varying vec2 vTextureCoord;

      uniform sampler2D uSampler;
      uniform vec4 inputSize;
      uniform vec4 outputFrame;
      uniform vec2 shadowDirection;
      uniform float floorY;

      void main(void) {
          vec2 screenCoord = vTextureCoord * inputSize.xy + outputFrame.xy;
          vec2 shadow;

          float paramY = (screenCoord.y - floorY) / shadowDirection.y;
          shadow.y = paramY + floorY;
          shadow.x = screenCoord.x + paramY * shadowDirection.x;
          vec2 bodyFilterCoord = (shadow - outputFrame.xy) * inputSize.zw; // same as / inputSize.xy

          vec4 originalColor = texture2D(uSampler, vTextureCoord);
          vec4 shadowColor = texture2D(uSampler, bodyFilterCoord);
          shadowColor.rgb = vec3(0.0);
          shadowColor.a *= 0.4;

          gl_FragColor = originalColor + shadowColor * (1.0 - originalColor.a);
      }
      `;

    const filter = new PIXI.Filter(shadowVertex, shadowFragment);
    filter.uniforms.shadowDirection = [0.0, 1.2];
    const filterFloorY = this._geometryPosition.y * 16 + this._spriteOffset.y * 2;
    filter.uniforms.floorY = filterFloorY;

    filter.padding = 100;

    return filter;
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

    hold.visible = true;
    walk.visible = false;
    attack.visible = false;
    hurt.visible = false;

    const duringSecond = 0.5;
    const speed = 1 / (duringSecond / (4 / 60));

    hold.animationSpeed = speed;
    walk.animationSpeed = speed;
    attack.animationSpeed = speed;
    hurt.animationSpeed = speed;

    hold.anchor.set(0.5, 0.5);
    walk.anchor.set(0.5, 0.5);
    attack.anchor.set(0.5, 0.5);
    hurt.anchor.set(0.5, 0.5);

    hold.play();

    this.addChild(hold, walk, attack, hurt);

    const shadowFilter = this.generateShadowFilter();
    this.filters = [shadowFilter];
  }
}
