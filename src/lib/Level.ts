import * as ROT from 'rot-js';
import { NonPlayer, NONPLAYER_TYPES } from './character';
import { Dungeon, Scene } from './scene';
export default class Level {
  private _current = 0;
  private _sceneSize = 0;
  private _nonPlayers: NonPlayer[] = [];
  private _scene: Scene;

  public currentScene() {
    const maxSize = ~~(this._current / 10) * 5 + 30;
    this._sceneSize = maxSize < 75 ? maxSize : 75;
    this.generateScene();
    this.generateNonPlayers();
  }

  public nextScene() {
    this._current += 1;

    const maxSize = ~~(this._current / 10) * 5 + 30;
    this._sceneSize = maxSize < 75 ? maxSize : 75;
    this.generateScene();
    this.generateNonPlayers();
  }

  public generateScene() {
    this._scene = new Dungeon(this._sceneSize, this._sceneSize);
    return this._scene;
  }

  public generateNonPlayers() {
    this._nonPlayers = [];
    const nonPlayerNumber = ~~(this._sceneSize ** 2 / 150);
    const nonPlayerTypes = {
      [NONPLAYER_TYPES.BAT]: 1,
      [NONPLAYER_TYPES.SKELETON]: 2,
      [NONPLAYER_TYPES.SLIME]: 1,
    };

    for (let i = 0; i < nonPlayerNumber; i++) {
      const type = ROT.RNG.getWeightedValue(nonPlayerTypes);

      if (typeof type === 'string') {
        const key = Object.keys(NONPLAYER_TYPES).filter((k) => {
          return NONPLAYER_TYPES[k] === type;
        });
        this._nonPlayers.push(new NonPlayer(key[0] as NONPLAYER_TYPES));
      }
    }
    return this._nonPlayers;
  }

  public get current() {
    return this._current;
  }

  public get scene() {
    return this._scene;
  }

  public get nonPlayers() {
    return this._nonPlayers;
  }
}
