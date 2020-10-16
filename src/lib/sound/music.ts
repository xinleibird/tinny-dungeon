import { Loader } from '../system';

export default class Music {
  public static play(name: string, volume = 0.05, loop = true) {
    const music = Loader.sounds.musics[name];
    music.volume = volume;
    music.loop = loop;
    music.play();
  }

  public static get(name: string, volume = 0.05, loop = true) {
    const music = Loader.sounds.musics[name];
    music.volume = volume;
    music.loop = loop;

    return music;
  }
}
