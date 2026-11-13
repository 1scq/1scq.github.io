import { createLanyard } from './lanyard.js';
import { createBadgeArtwork } from './badge-artwork.js';

const container = document.querySelector('#homepage-badge');
if (container) {
  const portrait = container.querySelector('img');
  const initialize = async () => {
    try {
      await portrait.decode();
      const artwork = createBadgeArtwork(portrait);
      const dispose = createLanyard(container, {
        ...artwork,
        intro: false,
        finish: 'matte',
        cardColor: '#f5f4f0',
        size: 0.59,
        strapLength: 0.5,
        strapWidth: 0.7,
        breeze: 0.16,
        damping: 0.65,
        cornerRadius: 0.45
      });
      if (dispose) window.addEventListener('pagehide', event => {
        if (!event.persisted) dispose();
      }, { once: true });
    } catch (error) {
      // The illustrated HTML card remains visible if graphics are unavailable.
      console.warn('Badge uses its static portrait fallback.', error);
    }
  };
  initialize();
}
