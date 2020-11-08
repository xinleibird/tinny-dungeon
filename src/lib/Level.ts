import { NonPlayer } from './character';

export default class Level {
  private _current = 0;
  private _sceneSize: { width: number; height: number } = { width: 0, height: 0 };
  private _nonPlayers: NonPlayer[] = [];
  private _nonPlayerNumber = 0;

  public next() {
    this._current += 1;
  }
}
