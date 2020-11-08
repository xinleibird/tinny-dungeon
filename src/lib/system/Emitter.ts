import * as PIXI from 'pixi.js';

export enum GAME_EVENTS {
  NULL = 'null',
  GAME_TITLE = 'game_title',
  GAME_OVER = 'game_over',
  GAME_RESTART = 'game_restart',
  SCENE_START = 'scene_start',
  SCENE_RUNNING = 'scene_running',
  SCENE_CLEAR = 'scene_clear',
  USER_NORMAL = 'user_normal',
  USER_LOW_HP = 'user_low_hp',
  USER_FIRING = 'user_firing',
  USER_POISONING = 'user_poisoning',
  USER_BLOODING = 'user_blooding',
  USER_DIE = 'user_die',
}

export enum RESOURCE_EVENTS {
  RESOURCES_LOADED = 'resources_loaded',
}

export enum KEY_EVENTS {
  KEY_DOWN = 'keyDown',
  KEY_UP = 'keyUp',
}

export enum JOY_EVENTS {
  JOY_DOWN = 'joyDown',
  JOY_UP = 'joyUp',
}

export default class Emitter extends PIXI.utils.EventEmitter {
  private static _instance: Emitter;

  public static getInstance() {
    if (!this._instance) {
      this._instance = new Emitter();
    }
    return this._instance;
  }

  public static get phase() {
    const instance = this.getInstance();
    return instance._phase;
  }

  public static on(event: string, fn: Function, ctx?: any) {
    const instance = this.getInstance();
    instance.on(event, fn, ctx);
  }

  public static emit(event: string, ...args: any[]) {
    const instance = this.getInstance();
    instance.emit(event, ...args);

    const enumValues: string[] = Object.values(GAME_EVENTS);

    if (enumValues.includes(event)) {
      instance._phase = event as GAME_EVENTS;
    }
  }

  public static removeListener(event: string, fn: Function, ctx?: any, once?: boolean) {
    const instance = this.getInstance();
    instance.removeListener(event, fn, ctx, once);
  }

  public get phase() {
    return this._phase;
  }

  private _phase: GAME_EVENTS = GAME_EVENTS.NULL;

  private constructor() {
    super();
  }
}
