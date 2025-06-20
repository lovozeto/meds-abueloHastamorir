import { medicationSchedule, timeToMinutes, generateDayText, getColorForNoteLevel } from './shared.js';

class SchedulePage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <ion-header translucent="true" collapse="condense">
        <ion-toolbar>
          <ion-title size="large" id="large-header-title">Horario</ion-title>
        </ion-toolbar>
        <ion-toolbar>
          <ion-note id="header-subtitle-text" class="ion-padding-start">Calculando...</ion-note>
        </ion-toolbar>
      </ion-header>
      <ion-content fullscreen="true">
        <div class="page-container">
          <ion-refresher slot="fixed" id="refresher"><ion-refresher-content></ion-refresher-content></ion-refresher>
          <div id="schedule-container"></div>
        </div>
      </ion-content>
    `;

    this.scheduleContainer = this.querySelector('#schedule-container');
    this.refresher = this.querySelector('#refresher');

    this.renderSchedule();
    this.updateHeader();
    this.updateScheduleStatus();
    this.setupRefresher();

    this.updateInterval = setInterval(() => this.updateScheduleStatus(), 60000);

    const header = this.querySelector('ion-header[collapse="condense"]');
    const largeTitle = this.querySelector('#large-header-title');
    const smallTitle = this.querySelector('ion-header ion-title');
    if (header && largeTitle && smallTitle) {
      header.addEventListener('ionScroll', () => {
        smallTitle.textContent = largeTitle.textContent;
      });
    }
  }

  disconnectedCallback() {
    clearInterval(this.updateInterval);
  }

  renderSchedule() {
    if (!this.scheduleContainer) return;
    this.scheduleContainer.innerHTML = '';
    const today = new Date().getDay();

    medicationSchedule.forEach(block => {
      const blockContainer = document.createElement('div');
      blockContainer.id = `block-${block.time.replace(/[\s:]/g, '')}`;
      blockContainer.classList.add('ion-padding-horizontal');

      const listHeader = document.createElement('ion-list-header');
      listHeader.innerHTML = `<ion-label>${block.time}</ion-label>`;
      blockContainer.appendChild(listHeader);

      const list = document.createElement('ion-list');
      list.inset = true;

      block.medications.forEach(med => {
        const item = document.createElement('ion-item');
        let itemHTML = `<ion-label>`;
        if (med.days) {
          itemHTML += `<p class="eyebrow"><ion-icon name="calendar-outline"></ion-icon> Tomar: ${generateDayText(med.days)}</p>`;
        }
        itemHTML += `<h2>${med.name}</h2><p>${med.description}</p>`;
        if (med.dosage) {
          itemHTML += `<p class="dosage-text">${med.dosage}</p>`;
        }
        if (med.note) {
          itemHTML += `<ion-chip color="${getColorForNoteLevel(med.note.level)}"><ion-label>${med.note.text}</ion-label></ion-chip>`;
        }
        itemHTML += `</ion-label>`;
        item.innerHTML = itemHTML;

        if (med.days && !med.days.includes(today)) {
          item.classList.add('med-not-today');
        }
        list.appendChild(item);
      });

      blockContainer.appendChild(list);
      this.scheduleContainer.appendChild(blockContainer);
    });
  }

  updateHeader() {
    const titleEl = this.querySelector('#large-header-title'),
          subtitleEl = this.querySelector('#header-subtitle-text');
    if (!titleEl || !subtitleEl) return;
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' })),
          dateOptions = { weekday: 'long' };
    let formattedDate = new Intl.DateTimeFormat('es-CO', dateOptions).format(now);
    titleEl.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    const today = now.getDay(),
          medsTodayCount = medicationSchedule.reduce((c, b) => c + b.medications.filter(m => !m.days || m.days.includes(today)).length, 0);
    subtitleEl.textContent = `${medsTodayCount} medicamentos para hoy`;
  }

  updateScheduleStatus() {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' })),
          nowInMinutes = now.getHours() * 60 + now.getMinutes();
    let nextBlockFound = false;
    this.querySelectorAll('.schedule-block-past, .schedule-block-next').forEach(e => e.classList.remove('schedule-block-past', 'schedule-block-next'));
    this.querySelectorAll('.next-chip').forEach(e => e.remove());

    for (const block of medicationSchedule) {
      const blockId = `block-${block.time.replace(/[\s:]/g, '')}`;
      const blockElement = this.querySelector(`#${blockId}`);
      if (!blockElement) continue;
      const blockTimeInMinutes = timeToMinutes(block.time);

      if (!nextBlockFound && blockTimeInMinutes >= nowInMinutes) {
        blockElement.classList.add('schedule-block-next');
        nextBlockFound = true;
        const headerLabel = blockElement.querySelector('ion-list-header ion-label');
        if (headerLabel) {
          const chip = document.createElement('ion-chip');
          chip.color = 'primary';
          chip.textContent = 'Siguiente';
          chip.classList.add('next-chip');
          headerLabel.appendChild(chip);
        }
      } else if (blockTimeInMinutes < nowInMinutes) {
        blockElement.classList.add('schedule-block-past');
      }
    }
  }

  setupRefresher() {
    if (!this.refresher) return;
    this.refresher.addEventListener('ionRefresh', async e => {
      // Aquí puedes implementar fuerza actualización si quieres
      e.target.complete();
    });
  }
}

customElements.define('schedule-page', SchedulePage);