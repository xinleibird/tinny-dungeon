import './index.css';
import Game from './lib/Game';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registed!');
      })
      .catch((registrationError) => {
        console.log('You are offline!');
      });
  });
}

const game = new Game();

game.play();
