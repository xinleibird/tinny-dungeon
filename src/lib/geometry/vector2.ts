export class Vector2 {
  public static merge(v1: Vector2, v2: Vector2) {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }

  public static get left() {
    return new Vector2(-1, 0);
  }

  public static get right() {
    return new Vector2(1, 0);
  }

  public static get up() {
    return new Vector2(0, -1);
  }

  public static get down() {
    return new Vector2(0, 1);
  }

  public static get center() {
    return new Vector2(0, 0);
  }

  public static equals(v1: Vector2, v2: Vector2) {
    return v1.x === v2.x && v1.y === v2.y;
  }
  public static manhattan(v1: Vector2, v2: Vector2) {
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;

    return Math.abs(dx) + Math.abs(dy);
  }

  private _x = 0;
  private _y = 0;

  public constructor(x = 0, y = 0) {
    this._x = x;
    this._y = y;
  }

  public set(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public get x() {
    return this._x;
  }
  public set x(x: number) {
    this._x = x;
  }

  public get y() {
    return this._y;
  }

  public set y(y: number) {
    this._y = y;
  }

  public equals(another: Vector2) {
    return this._x === another.x && this._y === another.y;
  }

  public combine(another: Vector2) {
    this._x += another.x;
    this._y += another.y;
    return this;
  }

  public distance(another: Vector2) {
    const dx = another.x - this._x;
    const dy = another.y - this._y;

    return Math.abs(Math.sqrt(dx ** 2 + dy ** 2));
  }

  public manhattan(another: Vector2) {
    const dx = another.x - this._x;
    const dy = another.y - this._y;

    return Math.abs(dx) + Math.abs(dy);
  }
}
