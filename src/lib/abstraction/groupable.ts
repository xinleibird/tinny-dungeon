export default abstract class Groupable {
  protected _width: number;
  protected _height: number;

  protected constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
  }

  public get width() {
    return this._width;
  }

  public get height() {
    return this._height;
  }

  public forLoop(fb: (x: number, y: number) => void) {
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        fb(x, y);
      }
    }
  }
}
