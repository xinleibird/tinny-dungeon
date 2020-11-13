import sound from 'pixi-sound';
import * as PIXI from 'pixi.js';
import { CHARACTER_ANIMATIONS, CHARACTER_CATEGORIES, PLAYER_TYPES } from '../character';
import { default as Emitter, RESOURCE_EVENTS } from './Emitter';

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
  TITLES?: PIXI.Texture[];
  AVATAR?: PIXI.Texture;
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
    TITLES: [],
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
    loader.add('titleImages', 'assets/sprites/title.json');

    loader.add('assets/sprites/knight_m.json');
    loader.add('assets/sprites/skeleton.json');
    loader.add('assets/sprites/bat.json');

    loader.add('Click', 'assets/fonts/click.fnt');
    loader.add('Pixel', 'assets/fonts/Pixel.fnt');
    loader.add('Convenant', 'assets/fonts/Covenant5x5.fnt');

    loader.add('avatarImage', 'assets/sprites/avatar.png');

    loader.add('title', 'assets/sounds/musics/MusMus-BGM-070.mp3');
    loader.add('main', 'assets/sounds/musics/MusMus-BGM-076.mp3');

    this.sounds.effects['cave_airflow'] = sound.Sound.from({
      url: 'assets/sounds/effects/MusMus-BGM-111.mp3',
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
    this.sounds.effects['coin'] = sound.Sound.from({
      url: 'assets/sounds/effects/sfx_coin_double3.wav',
      preload: true,
    });
    this.sounds.effects['stair'] = sound.Sound.from({
      url: 'assets/sounds/effects/sfx_movement_stairs1loop.wav',
      preload: true,
    });
    this.sounds.effects['defence'] = sound.Sound.from({
      url: 'assets/sounds/effects/sfx_sounds_powerup8.wav',
      preload: true,
    });

    loader.load((loader, resources) => {
      this.resources = resources;
    });

    loader.onComplete.add(() => {
      this.textures.AVATAR = PIXI.Texture.from(`avatarImage`);

      for (let i = 0; i < 6; i++) {
        const texture = PIXI.Texture.from(`title_${i}`);
        this.textures.TITLES.push(texture);
      }

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
      for (let i = 0; i <= 28; i++) {
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
      this.textures.UI['tap'] = PIXI.Texture.from(`ui_tap`);
      this.textures.UI['w'] = PIXI.Texture.from(`ui_w`);
      this.textures.UI['a'] = PIXI.Texture.from(`ui_a`);
      this.textures.UI['s'] = PIXI.Texture.from(`ui_s`);
      this.textures.UI['d'] = PIXI.Texture.from(`ui_d`);
      this.textures.UI['space'] = PIXI.Texture.from(`ui_space`);
      this.textures.UI['enter'] = PIXI.Texture.from(`ui_enter`);
      this.textures.UI['heart'] = PIXI.Texture.from(`ui_heart`);

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

      this.sounds.musics.main = sound.Sound.from(this.resources.main);
      this.sounds.musics.title = sound.Sound.from(this.resources.title);

      Emitter.emit(RESOURCE_EVENTS.RESOURCES_LOADED);
    });

    loader.onError.add(() => {});

    loader.onProgress.add((e) => {});

    loader.onLoad.add(() => {});
  }
}
