import * as PIXI from 'pixi.js';
import { Renderable } from '../abstraction';
import { SPRITE_OPTIONS } from '../config';
import { Control, StaticSystem } from '../core';
import { Vector2 } from '../geometry';
import { Ability, ABILITY_NAMES, ABILITY_STATUS, Hurtable, Passable } from '../object/ability';
import { Attacking, Behavior, Movement, Opening } from '../object/behavior';
import { BEHAVIOR_NAMES } from '../object/behavior/Behavior';
import { DirectionIndicator, External } from '../object/external';
import DamageIndicator from '../object/external/DamageIndicator';
import { EXTERNAL_NAMES } from '../object/external/External';
import { Strategy } from '../object/strategy';
import { GameSound } from '../sound';
import { Loader } from '../system';
import { TurnBase } from '../turn';
import CharacterClass from './CharacterClass';
import Intelligence from './Intelligence';

const { SPRITE_OFFSET_X, SPRITE_OFFSET_Y, SPRITE_SIZE } = SPRITE_OPTIONS;

export enum PLAYER_TYPES {
  KNIGHT_M = 'knight_m',
}

export enum NONPLAYER_TYPES {
  SKELETON = 'skeleton',
  BAT = 'bat',
}

export const CHARACTER_CATEGORIES = {
  ...PLAYER_TYPES,
  ...NONPLAYER_TYPES,
};

export enum CHARACTER_TYPES {
  PLAYER = 'player',
  NON_PLAYER = 'nonPlayer',
}

export enum CHARACTER_ANIMATIONS {
  HOLD = 'hold',
  WALK = 'walk',
  ATTACK = 'attack',
  HURT = 'hurt',
  DODGE = 'dodge',
  DIE = 'die',
}

export default abstract class Character extends Renderable {
  protected _type: PLAYER_TYPES | NONPLAYER_TYPES;
  protected _direction: Vector2 = Vector2.down;
  protected _rendering: PIXI.Container;
  protected _geometryPosition: Vector2;
  protected _lastGeometryPosition: Vector2;

  protected _stepSound: PIXI.sound.Sound;
  protected _attackSound: PIXI.sound.Sound;
  protected _damageSound: PIXI.sound.Sound;
  protected _dodgeSound: PIXI.sound.Sound;

  protected _externals: External[] = [];
  protected _class: CharacterClass;

  protected _behaviors: Behavior[] = [];
  protected _abilities: Ability[] = [];

  protected _intelligence: Intelligence;

  private _inTick = false;
  private _turnBase: TurnBase;

  private _alive = true;

  protected constructor(type: PLAYER_TYPES | NONPLAYER_TYPES) {
    super();
    this._type = type;
    this._rendering = new PIXI.Container();

    this._geometryPosition = new Vector2();
    this._lastGeometryPosition = null;

    this._intelligence = new Intelligence(this);

    this.initialize(type);
    this.registBehaviors();
    this.registAbilities();
    this.registSound();
    this.registExternals();

    Control.regist(this);
    this._turnBase = Control.turnBase;

    StaticSystem.renderer.add(this);
    StaticSystem.entityGroup.setCharacter(Vector2.center, this);

    // zIndex for characters view depth
    PIXI.Ticker.shared.add(() => {
      if (this._alive) {
        this._rendering.zIndex = this.geometryPosition.y;
      }
    });
  }

  public get alive() {
    return this._alive;
  }

  public decide() {
    this._intelligence.decide();
  }

  public setStrategy(strategy: Strategy) {
    this._intelligence.strategy = strategy;
  }

  public get class() {
    return this._class;
  }

  public set strategy(strategy: Strategy) {
    this._intelligence.strategy = strategy;
  }

  public get strategy() {
    return this._intelligence.strategy;
  }

  public get turnBase() {
    return this._turnBase;
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

  public get damageSound() {
    return this._damageSound;
  }

  public get dodgeSound() {
    return this._dodgeSound;
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
    this._rendering.addChild(external.rendering);
  }

  public showExternal(externalName?: EXTERNAL_NAMES) {
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

  public getExternal(externalName: EXTERNAL_NAMES) {
    for (const ex of this._externals) {
      if (ex.name === externalName) {
        return ex;
      }
    }
    return undefined;
  }

  public hideExternal(externalName?: EXTERNAL_NAMES) {
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
    const entityGroup = StaticSystem.entityGroup;
    entityGroup.setCharacter(geometryPosition, this);
    entityGroup.setCharacter(this._geometryPosition, null);

    const { x, y } = geometryPosition;
    this._rendering.position.set(
      x * SPRITE_SIZE + SPRITE_OFFSET_X,
      y * SPRITE_SIZE + SPRITE_OFFSET_Y
    );

    this._geometryPosition = geometryPosition;

    this.abilities.forEach((abi) => {
      abi.geometryPosition = geometryPosition;
    });
  }

  public get geometryPosition() {
    return this._geometryPosition;
  }

  public hold() {
    const [
      holdShadow,
      hold,
      walkShadow,
      walk,
      attackShadow,
      attack,
      hurtShadow,
      hurt,
      dodgeShadow,
      dodge,
      dieShadow,
      die,
    ] = this._rendering.children as PIXI.AnimatedSprite[];

    holdShadow.visible = true;
    hold.visible = true;
    walkShadow.visible = false;
    walk.visible = false;
    attackShadow.visible = false;
    attack.visible = false;
    hurtShadow.visible = false;
    hurt.visible = false;
    dodgeShadow.visible = false;
    dodge.visible = false;
    dieShadow.visible = false;
    die.visible = false;

    holdShadow.play();
    hold.play();

    this.hideExternal(EXTERNAL_NAMES.DIRECTION_INDICATOR);
  }

  public walk(direction: Vector2) {
    const [
      holdShadow,
      hold,
      walkShadow,
      walk,
      attackShadow,
      attack,
      hurtShadow,
      hurt,
      dodgeShadow,
      dodge,
      dieShadow,
      die,
    ] = this._rendering.children as PIXI.AnimatedSprite[];

    holdShadow.visible = false;
    hold.visible = false;
    walkShadow.visible = true;
    walk.visible = true;
    attackShadow.visible = false;
    attack.visible = false;
    hurtShadow.visible = false;
    hurt.visible = false;
    dodgeShadow.visible = false;
    dodge.visible = false;
    dieShadow.visible = false;
    die.visible = false;

    walkShadow.play();
    walk.play();

    hurt.gotoAndPlay(0);

    hurt.onComplete = () => {
      if (this._alive) {
        this.hold();
      }
    };
  }

  public attack(direction: Vector2) {
    const [
      holdShadow,
      hold,
      walkShadow,
      walk,
      attackShadow,
      attack,
      hurtShadow,
      hurt,
      dodgeShadow,
      dodge,
      dieShadow,
      die,
    ] = this._rendering.children as PIXI.AnimatedSprite[];

    holdShadow.visible = false;
    hold.visible = false;
    walkShadow.visible = false;
    walk.visible = false;
    attackShadow.visible = true;
    attack.visible = true;
    hurtShadow.visible = false;
    hurt.visible = false;
    dodgeShadow.visible = false;
    dodge.visible = false;
    dieShadow.visible = false;
    die.visible = false;

    attackShadow.gotoAndPlay(0);
    attack.gotoAndPlay(0);

    attack.onComplete = () => {
      if (this._alive) {
        this.hold();
      }
    };
  }

  public hurt() {
    const [
      holdShadow,
      hold,
      walkShadow,
      walk,
      attackShadow,
      attack,
      hurtShadow,
      hurt,
      dodgeShadow,
      dodge,
      dieShadow,
      die,
    ] = this._rendering.children as PIXI.AnimatedSprite[];

    holdShadow.visible = false;
    hold.visible = false;
    walkShadow.visible = false;
    walk.visible = false;
    attackShadow.visible = false;
    attack.visible = false;
    hurtShadow.visible = true;
    hurt.visible = true;
    dodgeShadow.visible = false;
    dodge.visible = false;
    dieShadow.visible = false;
    die.visible = false;

    hurtShadow.gotoAndPlay(0);
    hurt.gotoAndPlay(0);

    hurt.onComplete = () => {
      if (this._alive) {
        this.hold();
      }
    };
  }

  public dodge() {
    const [
      holdShadow,
      hold,
      walkShadow,
      walk,
      attackShadow,
      attack,
      hurtShadow,
      hurt,
      dodgeShadow,
      dodge,
      dieShadow,
      die,
    ] = this._rendering.children as PIXI.AnimatedSprite[];

    holdShadow.visible = false;
    hold.visible = false;
    walkShadow.visible = false;
    walk.visible = false;
    attackShadow.visible = false;
    attack.visible = false;
    hurtShadow.visible = false;
    hurt.visible = false;
    dodgeShadow.visible = true;
    dodge.visible = true;
    dieShadow.visible = false;
    die.visible = false;

    dodgeShadow.gotoAndPlay(0);
    dodge.gotoAndPlay(0);

    dodge.onComplete = () => {
      if (this._alive) {
        this.hold();
      }
    };
  }

  public die() {
    const [
      holdShadow,
      hold,
      walkShadow,
      walk,
      attackShadow,
      attack,
      hurtShadow,
      hurt,
      dodgeShadow,
      dodge,
      dieShadow,
      die,
    ] = this._rendering.children as PIXI.AnimatedSprite[];

    holdShadow.visible = false;
    hold.visible = false;
    walkShadow.visible = false;
    walk.visible = false;
    attackShadow.visible = false;
    attack.visible = false;
    hurtShadow.visible = false;
    hurt.visible = false;
    dodgeShadow.visible = false;
    dodge.visible = false;
    dieShadow.visible = true;
    die.visible = true;

    dieShadow.play();
    die.play();

    die.onComplete = () => {
      dieShadow.alpha = 0;
    };
  }

  public damageHP(damage: number) {
    const currentHP = this._class.damageHP(damage);

    if (currentHP <= 0) {
      this.die();
      this.setDie();
      this._alive = false;
      this._rendering.zIndex = -1;
    }
  }

  public canBehave(direction: Vector2) {
    if (this._alive) {
      this.direction = direction;
    }

    for (const behavior of this._behaviors) {
      if (behavior.canDo(direction)) {
        return true;
      }
    }

    return false;
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
    }

    if (direction.equals(Vector2.right)) {
      this._rendering.scale.x = 1;
    }
  }

  protected hide() {
    this._rendering.visible = false;
  }

  protected show() {
    this._rendering.visible = true;
  }

  private setDie() {
    this._behaviors = this._behaviors.filter((behavior) => {
      return (
        behavior.name !== BEHAVIOR_NAMES.ATTACKING &&
        behavior.name !== BEHAVIOR_NAMES.MOVEMENT &&
        behavior.name !== BEHAVIOR_NAMES.OPENING
      );
    });

    this._abilities.forEach((abi) => {
      if (abi.name === ABILITY_NAMES.HURTABLE) {
        abi.status = ABILITY_STATUS.NOHURT;
      }

      if (abi.name === ABILITY_NAMES.PASSABLE) {
        abi.status = ABILITY_STATUS.PASS;
      }
    });
  }

  private initialize(type: PLAYER_TYPES | NONPLAYER_TYPES) {
    const character = type.toString().toUpperCase();

    const holdBatch = Loader.textures[character][CHARACTER_ANIMATIONS.HOLD];
    const walkBatch = Loader.textures[character][CHARACTER_ANIMATIONS.WALK];
    const attackBatch = Loader.textures[character][CHARACTER_ANIMATIONS.ATTACK];
    const hurtBatch = Loader.textures[character][CHARACTER_ANIMATIONS.HURT];
    const dodgeBatch = Loader.textures[character][CHARACTER_ANIMATIONS.DODGE];
    const dieBatch = Loader.textures[character][CHARACTER_ANIMATIONS.DIE];

    const hold = new PIXI.AnimatedSprite(holdBatch);
    const walk = new PIXI.AnimatedSprite(walkBatch);
    const attack = new PIXI.AnimatedSprite(attackBatch);
    const hurt = new PIXI.AnimatedSprite(hurtBatch);
    const dodge = new PIXI.AnimatedSprite(dodgeBatch);
    const die = new PIXI.AnimatedSprite(dieBatch);

    const holdShadow = new PIXI.AnimatedSprite(holdBatch);
    const walkShadow = new PIXI.AnimatedSprite(walkBatch);
    const attackShadow = new PIXI.AnimatedSprite(attackBatch);
    const hurtShadow = new PIXI.AnimatedSprite(hurtBatch);
    const dodgeShadow = new PIXI.AnimatedSprite(dodgeBatch);
    const dieShadow = new PIXI.AnimatedSprite(dieBatch);

    holdShadow.visible = true;
    walkShadow.visible = false;
    attackShadow.visible = false;
    hurtShadow.visible = false;
    dodgeShadow.visible = false;
    dieShadow.visible = false;

    hold.visible = true;
    walk.visible = false;
    attack.visible = false;
    hurt.visible = false;
    dodge.visible = false;
    die.visible = false;

    hurt.tint = 0xda4e38;

    holdShadow.tint = 0x000000;
    walkShadow.tint = 0x000000;
    attackShadow.tint = 0x000000;
    hurtShadow.tint = 0x000000;
    dodgeShadow.tint = 0x000000;
    dieShadow.tint = 0x000000;

    holdShadow.position.y = -5;
    walkShadow.position.y = -5;
    attackShadow.position.y = -5;
    hurtShadow.position.y = -5;
    dodgeShadow.position.y = -5;
    dieShadow.position.y = -5;

    holdShadow.alpha = 0.5;
    walkShadow.alpha = 0.5;
    attackShadow.alpha = 0.5;
    hurtShadow.alpha = 0.5;
    dodgeShadow.alpha = 0.5;
    dieShadow.alpha = 0.5;

    attack.loop = false;
    hurt.loop = false;
    dodge.loop = false;
    die.loop = false;

    attackShadow.loop = false;
    hurtShadow.loop = false;
    dodgeShadow.loop = false;
    dieShadow.loop = false;

    hold.animationSpeed = 0.133;
    walk.animationSpeed = 0.188;
    attack.animationSpeed = 0.3;
    hurt.animationSpeed = 0.2;
    dodge.animationSpeed = 0.2;
    die.animationSpeed = 0.1;

    holdShadow.animationSpeed = 0.133;
    walkShadow.animationSpeed = 0.188;
    attackShadow.animationSpeed = 0.3;
    hurtShadow.animationSpeed = 0.2;
    dodgeShadow.animationSpeed = 0.2;
    dieShadow.animationSpeed = 0.1;

    hold.anchor.set(0.5, 0.5);
    walk.anchor.set(0.5, 0.5);
    attack.anchor.set(0.5, 0.5);
    hurt.anchor.set(0.5, 0.5);
    dodge.anchor.set(0.5, 0.5);
    die.anchor.set(0.5, 0.5);

    holdShadow.anchor.set(0.5, 0.5);
    walkShadow.anchor.set(0.5, 0.5);
    attackShadow.anchor.set(0.5, 0.5);
    hurtShadow.anchor.set(0.5, 0.5);
    dodgeShadow.anchor.set(0.5, 0.5);
    dieShadow.anchor.set(0.5, 0.5);

    // default play HOLD animation
    hold.play();
    holdShadow.play();

    // prepare character's animations
    this._rendering.addChild(
      holdShadow,
      hold,
      walkShadow,
      walk,
      attackShadow,
      attack,
      hurtShadow,
      hurt,
      dodgeShadow,
      dodge,
      dieShadow,
      die
    );

    this.geometryPosition = this._geometryPosition;
  }

  private registExternals() {
    const directionIndicator = new DirectionIndicator();
    directionIndicator.direction = this.direction;
    this.addExternal(directionIndicator);

    const damageIndicator = new DamageIndicator();
    this.addExternal(damageIndicator);
  }

  private registBehaviors() {
    const movement = new Movement(this);
    const opening = new Opening(this);
    const attacting = new Attacking(this);
    this._behaviors.push(opening, attacting, movement);
  }

  private registAbilities() {
    const passable = new Passable(this, ABILITY_STATUS.STOP);
    const hurtable = new Hurtable(this);
    this._abilities.push(passable, hurtable);
  }

  private registSound() {
    this._damageSound = GameSound.get('damage');
    this._dodgeSound = GameSound.get('dodge');
  }
}
