import * as api from '../api';

export const fetchNotifications = () =>
  fetch(`${import.meta.env.VITE_DECORATOR_BASE_URL}/api/notifications`, {
    credentials: 'include',
  }).then((response) => response.text());

class ArchivableNotificaton extends HTMLElement {
  connectedCallback() {
    const eventId = this.getAttribute('data-event-id');
    if (eventId) {
      this.querySelector('button')?.addEventListener('click', () =>
        api.archive({ eventId }).then(() => this.parentElement?.remove()),
      );
    }
  }
}

customElements.define('archivable-notification', ArchivableNotificaton);
