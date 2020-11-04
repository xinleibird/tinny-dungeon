import { sound } from 'pixi.js';
import { Loader } from '../system';

export enum ALBUM {
  MAIN,
  TITLE,
}
export default class GameMusic {
  private static _instance: GameMusic;
  public static getInstance() {
    if (!this._instance) {
      this._instance = new GameMusic();
    }
    return this._instance;
  }

  public static play(name: ALBUM = ALBUM.MAIN, volume = 0.02, loop = true) {
    const instance = this.getInstance();
    instance._title.volume = volume;
    instance._main.volume = volume;
    switch (name) {
      case ALBUM.MAIN:
        instance._title.stop();
        instance._main.play();
        break;
      case ALBUM.TITLE:
        instance._title.play();
        instance._main.stop();
        break;

      default:
        break;
    }
  }

  private _main: sound.Sound;
  private _title: sound.Sound;

  private constructor() {
    this._main = Loader.sounds.musics.main;
    this._title = Loader.sounds.musics.title;
  }
}
