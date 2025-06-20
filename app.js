import './schedule-page.js';
import './settings-page.js';

const BASE_PATH = '/meds-abueloHastamorir/';

const App = {
  init() {
    const navs = document.querySelectorAll('ion-nav');
    if (navs.length >= 2) {
      navs[0].appendChild(document.createElement('schedule-page'));
      navs[1].appendChild(document.createElement('settings-page'));
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(BASE_PATH + 'sw.js', { scope: BASE_PATH })
        .then(() => console.log('Service Worker registrado'))
        .catch(console.error);
    }
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());