import { utils } from 'pixi.js';

const { EventEmitter } = utils;

export enum GAME_EVENTS {
  GAME_START = 'game_start',
  GAME_PLAY = 'game_play',
  GAME_OVER = 'game_over',
  SCENE_START = 'scene_start',
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

export enum GAME_EVENTS {
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

export const Emitter = new EventEmitter();
