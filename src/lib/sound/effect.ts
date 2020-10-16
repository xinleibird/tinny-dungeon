import { Loader } from '../system';

export default class SoundEffect {
  public static play(name: string, volume = 0.05, loop = false) {
    const sound = Loader.sounds.effects[name];

    sound.volume = volume;
    sound.loop = loop;
    sound.play();
  }

  public static get(name: string, volume = 0.05, loop = false) {
    const sound = Loader.sounds.effects[name];

    sound.volume = volume;
    sound.loop = loop;

    return sound;
  }
}
