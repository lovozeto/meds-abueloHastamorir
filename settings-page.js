class FullSettingsPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <ion-header translucent="true">
        <ion-toolbar>
          <ion-title>Configuración</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content fullscreen="true">
        <div class="page-container ion-padding">
          <ion-list-header><ion-label>Recordatorios</ion-label></ion-list-header>
          <ion-list inset="true">
            <ion-item button id="setup-notifications-button">
              <ion-icon color="primary" slot="start" name="notifications-outline"></ion-icon>
              <ion-label>
                <h2>Activar Notificaciones</h2>
                <p>Para Android y Escritorio</p>
              </ion-label>
            </ion-item>
            <ion-item button href="webcal://p62-caldav.icloud.com/published/2/MTA1MTM2NTQ4MzEwNTEzNhRak2GL1HVQUSeGOw06am9vyGuT7jrdJ9Ujg8HxTTi9KF6vtvStG6SlZ3taPvX6YIjijFm-gnc8Yqcjux-DlPI" target="_blank">
              <ion-icon color="primary" slot="start" name="calendar-outline"></ion-icon>
              <ion-label>
                <h2>Suscribir al Calendario</h2>
                <p>Para iPhone y iPad</p>
              </ion-label>
            </ion-item>
          </ion-list>

          <ion-list-header><ion-label>Apariencia</ion-label></ion-list-header>

          <div class="theme-selector" role="radiogroup" aria-label="Selector de tema">
            <div role="radio" tabindex="0" class="theme-option" data-value="auto" aria-checked="false">Auto</div>
            <div role="radio" tabindex="-1" class="theme-option" data-value="light" aria-checked="false">Light</div>
            <div role="radio" tabindex="-1" class="theme-option" data-value="dark" aria-checked="false">Dark</div>
          </div>

          <ion-list-header><ion-label>Mantenimiento</ion-label></ion-list-header>
          <ion-list inset="true">
            <ion-item button id="force-update-button">
              <ion-icon color="danger" slot="start" name="refresh-circle-outline"></ion-icon>
              <ion-label>
                <h2>Forzar Actualización</h2>
                <p>Borra la caché y recarga la app</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
      </ion-content>
    `;

    this.querySelector('#force-update-button')?.addEventListener('click', () => App.forceUpdate(true));
    this.setupNotificationInteractions();

    // Setup selector de tema
    this.themeOptions = this.querySelectorAll('.theme-option');
    this.themeOptions.forEach((option, index) => {
      option.addEventListener('click', () => this.selectTheme(option));
      option.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          this.themeOptions[(index + 1) % this.themeOptions.length].focus();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          this.themeOptions[(index - 1 + this.themeOptions.length) % this.themeOptions.length].focus();
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectTheme(option);
        }
      });
    });

    // Marca la opción guardada
    this.updateSelectedTheme();
  }

  selectTheme(option) {
    const value = option.dataset.value;
    App.setDarkModePref(value);
    this.updateSelectedTheme();
  }

  updateSelectedTheme() {
    const current = App.darkModePref || 'auto';
    this.themeOptions.forEach(option => {
      const selected = option.dataset.value === current;
      option.classList.toggle('selected', selected);
      option.setAttribute('aria-checked', selected ? 'true' : 'false');
      option.tabIndex = selected ? 0 : -1;
    });
  }

  async scheduleAllNotifications() {
    // ... código existente sin cambios ...
  }

  setupNotificationInteractions() {
    // ... código existente sin cambios ...
  }
}

customElements.define('settings-page', FullSettingsPage);