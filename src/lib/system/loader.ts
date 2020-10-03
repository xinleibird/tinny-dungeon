import * as PIXI from 'pixi.js';
import { CHARACTER_TYPES, PLAYER_TYPES, CHARACTER_ANIMATION_TYPES } from '../character';
import { emitter, RESOURCE_EVENTS } from './events';

const loader = PIXI.Loader.shared;

type CharactersTextures = {
  [key in keyof typeof PLAYER_TYPES]?: {
    [key in keyof typeof CHARACTER_ANIMATION_TYPES]?: PIXI.Texture[];
    // [key: string]: any;
  };
} & {
  DOORS?: PIXI.Texture[];
};

export default class Loader {
  public static resources: PIXI.IResourceDictionary;
  public static textures: CharactersTextures;
  public static tileset: PIXI.Texture[];

  public static load() {
    loader.add('assets/tiles/tileset.json');
    loader.add('assets/tiles/doors.json');
    loader.add('assets/sprites/knight_m.json');

    loader.load((loader, resources) => {
      this.resources = resources;
    });

    loader.onComplete.add(() => {
      this.tileset = [];
      for (let i = 0; i < 48; i++) {
        const texture = PIXI.Texture.from(`tileset_${i}`);
        this.tileset.push(texture);
      }

      this.textures = { DOORS: [] };

      for (let i = 0; i < 4; i++) {
        const texture = PIXI.Texture.from(`doors_${i}`);
        this.textures.DOORS.push(texture);
      }

      Object.keys(CHARACTER_TYPES).forEach((character) => {
        this.textures[character] = {
          [CHARACTER_ANIMATION_TYPES.HOLD]: [],
          [CHARACTER_ANIMATION_TYPES.WALK]: [],
          [CHARACTER_ANIMATION_TYPES.ATTACK]: [],
          [CHARACTER_ANIMATION_TYPES.HURT]: [],
        };

        const frameName = character.toString().toLowerCase();
        for (let i = 0; i < 4; i++) {
          const texture = PIXI.Texture.from(`${frameName}_${i}`);
          this.textures[character][CHARACTER_ANIMATION_TYPES.HOLD].push(texture);
        }

        for (let i = 4; i < 8; i++) {
          const texture = PIXI.Texture.from(`${frameName}_${i}`);
          this.textures[character][CHARACTER_ANIMATION_TYPES.WALK].push(texture);
        }

        for (let i = 3; i < 9; i++) {
          if (i === 3 || i === 4 || i === 5 || i === 8) {
            const texture = PIXI.Texture.from(`${frameName}_${i}`);
            this.textures[character][CHARACTER_ANIMATION_TYPES.ATTACK].push(texture);
          }
        }

        for (let i = 0; i < 9; i++) {
          if (i === 0 || i === 4 || i === 7 || i === 8) {
            const texture = PIXI.Texture.from(`${frameName}_${i}`);
            this.textures[character][CHARACTER_ANIMATION_TYPES.HURT].push(texture);
          }
        }
      });

      emitter.emit(RESOURCE_EVENTS.RESOURCES_LOADED);
    });

    loader.onError.add(() => {});

    loader.onProgress.add((e) => {});

    loader.onLoad.add(() => {});
  }
}
