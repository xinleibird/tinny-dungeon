import * as PIXI from 'pixi.js';

const loader = PIXI.Loader.shared;

loader.add('./assets/tiles/knight_m.json');

export const getSpriteAnimation = async (): Promise<PIXI.AnimatedSprite> => {
  const spriteTextures = [];

  return new Promise((resolve, reject) => {
    loader.load(() => {
      for (let i = 0; i < 4; i++) {
        const texture = PIXI.Texture.from(`knight_m_${i}`);
        spriteTextures.push(texture);
      }
    });

    loader.onComplete.add(() => {
      const anim = new PIXI.AnimatedSprite(spriteTextures);
      anim.animationSpeed = 0.1;
      anim.anchor.y = 0.5;
      resolve(anim);
    });

    loader.onError.add((e) => {
      reject(e);
    });
  });
};
