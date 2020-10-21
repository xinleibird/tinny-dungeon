import { Groupable } from '../abstraction';
import StaticSystem from '../core/static';
import { initialize2DArray } from '../utils';
import Character from './character';

export default class CharacterGroup extends Groupable {
  private _characters: Character[][];

  public constructor(width: number, height: number) {
    super(width, height);
    this._characters = initialize2DArray(width, height, null);

    StaticSystem.registCharacterGroup(this);
  }

  public setCharacter(x: number, y: number, character: Character) {
    this._characters[y][x] = character;
  }

  public getCharacter(x: number, y: number) {
    return this._characters[y][x];
  }
}
