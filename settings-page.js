class SettingsPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <ion-header translucent="true">
        <ion-toolbar><ion-title>Configuración</ion-title></ion-toolbar>
      </ion-header>
      <ion-content fullscreen="true">
        <div class="page-container ion-padding">
          <p>Aquí van opciones de configuración, botones, etc.</p>
        </div>
      </ion-content>
    `;
  }
}

customElements.define('settings-page', SettingsPage);