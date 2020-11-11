import { PixiStatsPlugin } from '@armathai/pixi-stats';
import { OldFilmFilter } from '@pixi/filter-old-film';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import * as PIXI from 'pixi.js';
import { Player, PLAYER_TYPES } from './character';
import { GAME_OPTIONS } from './config';
import { Camera, Renderer, StaticSystem } from './core';
import { Vector2 } from './geometry';
import Controller from './input/Controller';
import Level from './Level';
import { Scene } from './scene';
import { BackgroundScreen, ForegroundScreen } from './screen';
import { GameMusic, GameSound } from './sound';
import { MUSIC_ALBUM } from './sound/GameMusic';
import { Emitter, GAME_EVENTS, Loader, RESOURCE_EVENTS } from './system';
import { updateEntitiesDislightings, updateEntitiesLightings } from './utils';

export interface GameOptions {
  autoStart?: boolean;
  width?: number;
  height?: number;
  view?: HTMLCanvasElement;
  transparent?: boolean;
  autoDensity?: boolean;
  antialias?: boolean;
  preserveDrawingBuffer?: boolean;
  resolution?: number;
  forceCanvas?: boolean;
  backgroundColor?: number;
  clearBeforeRender?: boolean;
  powerPreference?: string;
  sharedTicker?: boolean;
  sharedLoader?: boolean;
  resizeTo?: Window | HTMLElement;
}

const { DEBUG, PIXEL_SCALE } = GAME_OPTIONS;

const defaultGameOptions: GameOptions = {
  width: (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio,
  height: (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio,
  antialias: false,
  resolution: PIXEL_SCALE / window.devicePixelRatio,
  backgroundColor: 0x160c21,
};

if (DEBUG) {
  PIXI.Application.registerPlugin(PixiStatsPlugin);
}

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class Game extends PIXI.Application {
  private _controller: Controller;
  private _camera: Camera;
  private _renderer: Renderer;

  private _scene: Scene;
  private _player: Player;

  private _background: BackgroundScreen;
  private _foreground: ForegroundScreen;

  private _level: Level;

  // for stats.js
  private stats: any;

  public constructor(props?: GameOptions) {
    super({ ...defaultGameOptions, ...props });

    Loader.load();

    this.initialize();
  }

  public play() {
    Emitter.on(GAME_EVENTS.SCENE_START, () => {
      this._foreground.effect(GAME_EVENTS.SCENE_START, () => {}, this._level.current);
    });

    Emitter.on(GAME_EVENTS.GAME_OVER, () => {
      this._scene.destroy();
      this._level = new Level();
      this.sceneInitialize();
      this._foreground.effect(GAME_EVENTS.GAME_TITLE, () => {
        Emitter.emit(GAME_EVENTS.SCENE_RUNNING);
      });
    });

    Emitter.on(GAME_EVENTS.SCENE_RUNNING, () => {
      GameMusic.play(MUSIC_ALBUM.MAIN);
      GameSound.play('cave_airflow', 0.02, true);
      this._player.respawn(this._scene.playerRespawnPosition);
    });

    Emitter.on(GAME_EVENTS.SCENE_CLEAR, () => {
      this._foreground.effect(
        GAME_EVENTS.SCENE_CLEAR,
        () => {
          this.sceneNext();
          Emitter.emit(GAME_EVENTS.SCENE_RUNNING);
        },
        this._level.current
      );
    });

    Emitter.on(GAME_EVENTS.USER_DIE, () => {
      this._foreground.effect(GAME_EVENTS.USER_DIE, () => {
        Emitter.emit(GAME_EVENTS.GAME_OVER);
      });
    });

    Emitter.on(RESOURCE_EVENTS.RESOURCES_LOADED, () => {
      this.sceneInitialize();
      this._foreground.effect(GAME_EVENTS.GAME_TITLE, () => {
        Emitter.emit(GAME_EVENTS.SCENE_RUNNING);
      });
    });
  }

  private sceneNext() {
    this._scene.destroy();
    this._level.nextScene();
    Emitter.emit(GAME_EVENTS.SCENE_RUNNING);

    this._scene = this._level.scene;
    this._scene.addNonPlayers(this._level.nonPlayers);
    this._renderer.add(this._player);
    this._renderer.render();

    updateEntitiesLightings(Vector2.center);
    updateEntitiesDislightings(Vector2.center);
  }

  private sceneInitialize() {
    this._level.nextScene();
    this._scene = this._level.scene;
    this._scene.addNonPlayers(this._level.nonPlayers);

    this._player = new Player(PLAYER_TYPES.KNIGHT_M);
    this._renderer.render();
  }

  private initialize() {
    const root = document.getElementById('root');
    root.appendChild(this.view);

    window.onload = () => {
      // prevent contextmenu
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });

      // hack for safari 12 maximum-scale ignore
      document.addEventListener(
        'touchstart',
        (event) => {
          if (event.touches.length > 1) {
            event.preventDefault();
          }
        },
        { passive: false }
      );

      let lastTouchEnd = 0;
      document.addEventListener(
        'touchend',
        (event) => {
          const now = new Date().getTime();
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        },
        false
      );
    };

    // stats.js;
    if (DEBUG) {
      root.appendChild(this.stats.dom);
      PIXI.Ticker.shared.add(() => {
        this.stats.update();
      });
    }

    this.registGsapPlugin();
    this.registController();
    this.registResizer();
    this.registFilter();

    this.registCamera();
    this.registRenderer();
    this.registBackground();
    this.registForeground();
    this.registLevel();
  }

  public get controller() {
    return this._controller;
  }

  public set controller(controller: Controller) {
    this._controller = controller;
  }

  private registLevel() {
    this._level = new Level();
  }

  private registGsapPlugin() {
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);
  }

  private registController() {
    this._controller = new Controller();
  }

  private registCamera() {
    this._camera = new Camera();
    this.stage.addChild(this._camera.viewport);
  }

  private registRenderer() {
    this._renderer = new Renderer();
  }

  private registBackground() {
    const width = (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio;
    const height = (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio;
    const background = new BackgroundScreen(width, height);

    this._background = background;
    StaticSystem.renderer.add(background);
  }

  private registForeground() {
    const width = (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio;
    const height = (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio;
    const foreground = new ForegroundScreen(width, height);
    this._foreground = foreground;
    StaticSystem.renderer.add(foreground);
  }

  private registResizer() {
    window.onorientationchange = () => {
      const width = (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio;
      const height = (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio;

      this.renderer.resize(width, height);
      this._camera.viewport.resize(width, height);
      this._background.resize(width, height);
    };
    window.onresize = () => {
      const width = (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio;
      const height = (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio;

      this.renderer.resize(width, height);
      this._camera.viewport.resize(width, height);
      this._background.resize(width, height);
    };
  }

  private registFilter() {
    PIXI.Ticker.shared.add(() => {
      this.stage.filters = [
        new OldFilmFilter(
          {
            sepia: 0,
            noise: 0.0618,
            noiseSize: 1,
            scratch: -1,
            scratchDensity: 0.0382,
            scratchWidth: 1,
            vignetting: 0.3,
            vignettingAlpha: 0.618,
            vignettingBlur: 0.3,
          },
          Math.random()
        ),
      ];
    });
  }
}
