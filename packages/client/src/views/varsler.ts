import * as api from '../api';

export const fetchVarsler = () =>
  fetch(`${import.meta.env.VITE_DECORATOR_BASE_URL}/api/varsler`, {
    credentials: 'include',
  }).then((response) => response.text());

class DismissableNotificaton extends HTMLElement {
  connectedCallback() {
    const eventId = this.getAttribute('data-event-id');
    if (eventId) {
      this.querySelector('button')?.addEventListener('click', () =>
        api.inaktiver({ eventId }).then(() => this.parentElement?.remove()),
      );
    }
  }
}

customElements.define('dismissable-notification', DismissableNotificaton);
