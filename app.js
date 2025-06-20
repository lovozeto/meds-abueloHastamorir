import './schedule-page.js';
import './settings-page.js';
import { timeToMinutes } from './shared.js';

const BASE_PATH = '/meds-abueloHastamorir/';

const App = {
  timeToMinutes,

  async forceUpdate(showLoading = false) {
    let loading;
    if (showLoading) {
      loading = document.createElement('ion-loading');
      loading.message = 'Actualizando...';
      document.body.appendChild(loading);
      await loading.present();
    }
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
      const toast = document.createElement('ion-toast');
      toast.message = 'Actualización completada. Recargando...';
      toast.duration = 3000;
      toast.color = 'success';
      toast.position = 'top';
      document.body.appendChild(toast);
      await toast.present();
      setTimeout(() => window.location.reload(true), 1000);
    } catch (error) {
      const toast = document.createElement('ion-toast');
      toast.message = 'Error al forzar la actualización.';
      toast.duration = 3000;
      toast.color = 'danger';
      toast.position = 'top';
      document.body.appendChild(toast);
      await toast.present();
    } finally {
      if (loading) {
        await loading.dismiss();
      }
    }
  },

  registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register(BASE_PATH + 'sw.js', { scope: BASE_PATH })
      .then(reg => console.log('Service Worker registrado:', reg))
      .catch(err => console.error('Error registrando Service Worker:', err));
  },

  init() {
    const navs = document.querySelectorAll('ion-nav');
    if (navs.length >= 2) {
      navs[0].appendChild(document.createElement('schedule-page'));
      navs[1].appendChild(document.createElement('settings-page'));
    }

    this.registerServiceWorker();

    // Exponer App globalmente para acceso desde settings-page
    window.App = this;
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());