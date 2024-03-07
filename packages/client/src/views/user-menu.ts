import { CustomEvents } from '../events';
import { makeEndpointFactory } from 'decorator-shared/urls';
import { env } from '../params';
import { Auth, AuthLoggedIn } from '../api';

class UserMenu extends HTMLElement {
    private readonly responseCache: Record<string, string> = {};

    // TODO: use a global auth state instead?
    private authState: Auth = {
        authenticated: false,
    };

    private async fetchMenuHtml(auth: AuthLoggedIn) {
        const url = makeEndpointFactory(() => window.__DECORATOR_DATA__.params, env('APP_URL'))('/user-menu', {
            name: auth.name,
            level: `Level${auth.securityLevel}`,
        });

        return fetch(url, {
            credentials: 'include',
        }).then((res) => res.text());
    }

    private getCacheKey(auth: AuthLoggedIn) {
        const { context, language } = window.__DECORATOR_DATA__.params;
        return `${context}_${language}_${auth.securityLevel}`;
    }

    private async populateLoggedInMenu() {
        // TODO: some sort of placeholder while awaiting auth state?
        if (!this.authState.authenticated) {
            return;
        }

        const cacheKey = this.getCacheKey(this.authState);
        const cachedHtml = this.responseCache[cacheKey];

        if (cachedHtml) {
            this.innerHTML = cachedHtml;
            return;
        }

        this.fetchMenuHtml(this.authState)
            .then((html) => {
                if (!html) {
                    throw Error('No HTML found!');
                }

                this.innerHTML = html;
                this.responseCache[cacheKey] = html;
            })
            .catch((e) => {
                console.error(`Failed to fetch logged in menu - ${e}`);
                // TODO: better error handling
                this.innerHTML = 'Kunne ikke laste innlogget meny';
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
