import * as PIXI from 'pixi.js';

const { EventEmitter } = PIXI.utils;

export enum RESOURCE_EVENTS {
  RESOURCES_LOADED = 'resources_loaded',
}

export enum GAME_EVENTS {
  DOOR_OPEN = 'door_open',
  DOOR_CLOSE = 'door_close',
}

export const emitter = new EventEmitter();
