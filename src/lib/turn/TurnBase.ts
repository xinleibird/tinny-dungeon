import TurnEvent from './TurnEvent';

export default class TurnBase {
  private static _instance: TurnBase;

  public static getInstance() {
    if (!this._instance) {
      this._instance = new TurnBase();
    }

    return this._instance;
  }

  private _queue: TurnEvent[] = [];
  private _current = 0;
  private _time = 0;
  private _length = 0;

  private constructor() {}

  public async next() {
    const cur = this._queue?.[this._current];
    if (cur.time === this._time) {
      cur.life -= 1;
      await cur?.occur();
    }
    this._current += 1;
  }

  public async tickAll() {
    const tmp = [];
    this._queue.forEach((e) => {
      const cur = this._queue?.[this._current];
      if (cur.time === this._time) {
        cur.life -= 1;
        tmp.push(cur?.occur());
      }
      this._current += 1;
    });
    await Promise.all(tmp);
  }

  public add(event: TurnEvent, time = event.time) {
    event.time = this._time + time;
    this._queue.push(event);
    this._length += 1;
  }

  public get time() {
    return this._time;
  }

  public clear() {
    this._queue = this._queue.filter((e) => {
      return e.life > 0 && e.time > this._time;
    });
    this._current = 0;
    this._time += 1;
  }

  public hasNext() {
    for (let i = this._current; i < this._queue.length; i++) {
      if (this._queue?.[i].time === this._time) {
        return true;
      }
    }
    return false;
  }
}
