import { mountRubberSegment } from './rubber-segment.js';

const track = document.querySelector('#theme-segment');
if (track) {
  const control = mountRubberSegment(track, {
    value: document.documentElement.dataset.themePreference,
    onChange(preference) {
      window.dispatchEvent(new CustomEvent('themepreference', { detail: { preference } }));
    }
  });
  window.addEventListener('themechange', event => control.setValue(event.detail.preference));
}
