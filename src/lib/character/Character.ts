import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import * as PIXI from 'pixi.js';
import { Renderable } from '../abstraction';
import { SPRITE_OPTIONS } from '../config';
import { Control, StaticSystem } from '../core';
import { Vector2 } from '../geometry';
import { Ability, ABILITY_NAMES, ABILITY_STATUS, Hurtable, Passable } from '../object/ability';
import { Attacking, Behavior, Movement, Opening } from '../object/behavior';
import { DirectionIndicator, External } from '../object/external';
import { Loader } from '../system';

const { SPRITE_OFFSET_X, SPRITE_OFFSET_Y, SPRITE_SIZE } = SPRITE_OPTIONS;

export enum PLAYER_TYPES {
  KNIGHT_M = 'knight_m',
}

export enum NONPLAYER_TYPES {
  SKELETON = 'skeleton',
}

export const CHARACTER_CATEGORIES = {
  ...PLAYER_TYPES,
  ...NONPLAYER_TYPES,
};

export enum CHARACTER_ANIMATIONS {
  HOLD = 'hold',
  WALK = 'walk',
  ATTACK = 'attack',
  HURT = 'hurt',
}

export default abstract class Character extends Renderable {
  protected _type: PLAYER_TYPES | NONPLAYER_TYPES;
  protected _direction: Vector2 = Vector2.down;
  protected _rendering: PIXI.Container;
  protected _geometryPosition: Vector2;
  protected _lastGeometryPosition: Vector2;

  protected _stepSound: PIXI.sound.Sound;
  protected _attackSound: PIXI.sound.Sound;

  protected _externals: External[] = [];
  protected _internals: External[] = [];

  protected _behaviors: Behavior[] = [];
  protected _abilities: Ability[] = [];

  private _inTick = false;

  protected constructor(type: PLAYER_TYPES | NONPLAYER_TYPES) {
    super();
    this._type = type;
    this._rendering = new PIXI.Container();

    this._geometryPosition = new Vector2();
    this._lastGeometryPosition = null;

    this.initialize(type);
    this.registBehaviors();
    this.registAbilities();
    this.registShadowFilter();

    Control.regist(this);
    StaticSystem.renderer.add(this);
    StaticSystem.characterGroup.setCharacter(0, 0, this);

    // zIndex for characters view depth
    PIXI.Ticker.shared.add(() => {
      this._rendering.zIndex = this.geometryPosition.y;
    });
  }

  public get rendering() {
    return this._rendering;
  }

  public get type() {
    return this._type;
  }

  public get stepSound() {
    return this._stepSound;
  }

  public get attackSound() {
    return this._attackSound;
  }

  public get abilities() {
    return this._abilities;
  }

  public hasAbility(name: ABILITY_NAMES) {
    for (const ability of this._abilities) {
      if (ability.name === name) {
        return true;
      }
    }
    return false;
  }

  public getAbility(name: ABILITY_NAMES) {
    for (const ability of this._abilities) {
      if (ability.name === name) {
        return ability;
      }
    }
    return undefined;
  }

  public addAbility(...ability: Ability[]) {
    for (const abi of ability) {
      if (!this.hasAbility(abi.name)) {
        this._abilities.push(...ability);
      }
    }
  }

  public addExternal(external: External) {
    this._externals.push(external);
    this._rendering.addChild(external.sprite);
  }

  public showExternal(externalName?: string) {
    if (!externalName) {
      this._externals.forEach((external) => {
        external.visiable = true;
      });
    } else {
      const externals = this._externals.filter((external) => {
        return external.name === externalName;
      });
      externals.forEach((external) => {
        external.visiable = true;
      });
    }
  }

  public hideExternal(externalName?: string) {
    if (!externalName) {
      this._externals.forEach((external) => {
        external.visiable = false;
      });
    } else {
      const externals = this._externals.filter((external) => {
        return external.name === externalName;
      });
      externals.forEach((external) => {
        external.visiable = false;
      });
    }
  }

  public get direction() {
    return this._direction;
  }

  public set direction(direction: Vector2) {
    if (!this._direction.equals(direction)) {
      this._direction = direction;
      this.changeSpriteDirection(direction);
    }

    this._externals.forEach((external) => {
      external.direction = direction;
    });
  }

  public get inTick() {
    return this._inTick;
  }

  public set inTick(contorl: boolean) {
    this._inTick = contorl;
  }

  public get isStay() {
    return this._geometryPosition.equals(this._lastGeometryPosition);
  }

  public get lastGeometryPosition() {
    return this._lastGeometryPosition;
  }

  public set lastGeometryPosition(getmetryPosition: Vector2) {
    this._lastGeometryPosition = getmetryPosition;
  }

  public set geometryPosition(geometryPosition: Vector2) {
    const { x, y } = this._geometryPosition;
    this._geometryPosition = geometryPosition;
    const { x: tarX, y: tarY } = geometryPosition;
    this._rendering.position.set(
      tarX * SPRITE_SIZE + SPRITE_OFFSET_X,
      tarY * SPRITE_SIZE + SPRITE_OFFSET_Y
    );

    const characterGroup = StaticSystem.characterGroup;
    characterGroup.setCharacter(tarX, tarY, this);
    characterGroup.setCharacter(x, y, null);

    this.abilities.forEach((abi) => {
      abi.geometryPosition = this._geometryPosition;
    });
  }

  public get geometryPosition() {
    return this._geometryPosition;
  }

  public hold() {
    const [hold, walk, attack, hurt] = this._rendering.children as PIXI.AnimatedSprite[];
    hold.visible = true;
    walk.visible = false;
    attack.visible = false;
    hurt.visible = false;

    hold.play();

    this.hideExternal();
  }

  public walk(direction: Vector2) {
    const [hold, walk, attack, hurt] = this._rendering.children as PIXI.AnimatedSprite[];
    hold.visible = false;
    walk.visible = true;
    attack.visible = false;
    hurt.visible = false;

    walk.gotoAndPlay(0);
    walk.onComplete = () => {
      this.hold();
    };
    // this.stepSound.play();
  }

  public attack(direction: Vector2) {
    const [hold, walk, attack, hurt] = this._rendering.children as PIXI.AnimatedSprite[];
    hold.visible = false;
    walk.visible = false;
    attack.visible = true;
    hurt.visible = false;

    attack.gotoAndPlay(0);
  }

  public hurt() {
    const [hold, walk, attack, hurt] = this._rendering.children as PIXI.AnimatedSprite[];
    hold.visible = false;
    walk.visible = false;
    attack.visible = false;
    hurt.visible = true;

    hurt.play();
    hurt.onComplete = () => {
      this.hold();
    };
  }

  public async rollBehaviors(direction: Vector2) {
    for (const behavior of this._behaviors) {
      if (behavior.canDo(direction)) {
        await behavior.do(direction);
        break;
      }
    }
  }

  protected changeSpriteDirection(direction: Vector2) {
    if (direction.equals(Vector2.left)) {
      this._rendering.scale.x = -1;
      const [hold, walk, attack, hurt] = this._rendering.children as PIXI.AnimatedSprite[];

      hold.anchor.set(0.5625, 0.5);
      walk.anchor.set(0.5625, 0.5);
      attack.anchor.set(0.5625, 0.5);
      hurt.anchor.set(0.5625, 0.5);
    }

    if (direction.equals(Vector2.right)) {
      this._rendering.scale.x = 1;
      const [hold, walk, attack, hurt] = this._rendering.children as PIXI.AnimatedSprite[];

      hold.anchor.set(0.5, 0.5);
      walk.anchor.set(0.5, 0.5);
      attack.anchor.set(0.5, 0.5);
      hurt.anchor.set(0.5, 0.5);
    }
  }

  protected hide() {}

  protected show() {}

  private initialize(type: PLAYER_TYPES | NONPLAYER_TYPES) {
    const character = type.toString().toUpperCase();

    const holdBatch = Loader.textures[character][CHARACTER_ANIMATIONS.HOLD];
    const walkBatch = Loader.textures[character][CHARACTER_ANIMATIONS.WALK];
    const attackBatch = Loader.textures[character][CHARACTER_ANIMATIONS.ATTACK];
    const hurtBatch = Loader.textures[character][CHARACTER_ANIMATIONS.HURT];

    const hold = new PIXI.AnimatedSprite(holdBatch);
    const walk = new PIXI.AnimatedSprite(walkBatch);
    const attack = new PIXI.AnimatedSprite(attackBatch);
    const hurt = new PIXI.AnimatedSprite(hurtBatch);

    hold.visible = true;
    walk.visible = false;
    attack.visible = false;
    hurt.visible = false;

    walk.loop = false;
    attack.loop = false;
    hurt.loop = false;

    hold.animationSpeed = 0.133;
    walk.animationSpeed = 0.188;
    attack.animationSpeed = 0.3;
    hurt.animationSpeed = 0.3;

    hurt.tint = 0xda4e38;

    hold.anchor.set(0.5, 0.5);
    walk.anchor.set(0.5, 0.5);
    attack.anchor.set(0.5, 0.5);
    hurt.anchor.set(0.5, 0.5);

    // default play HOLD animation
    hold.play();

    // prepare character's animations
    this._rendering.addChild(hold, walk, attack, hurt);
    const { x, y } = this._geometryPosition;
    this._rendering.position.set(x * 16 + SPRITE_OFFSET_X, y * 16 + SPRITE_OFFSET_Y);

    // external composition
    const directionIndicator = new DirectionIndicator();
    directionIndicator.direction = this.direction;
    this._externals.push(directionIndicator);
    this._rendering.addChild(directionIndicator.sprite);
  }

  private registShadowFilter() {
    this._rendering.filters = [
      new DropShadowFilter({
        blur: 0,
        distance: 5,
        alpha: 0.4,
        rotation: -90,
      }),
    ];
  }

  private registBehaviors() {
    const movement = new Movement(this);
    const opening = new Opening(this);
    const attacting = new Attacking(this);
    this._behaviors.push(opening, attacting, movement);
  }

  private registAbilities() {
    const passable = new Passable(this.geometryPosition, ABILITY_STATUS.STOP);
    const hurtable = new Hurtable(this.geometryPosition);
    this._abilities.push(passable, hurtable);
  }
}
