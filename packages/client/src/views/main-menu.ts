import { formatParams } from 'decorator-shared/json';
import { Context } from 'decorator-shared/params';
import { CustomEvents } from '../events';
import { ClientSideCache } from '../helpers/cache';

class MainMenu extends HTMLElement {
    private readonly responseCache = new ClientSideCache();

    private fetchMenuContent = (context: Context) =>
        fetch(
            `${window.__DECORATOR_DATA__.env.APP_URL}/main-menu?${formatParams({
                ...window.__DECORATOR_DATA__.params,
                context,
            })}`
        ).then((response) => response.text());

    private buildCacheKey(context: Context) {
        const { language } = window.__DECORATOR_DATA__.params;
        return `${context}_${language}`;
    }

    private updateMenuContent = (context?: Context) => {
        const contextActual = context || window.__DECORATOR_DATA__.params.context;
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
