import { CustomEvents } from '../events';
import { LoginLevel } from 'decorator-shared/params';
import { makeEndpointFactory } from 'decorator-shared/urls';
import { env } from '../params';
import { Auth } from '../api';

class UserMenu extends HTMLElement {
    private readonly responseCache: Record<string, string> = {};
    private authState: Auth | null = null;

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

    private populateLoggedInMenu() {
        if (!this.authState?.authenticated) {
            return;
        }

        const context = window.__DECORATOR_DATA__.params.context;
        const cachedHtml = this.responseCache[context];

        if (cachedHtml) {
            console.log('Found user menu in cache');
            this.innerHTML = cachedHtml;
            return;
        }

        const url = makeEndpointFactory(() => window.__DECORATOR_DATA__.params, env('APP_URL'))('/user-menu', {
            name: this.authState.name,
            level: `Level${this.authState.securityLevel}` as LoginLevel,
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
        window.addEventListener('paramsupdated', this.updateMenu.bind(this));
        window.addEventListener('authupdated', this.updateAuthState.bind(this));
    }

    private disconnectedCallback() {
        window.removeEventListener('paramsupdated', this.updateMenu);
        window.removeEventListener('authupdated', this.updateAuthState);
    }
}

customElements.define('user-menu', UserMenu);
