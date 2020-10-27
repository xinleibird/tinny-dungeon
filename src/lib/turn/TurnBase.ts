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

  private constructor() {}

  public async next() {
    const cur = this._queue?.[this._current];
    if (cur.time === this._time) {
      cur.life -= 1;
      await cur?.occur();
    }
    this._current += 1;
  }

  public async tickPromiseAll() {
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

  public async tickTurnAll() {
    while (this.hasNext()) {
      await this.next();
    }
  }

  public add(event: TurnEvent | TurnEvent[]) {
    if (event instanceof TurnEvent) {
      event.time += this._time;
      this._queue.push(event);
    }

    if (Array.isArray(event)) {
      for (const evt of event) {
        evt.time += this._time;
        this._queue.push(evt);
      }
    }
  }

  public get queue() {
    return this._queue;
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
