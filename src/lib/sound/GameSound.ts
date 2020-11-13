import sound from 'pixi-sound';
import { Loader } from '../system';

interface ListTypes {
  [name: string]: sound.Sound;
}
export default class GameSound {
  private static _list: ListTypes = {};

  public static play(name: string, volume = 0.05, loop = false, durations?: number) {
    let sound = null as sound.Sound;
    if (this._list['name']) {
      sound = this._list['name'];
    } else {
      sound = Loader.sounds.effects[name];
    }

    sound.volume = volume;
    sound.loop = loop;
    this._list[name] = sound;

    if (!sound.isPlaying) {
      sound.play();
    }

    if (durations) {
      setTimeout(() => {
        sound.stop();
      }, durations);
    }
  }

  public static stop(name: string) {
    if (name in this._list) {
      this._list[name].stop();
    }
  }

  public static stopAll() {
    for (const name in this._list) {
      if (Object.prototype.hasOwnProperty.call(this._list, name)) {
        const sound = this._list[name];
        sound.stop();
      }
    }
  }

  public static get(name: string, volume = 0.05, loop = false) {
    const sound = Loader.sounds.effects[name];

    sound.volume = volume;
    sound.loop = loop;

    return sound;
  }
}
