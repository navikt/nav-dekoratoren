import { analyticsEvents } from '../analytics/constants';
import * as api from '../api';

class ArchivableNotificaton extends HTMLElement {
    connectedCallback() {
        const id = this.getAttribute('data-id');
        if (id) {
            this.querySelector('button')?.addEventListener('click', () =>
                api.archive({ eventId: id }).then(() => {
                    this.parentElement?.remove();
                    window.logAmplitudeEvent(...analyticsEvents.akrivertBeskjed);
                })
            );
        }
    }
}

customElements.define('archivable-notification', ArchivableNotificaton);

class LinkNotification extends HTMLElement {
    connectedCallback() {
        const a = this.querySelector('a');
        if (a) {
            a.addEventListener('click', () => {
                window.logAmplitudeEvent('navigere', {
                    komponent: this.getAttribute('data-amplitude-komponent'),
                    kategori: 'varselbjelle',
                    destinasjon: a.href,
                });
            });
        }
    }
}

customElements.define('link-notification', LinkNotification);
