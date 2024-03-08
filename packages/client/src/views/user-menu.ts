import { CustomEvents } from '../events';
import { Auth, AuthLoggedIn } from '../api';
import { ClientSideCache } from '../helpers/cache';
import { param } from '../params';

class UserMenu extends HTMLElement {
    private readonly responseCache = new ClientSideCache();

    // TODO: use a global auth state instead?
    private authState: Auth = {
        authenticated: false,
    };

    private async fetchMenuHtml(name: string, securityLevel: AuthLoggedIn['securityLevel']) {
        const url = window.makeEndpoint('/user-menu', {
            name,
            level: `Level${securityLevel}`,
        });

        return fetch(url, {
            credentials: 'include',
        }).then((res) => res.text());
    }

    private buildCacheKey(auth: AuthLoggedIn) {
        return `${param('context')}_${param('language')}_${auth.securityLevel}`;
    }

    private async populateLoggedInMenu() {
        // TODO: some sort of placeholder while awaiting auth state?
        if (!this.authState.authenticated) {
            return;
        }

        const cacheKey = this.buildCacheKey(this.authState);
        const { name, securityLevel } = this.authState;

        this.responseCache
            .get(cacheKey, () => this.fetchMenuHtml(name, securityLevel))
            .then((html) => {
                if (!html) {
                    // TODO: better error handling
                    console.error('Failed to fetch content for user-menu');
                    this.innerHTML = 'Kunne ikke laste innlogget meny';
                    return;
                }

                this.innerHTML = html;
            });
    }

    private updateAuthState = (e: CustomEvent<CustomEvents['authupdated']>) => {
        this.authState = e.detail.auth;
        this.populateLoggedInMenu();
    };

    private updateMenu = (e: CustomEvent<CustomEvents['paramsupdated']>) => {
        if (e.detail.params?.context) {
            this.populateLoggedInMenu();
        }
    };

    private connectedCallback() {
        window.addEventListener('paramsupdated', this.updateMenu);
        window.addEventListener('authupdated', this.updateAuthState);
    }

    private disconnectedCallback() {
        window.removeEventListener('paramsupdated', this.updateMenu);
        window.removeEventListener('authupdated', this.updateAuthState);
    }
}

customElements.define('user-menu', UserMenu);
