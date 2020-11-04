import sound from 'pixi-sound';
import * as PIXI from 'pixi.js';
import { CHARACTER_ANIMATIONS, CHARACTER_CATEGORIES, PLAYER_TYPES } from '../character';
import { Emitter, RESOURCE_EVENTS } from './Emitter';

const loader = PIXI.Loader.shared;

type TexturesTypes = {
  [key in keyof typeof PLAYER_TYPES]?: {
    [key in keyof typeof CHARACTER_ANIMATIONS]?: PIXI.Texture[];
  };
} & {
  UI?: {
    [key: string]: PIXI.Texture;
  };
  DOORS?: PIXI.Texture[];
  STAIRS?: PIXI.Texture[];
  FLOOR_DECORATORS?: PIXI.Texture[];
  LIGHTING_MASK?: PIXI.Texture[];
};

interface SoundTypes {
  musics?: {
    main?: sound.Sound;
    title?: sound.Sound;
  };
  effects?: {
    [key: string]: sound.Sound;
  };
}

export default class Loader {
  public static resources: PIXI.IResourceDictionary;
  public static textures: TexturesTypes = {
    UI: {},
    DOORS: [],
    STAIRS: [],
    FLOOR_DECORATORS: [],
    LIGHTING_MASK: [],
  };
  public static tileset: PIXI.Texture[] = [];
  public static sounds: SoundTypes = { effects: {}, musics: {} };

  public static load() {
    loader.add('assets/tiles/tileset.json');
    loader.add('assets/tiles/doors.json');
    loader.add('assets/tiles/stairs.json');
    loader.add('assets/tiles/floor_decorators.json');
    loader.add('assets/tiles/ui.json');
    loader.add('assets/tiles/lighting_mask.json');

    loader.add('assets/sprites/knight_m.json');
    loader.add('assets/sprites/skeleton.json');

    loader.add('main', 'assets/sounds/musics/平坡の道.mp3');
    loader.add('title', 'assets/sounds/musics/first-story.ogg');

    this.sounds.musics.main = sound.Sound.from({
      url: 'assets/sounds/musics/平坡の道.mp3',
      preload: true,
    });

    this.sounds.musics.title = sound.Sound.from({
      url: 'assets/sounds/musics/first-story.ogg',
      preload: true,
    });

    this.sounds.effects['cave_airflow'] = sound.Sound.from({
      url: 'assets/sounds/effects/cave_airflow.wav',
      preload: true,
    });

    this.sounds.effects['player_step'] = sound.Sound.from({
      url: 'assets/sounds/effects/sfx_movement_footsteps1a.wav',
      preload: true,
    });

    this.sounds.effects['player_attack'] = sound.Sound.from({
      url: 'assets/sounds/effects/sfx_wpn_sword1.wav',
      preload: true,
    });
    this.sounds.effects['nonplayer_step'] = sound.Sound.from({
      url: 'assets/sounds/effects/sfx_movement_footstepsloop3_fast.wav',
      preload: true,
    });
    this.sounds.effects['nonplayer_attack'] = sound.Sound.from({
      url: 'assets/sounds/effects/sfx_wpn_dagger.wav',
      preload: true,
    });
    this.sounds.effects['door_open'] = sound.Sound.from({
      url: 'assets/sounds/effects/sfx_movement_dooropen2.wav',
      preload: true,
    });
    this.sounds.effects['damage'] = sound.Sound.from({
      url: 'assets/sounds/effects/sfx_damage_hit9.wav',
      preload: true,
    });
    this.sounds.effects['dodge'] = sound.Sound.from({
      url: 'assets/sounds/effects/sfx_damage_hit1.wav',
      preload: true,
    });
    this.sounds.effects['you_died'] = sound.Sound.from({
      url: 'assets/sounds/effects/punctuation.mp3',
      preload: true,
    });

    loader.add('Click', 'assets/fonts/click.fnt');

    loader.load((loader, resources) => {
      this.resources = resources;
    });

    loader.onComplete.add(() => {
      for (let i = 0; i < 48; i++) {
        const texture = PIXI.Texture.from(`tileset_${i}`);
        this.tileset.push(texture);
      }

      for (let i = 0; i < 6; i++) {
        const texture = PIXI.Texture.from(`doors_${i}`);
        this.textures.DOORS.push(texture);
      }
      for (let i = 0; i < 2; i++) {
        const texture = PIXI.Texture.from(`stairs_${i}`);
        this.textures.STAIRS.push(texture);
      }
      for (let i = 0; i <= 26; i++) {
        const texture = PIXI.Texture.from(`floor_decorators_${i}`);
        this.textures.FLOOR_DECORATORS.push(texture);
      }

      {
        const texture = PIXI.Texture.from(`lighting_mask_${0}`);
        this.textures.LIGHTING_MASK.push(texture);
      }

      this.textures.UI['arrow_down'] = PIXI.Texture.from(`ui_arrow_down`);
      this.textures.UI['arrow_up'] = PIXI.Texture.from(`ui_arrow_up`);
      this.textures.UI['arrow_left'] = PIXI.Texture.from(`ui_arrow_left`);
      this.textures.UI['arrow_right'] = PIXI.Texture.from(`ui_arrow_right`);

      Object.keys(CHARACTER_CATEGORIES).forEach((character) => {
        this.textures[character] = {
          [CHARACTER_ANIMATIONS.HOLD]: [],
          [CHARACTER_ANIMATIONS.WALK]: [],
          [CHARACTER_ANIMATIONS.ATTACK]: [],
          [CHARACTER_ANIMATIONS.HURT]: [],
          [CHARACTER_ANIMATIONS.DODGE]: [],
          [CHARACTER_ANIMATIONS.DIE]: [],
        };

        const frameName = character.toString().toLowerCase();
        for (let i = 0; i < 4; i++) {
          const texture = PIXI.Texture.from(`${frameName}_${i}`);
          this.textures[character][CHARACTER_ANIMATIONS.HOLD].push(texture);
        }

        for (let i = 4; i < 8; i++) {
          const texture = PIXI.Texture.from(`${frameName}_${i}`);
          this.textures[character][CHARACTER_ANIMATIONS.WALK].push(texture);
        }

        for (let i = 8; i < 12; i++) {
          const texture = PIXI.Texture.from(`${frameName}_${i}`);
          this.textures[character][CHARACTER_ANIMATIONS.ATTACK].push(texture);
        }

        for (let i = 12; i < 16; i++) {
          const texture = PIXI.Texture.from(`${frameName}_${i}`);
          this.textures[character][CHARACTER_ANIMATIONS.HURT].push(texture);
        }

        for (let i = 16; i < 20; i++) {
          const texture = PIXI.Texture.from(`${frameName}_${i}`);
          this.textures[character][CHARACTER_ANIMATIONS.DODGE].push(texture);
        }

        for (let i = 20; i < 24; i++) {
          const texture = PIXI.Texture.from(`${frameName}_${i}`);
          this.textures[character][CHARACTER_ANIMATIONS.DIE].push(texture);
        }
      });

      Emitter.emit(RESOURCE_EVENTS.RESOURCES_LOADED);
    });

    loader.onError.add(() => {});

    loader.onProgress.add((e) => {});

    loader.onLoad.add(() => {});
  }
}
