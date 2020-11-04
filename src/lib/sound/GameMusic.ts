import sound from 'pixi-sound';
import { Loader } from '../system';

export enum MUSIC_ALBUM {
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

  public static play(name: MUSIC_ALBUM = MUSIC_ALBUM.MAIN, volume = 0.02, loop = true) {
    const instance = this.getInstance();
    instance._title.volume = volume;
    instance._main.volume = volume;
    instance._title.loop = loop;
    instance._main.loop = loop;
    switch (name) {
      case MUSIC_ALBUM.MAIN: {
        instance._title.stop();
        instance._main.play();
        break;
      }
      case MUSIC_ALBUM.TITLE: {
        instance._title.play();
        instance._main.stop();
        break;
      }

      default:
        break;
    }
  }

  private _main: sound.Sound;
  private _title: sound.Sound;

  private constructor() {
    this._main = Loader.sounds.musics.main;
    this._title = Loader.sounds.musics.title;
    // this._main.stop();
    // this._title.stop();
    this._main.loop = true;
    this._title.loop = true;
    // sound.Sound.from({
    //   url: 'assets/sounds/musics/平坡の道.mp3',
    //   preload: true,
    //   loaded: (e, r) => {
    //     this._main = r;
    //   },
    // });
    // sound.Sound.from({
    //   url: 'assets/sounds/musics/first-story.ogg',
    //   preload: true,
    //   loaded: (e, r) => {
    //     this._title = r;
    //   },
    // });
  }
}
