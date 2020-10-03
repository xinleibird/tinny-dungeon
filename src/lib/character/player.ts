import * as PIXI from 'pixi.js';

import { Vector2 } from '../geometry';
import Character, { PLAYER_TYPES } from './character';

// export enum PLAYER_TYPES {
//   KNIGHT_M = 'knight_m',
// }

// interface AnimationTypes {
//   hold: PIXI.AnimatedSprite;
//   walk: PIXI.AnimatedSprite;
//   attack: PIXI.AnimatedSprite;
//   hurt: PIXI.AnimatedSprite;
// }

export default class Player extends Character {
  // private _type: PLAYER_TYPES;
  // private _geometryPosition: Vector2;
  // private _offset: number;
  // private _animations: PIXI.AnimatedSprite;

  public constructor(x = 0, y = 0, type: PLAYER_TYPES) {
    super(x, y, type);
  }
  // public constructor(x = 0, y = 0, type = PLAYER_TYPES.KNIGHT_M) {
  //   super(x, y, type);
  //   // this._type = type;
  //   // this._geometryPosition = new Vector2();
  //   // this._offset = offset;

  //   // this.initialize();
  // }

  public hold() {
    // loader.load(() => {
    //   const [hold, walk, attack] = this.children as PIXI.AnimatedSprite[];
    //   hold.visible = true;
    //   walk.visible = false;
    //   attack.visible = false;
    //   hold.play();
    // });
  }

  public walk() {
    // const [hold, walk, attack] = this.children as PIXI.AnimatedSprite[];
    // hold.visible = false;
    // walk.visible = true;
    // attack.visible = false;
    // walk.play();
  }

  public attack() {}

  public hurt() {}

  // private initialize(animationSpeed = 0.2) {
  // loader.load(() => {
  //   this.loadAnimation(PLAYER_TYPES.KNIGHT_M, animationSpeed);
  // });
  // }

  // private loadAnimation(type: PLAYER_TYPES, animationSpeed: number) {
  //   const frameName = PLAYER_TYPES[type].toLowerCase();

  //   const holdAry = [];
  //   const walkAry = [];
  //   const attackAry = [];

  //   for (let i = 0; i < 4; i++) {
  //     const texture = PIXI.Texture.from(`${frameName}_${i}`);
  //     holdAry.push(texture);
  //   }

  //   for (let i = 4; i < 8; i++) {
  //     const texture = PIXI.Texture.from(`${frameName}_${i}`);
  //     walkAry.push(texture);
  //   }

  //   for (let i = 7; i < 9; i++) {
  //     const texture = PIXI.Texture.from(`${frameName}_${i}`);
  //     attackAry.push(texture);
  //   }

  //   const hold = new PIXI.AnimatedSprite(holdAry);
  //   const walk = new PIXI.AnimatedSprite(walkAry);
  //   const attack = new PIXI.AnimatedSprite(attackAry);

  //   // hold.scale.set(2);
  //   hold.anchor.y = 0.5;
  //   hold.position.x = 4 * this._offset;
  //   walk.anchor.y = 0.5;
  //   attack.anchor.y = 0.5;

  //   hold.animationSpeed = animationSpeed;
  //   walk.animationSpeed = animationSpeed;
  //   attack.animationSpeed = animationSpeed / 2;

  //   this.addChild(hold, walk, attack);
  // }

  public get type() {
    return this._type;
  }
}
