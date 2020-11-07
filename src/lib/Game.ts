import { PixiStatsPlugin } from '@armathai/pixi-stats';
import { OldFilmFilter } from '@pixi/filter-old-film';
import * as PIXI from 'pixi.js';
import { NonPlayer, NONPLAYER_TYPES, Player, PLAYER_TYPES } from './character';
import { GAME_OPTIONS } from './config';
import { Camera, Renderer, StaticSystem } from './core';
import { Vector2 } from './geometry';
import Controller from './input/Controller';
import { Scene } from './scene';
import Dungeon from './scene/Dungeon';
import { BackgroundScreen, ForegroundScreen } from './screen';
import { GameMusic, GameSound } from './sound';
import { MUSIC_ALBUM } from './sound/GameMusic';
import { Emitter, GAME_EVENTS, Loader, RESOURCE_EVENTS } from './system';

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

const DUNGEON_SIZE_WIDTH = 31;
const DUNGEON_SIZE_HEITHT = 31;

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

  private _viewportSize: { width: number; height: number } = { width: 0, height: 0 };

  // for stats.js
  private stats: any;

  public constructor(props?: GameOptions) {
    super({ ...defaultGameOptions, ...props });

    Loader.load();

    this.initialize();
  }

  public play() {
    Emitter.on(GAME_EVENTS.GAME_TITLE, () => {
      this._foreground.effect(GAME_EVENTS.GAME_TITLE);
    });

    Emitter.on(GAME_EVENTS.SCENE_START, () => {
      this._foreground.effect(GAME_EVENTS.SCENE_START);
      GameMusic.play(MUSIC_ALBUM.MAIN);
      GameSound.play('cave_airflow', 0.02, true);
    });

    Emitter.on(GAME_EVENTS.SCENE_RUNNING, () => {
      this._player.respawn(this._scene.playerRespawnPosition);
    });

    Emitter.on(GAME_EVENTS.USER_DIE, () => {
      this._foreground.effect(GAME_EVENTS.USER_DIE);
    });

    Emitter.on(GAME_EVENTS.GAME_OVER, () => {
      this._scene.destroy();
    });

    Emitter.on(RESOURCE_EVENTS.RESOURCES_LOADED, () => {
      Emitter.emit(GAME_EVENTS.GAME_TITLE);
      this.gameLoop();
    });
  }

  private initialize() {
    this._viewportSize = {
      width: defaultGameOptions.width,
      height: defaultGameOptions.height,
    };
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

    this.registController();
    this.registResizer();
    this.registFilter();

    this.registCamera();
    this.registRenderer();
    this.registBackground();
    this.registForeground();
  }

  public get controller() {
    return this._controller;
  }

  public set controller(controller: Controller) {
    this._controller = controller;
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
      this._viewportSize = { width, height };

      this.renderer.resize(width, height);
      this._camera.viewport.resize(width, height);
      this._background.resize(width, height);
    };
    window.onresize = () => {
      const width = (window.innerWidth / PIXEL_SCALE) * window.devicePixelRatio;
      const height = (window.innerHeight / PIXEL_SCALE) * window.devicePixelRatio;
      this._viewportSize = { width, height };

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

  private gameLoop() {
    this._scene = new Dungeon(DUNGEON_SIZE_WIDTH, DUNGEON_SIZE_HEITHT);
    this._player = new Player(PLAYER_TYPES.KNIGHT_M);

    const { x, y } = this._scene.playerRespawnPosition;
    const skeleton1 = new NonPlayer(NONPLAYER_TYPES.SKELETON);
    const skeleton2 = new NonPlayer(NONPLAYER_TYPES.SKELETON);
    const skeleton3 = new NonPlayer(NONPLAYER_TYPES.SKELETON);
    const skeleton4 = new NonPlayer(NONPLAYER_TYPES.SKELETON);
    const skeleton5 = new NonPlayer(NONPLAYER_TYPES.SKELETON);
    skeleton1.geometryPosition = new Vector2(x + 1, y);
    skeleton2.geometryPosition = new Vector2(x + 2, y);
    skeleton3.geometryPosition = new Vector2(x + 3, y);
    skeleton4.geometryPosition = new Vector2(x + 1, y + 1);
    skeleton5.geometryPosition = new Vector2(x, y + 1);

    this._renderer.render();
  }
}
