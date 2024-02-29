import { CustomEvents } from '../events';
import { Auth } from '../api';
import * as api from '../api';
import { LoginLevel } from 'decorator-shared/params';
import { makeEndpointFactory } from 'decorator-shared/urls';
import { env } from '../params';

class UserMenu extends HTMLElement {
    private readonly responseCache: Record<string, string> = {};

    constructor() {
        super();
        this.populateLoggedInMenu();
    }

    private update(e: CustomEvent<CustomEvents['paramsupdated']>) {
        const contextFromParams = e.detail.params?.context;
        if (!contextFromParams) {
            return;
        }

        this.populateLoggedInMenu();
    }

    private async populateLoggedInMenu() {
        const auth = await api.checkAuth();
        const context = window.__DECORATOR_DATA__.params.context;

        const fromCache = this.responseCache[context];

        if (fromCache) {
            console.log('Found in cache');
            this.innerHTML = fromCache;
            return;
        }

        const url = makeEndpointFactory(() => window.__DECORATOR_DATA__.params, env('APP_URL'))('/user-menu', {
            name: auth.name,
            level: `Level${auth.securityLevel}` as LoginLevel,
        });

        fetch(url, {
            credentials: 'include',
        })
            .then((res) => res.text())
            .then((html) => {
                this.innerHTML = html;
                this.responseCache[context] = html;
            });
    }

    private connectedCallback() {
        window.addEventListener('paramsupdated', this.update.bind(this));
    }

    private disconnectedCallback() {
        window.removeEventListener('paramsupdated', this.update);
    }
}

customElements.define('user-menu', UserMenu);
