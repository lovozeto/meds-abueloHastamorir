import { medicationSchedule, timeToMinutes } from './shared.js';

class SettingsPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <ion-header translucent="true">
        <ion-toolbar><ion-title>Configuración</ion-title></ion-toolbar>
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

    this.querySelector('#force-update-button')?.addEventListener('click', () => {
      if (window.App && typeof window.App.forceUpdate === 'function') {
        window.App.forceUpdate(true);
      }
    });

    this.querySelector('#setup-notifications-button')?.addEventListener('click', async () => {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        this.showToast('Este navegador no soporta notificaciones.', 'danger');
        return;
      }
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        this.scheduleAllNotifications();
      } else {
        this.showToast('No se ha concedido permiso para notificaciones.', 'warning');
      }
    });
  }

  async scheduleAllNotifications() {
    if (!navigator.serviceWorker) return;

    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg || !('showTrigger' in Notification.prototype)) {
      this.showToast('Este navegador no soporta la programación de notificaciones.', 'danger');
      return;
    }

    const existing = await reg.getNotifications({ includeTriggered: true });
    existing.forEach(n => n.close());

    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }));
    const today = now.getDay();
    let count = 0;

    for (const block of medicationSchedule) {
      for (const med of block.medications) {
        if (!med.days || med.days.includes(today)) {
          const minutes = timeToMinutes(block.time);
          const notificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Math.floor(minutes / 60), minutes % 60, 0);
          if (notificationTime > now) {
            reg.showNotification('Hora de tu medicamento', {
              body: `Tomar: ${med.name} (${med.dosage})`,
              tag: `med-${block.time}-${med.name}`,
              icon: './icons/icon-192x192.png',
              badge: './icons/icon-192x192.png',
              showTrigger: new TimestampTrigger(notificationTime.getTime())
            });
            count++;
          }
        }
      }
    }

    if (count > 0) {
      this.showToast(`¡Se han programado ${count} recordatorios para hoy!`, 'success');
    } else {
      this.showToast('No hay recordatorios pendientes para el resto del día.', 'medium');
    }
  }

  showToast(message, color = 'dark', duration = 3000) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = duration;
    toast.color = color;
    toast.position = 'top';
    toast.mode = window.Ionic?.config?.mode || 'ios';
    document.body.appendChild(toast);
    return toast.present();
  }
}

customElements.define('settings-page', SettingsPage);