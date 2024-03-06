import { CustomEvents } from '../events';
import { LoginLevel } from 'decorator-shared/params';
import { makeEndpointFactory } from 'decorator-shared/urls';
import { env } from '../params';
import { Auth } from '../api';

class UserMenu extends HTMLElement {
    private readonly responseCache: Record<string, string> = {};

    // TODO: use a global auth state instead?
    private authState: Auth = {
        authenticated: false,
    };

    private updateAuthState(e: CustomEvent<CustomEvents['authupdated']>) {
        this.authState = e.detail.auth;
        this.populateLoggedInMenu();
    }

    private updateMenu(e: CustomEvent<CustomEvents['paramsupdated']>) {
        const contextFromParams = e.detail.params?.context;
        if (!contextFromParams) {
            return;
        }

        this.populateLoggedInMenu();
    }

    private async fetchMenuHtml() {
        const url = makeEndpointFactory(() => window.__DECORATOR_DATA__.params, env('APP_URL'))('/user-menu', {
            name: this.authState.name,
            level: `Level${this.authState.securityLevel}` as LoginLevel,
        });

        return fetch(url, {
            credentials: 'include',
        }).then((res) => res.text());
    }

    private getCacheKey() {
        const { context, level, language } = window.__DECORATOR_DATA__.params;
        return `${context}_${language}_${level}`;
    }

    private async populateLoggedInMenu() {
        // TODO: some sort of placeholder while awaiting auth state?
        if (!this.authState.authenticated) {
            return;
        }

        const cacheKey = this.getCacheKey();
        const cachedHtml = this.responseCache[cacheKey];

        if (cachedHtml) {
            this.innerHTML = cachedHtml;
            return;
        }

        this.fetchMenuHtml()
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

    private connectedCallback() {
        window.addEventListener('paramsupdated', this.updateMenu.bind(this));
        window.addEventListener('authupdated', this.updateAuthState.bind(this));
    }

    private disconnectedCallback() {
        window.removeEventListener('paramsupdated', this.updateMenu);
        window.removeEventListener('authupdated', this.updateAuthState);
    }
}

customElements.define('user-menu', UserMenu);
