import * as PIXI from 'pixi.js';

enum TILES_ENUM {
  EMPTY,
  FLOOR,
  WALL,
  GRASS,
  GRASS_TALL,
  TREE_A,
  TREE_B,
}

type TilesType = {
  [key in keyof typeof TILES_ENUM]?: PIXI.Texture;
};

const loader = PIXI.Loader.shared;
loader.add('assets/tiles/map_tiles.json');

export const initTileTextures = (): Promise<TilesType> => {
  const tiles: TilesType = {};
  return new Promise((resolve, reject) => {
    loader.load(() => {
      tiles[TILES_ENUM[TILES_ENUM.EMPTY]] = PIXI.Texture.from(`map_tiles_${TILES_ENUM.EMPTY}`);
      tiles[TILES_ENUM[TILES_ENUM.FLOOR]] = PIXI.Texture.from(`map_tiles_${TILES_ENUM.FLOOR}`);
      tiles[TILES_ENUM[TILES_ENUM.WALL]] = PIXI.Texture.from(`map_tiles_${TILES_ENUM.WALL}`);
      tiles[TILES_ENUM[TILES_ENUM.GRASS]] = PIXI.Texture.from(`map_tiles_${TILES_ENUM.GRASS}`);
      tiles[TILES_ENUM[TILES_ENUM.GRASS_TALL]] = PIXI.Texture.from(
        `map_tiles_${TILES_ENUM.GRASS_TALL}`
      );
      tiles[TILES_ENUM[TILES_ENUM.TREE_A]] = PIXI.Texture.from(
        `map_tiles_${TILES_ENUM.TREE_A}`
      );
      tiles[TILES_ENUM[TILES_ENUM.TREE_B]] = PIXI.Texture.from(
        `map_tiles_${TILES_ENUM.TREE_B}`
      );
    });

    loader.onComplete.add(() => {
      resolve(tiles);
    });

    loader.onError.add((e) => {
      reject(e);
    });
  });
};
