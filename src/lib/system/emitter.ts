import { utils } from 'pixi.js';

const { EventEmitter } = utils;

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

export const emitter = new EventEmitter();
