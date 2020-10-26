import { Character } from '../../character';
import Strategy from './Strategy';

export default class Disalbe extends Strategy {
  public constructor(self: Character, target?: Character) {
    super(self, target);
  }
  public execute() {
    return [];
  }
}
