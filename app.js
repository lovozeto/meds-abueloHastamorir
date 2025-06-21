const App = {
  currentMode: 'ios',
  darkModePref: 'auto',

  detectMode() {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua) || /Windows/i.test(ua)) {
      return 'md';
    }
    return 'ios';
  },

  applyDarkMode(pref) {
    let isDark;
    if (pref === 'auto') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = pref === 'dark';
    }
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  },

  setDarkModePref(pref) {
    localStorage.setItem('darkModePref', pref);
    this.darkModePref = pref;
    this.applyDarkMode(pref);
  },

  forceUpdate(showLoading = false) {
    return new Promise(async (resolve) => {
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
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));

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
        resolve();
      }
    });
  },

  registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker
      .register('/meds-abueloHastamorir/sw.js', { scope: '/meds-abueloHastamorir/' })
      .then((reg) => console.log('Service Worker registrado:', reg))
      .catch((err) => console.error('Error registrando Service Worker:', err));
  },

  init() {
    this.currentMode = this.detectMode();
    window.Ionic = window.Ionic || {};
    window.Ionic.config = window.Ionic.config || {};
    window.Ionic.config.mode = this.currentMode;

    this.darkModePref = localStorage.getItem('darkModePref') || 'auto';
    this.applyDarkMode(this.darkModePref);

    if (this.darkModePref === 'auto') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        this.applyDarkMode('auto');
      });
    }

    const navs = document.querySelectorAll('ion-nav');
    if (navs.length >= 2) {
      navs[0].appendChild(document.createElement('schedule-page'));
      navs[1].appendChild(document.createElement('settings-page'));
    }

    this.registerServiceWorker();

    window.App = this;
  },
};

window.addEventListener('DOMContentLoaded', () => App.init());