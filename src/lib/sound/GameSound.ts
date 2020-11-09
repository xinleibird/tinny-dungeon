import sound from 'pixi-sound';
import { Loader } from '../system';

interface ListTypes {
  [name: string]: sound.Sound;
}
export default class GameSound {
  private static _list: ListTypes = {};
  public static play(name: string, volume = 0.05, loop = false, durations?: number) {
    const sound = Loader.sounds.effects[name];

    sound.volume = volume;
    sound.loop = loop;
    sound.play();
    this._list[name] = sound;

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

  public static get(name: string, volume = 0.05, loop = false) {
    const sound = Loader.sounds.effects[name];

    sound.volume = volume;
    sound.loop = loop;

    return sound;
  }
}
