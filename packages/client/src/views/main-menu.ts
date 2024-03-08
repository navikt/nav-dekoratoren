import { Context } from 'decorator-shared/params';
import { CustomEvents } from '../events';
import { ClientSideCache } from '../helpers/cache';
import { param } from '../params';

class MainMenu extends HTMLElement {
    private readonly responseCache = new ClientSideCache();

    private async fetchMenuContent(context: Context) {
        const url = window.makeEndpoint('/main-menu', { context });
        return fetch(url).then((res) => res.text());
    }

    private buildCacheKey(context: Context) {
        return `${context}_${param('language')}`;
    }

    private updateMenuContent = (context?: Context) => {
        const contextActual = context || param('context');
        const cacheKey = this.buildCacheKey(contextActual);

        this.responseCache
            .get(cacheKey, () => this.fetchMenuContent(contextActual))
            .then((html) => {
                if (!html) {
                    // TODO: better error handling
                    console.error('Failed to fetch content for main-menu');
                    this.innerHTML = 'Kunne ikke laste meny-innhold';
                    return;
                }

                this.innerHTML = html;
            });
    };

    private onContextChange = (e: CustomEvent<CustomEvents['activecontext']>) => {
        this.updateMenuContent(e.detail.context);
    };

    private connectedCallback() {
        window.addEventListener('activecontext', this.onContextChange);
        setTimeout(() => this.updateMenuContent(), 0);
    }

    private disconnectedCallback() {
        window.removeEventListener('activecontext', this.onContextChange);
    }
}

customElements.define('main-menu', MainMenu);
