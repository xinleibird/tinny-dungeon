import sound from 'pixi-sound';
import * as PIXI from 'pixi.js';

import { CHARACTER_ANIMATION_TYPES, CHARACTER_TYPES, PLAYER_TYPES } from '../character';
import { emitter, RESOURCE_EVENTS } from './emitter';

const loader = PIXI.Loader.shared;

type TexturesTypes = {
  [key in keyof typeof PLAYER_TYPES]?: {
    [key in keyof typeof CHARACTER_ANIMATION_TYPES]?: PIXI.Texture[];
  };
} & {
  DOORS?: PIXI.Texture[];
  STAIRS?: PIXI.Texture[];
};

interface SoundTypes {
  musics?: {
    main?: sound.Sound;
  };
  effects?: {
    [key: string]: sound.Sound;
  };
}

export default class Loader {
  public static resources: PIXI.IResourceDictionary;
  public static textures: TexturesTypes;
  public static tileset: PIXI.Texture[];
  public static sounds: SoundTypes;

  public static load() {
    loader.add('assets/tiles/tileset.json');
    loader.add('assets/tiles/doors.json');
    loader.add('assets/tiles/stairs.json');
    loader.add('assets/sprites/knight_m.json');
    loader.add('main', 'assets/sounds/musics/平坡の道.mp3');

    loader.load((loader, resources) => {
      this.resources = resources;
      console.log(this.resources);
    });

    loader.onComplete.add(() => {
      this.tileset = [];
      for (let i = 0; i < 48; i++) {
        const texture = PIXI.Texture.from(`tileset_${i}`);
        this.tileset.push(texture);
      }

      this.textures = { DOORS: [], STAIRS: [] };
      for (let i = 0; i < 4; i++) {
        const texture = PIXI.Texture.from(`doors_${i}`);
        this.textures.DOORS.push(texture);
      }
      for (let i = 0; i < 2; i++) {
        const texture = PIXI.Texture.from(`stairs_${i}`);
        this.textures.STAIRS.push(texture);
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

        for (let i = 8; i < 12; i++) {
          const texture = PIXI.Texture.from(`${frameName}_${i}`);
          this.textures[character][CHARACTER_ANIMATION_TYPES.ATTACK].push(texture);
        }

        for (let i = 12; i < 15; i++) {
          const texture = PIXI.Texture.from(`${frameName}_${i}`);
          this.textures[character][CHARACTER_ANIMATION_TYPES.HURT].push(texture);
        }
      });

      this.sounds = { musics: {}, effects: {} };
      this.sounds.musics['main'] = sound.Sound.from(this.resources.main);

      emitter.emit(RESOURCE_EVENTS.RESOURCES_LOADED);
    });

    loader.onError.add(() => {});

    loader.onProgress.add((e) => {});

    loader.onLoad.add(() => {});
  }
}
