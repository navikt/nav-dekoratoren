import { CustomEvents } from '../events';
import { ClientSideCache } from '../helpers/cache';
import { param } from '../params';

class UserMenu extends HTMLElement {
    private readonly responseCache = new ClientSideCache();

    private async fetchMenuHtml() {
        const url = window.makeEndpoint('/user-menu');

        return fetch(url, {
            credentials: 'include',
        }).then((res) => res.text());
    }

    private buildCacheKey() {
        return `${param('context')}_${param('language')}`;
    }

    // TODO: some sort of placeholder view while awaiting server response?
    private async populateLoggedInMenu() {
        const cacheKey = this.buildCacheKey();

        this.responseCache
            .get(cacheKey, () => this.fetchMenuHtml())
            .then((html) => {
                if (!html) {
                    // TODO: better error handling
                    console.error('Failed to fetch content for user-menu');
                    return;
                }

                this.innerHTML = html;
            });
    }

    private updateMenu = (e: CustomEvent<CustomEvents['paramsupdated']>) => {
        if (e.detail.params?.context) {
            this.populateLoggedInMenu();
        }
    };

    private connectedCallback() {
        window.addEventListener('paramsupdated', this.updateMenu);
    }

    private disconnectedCallback() {
        window.removeEventListener('paramsupdated', this.updateMenu);
    }
}

customElements.define('user-menu', UserMenu);
