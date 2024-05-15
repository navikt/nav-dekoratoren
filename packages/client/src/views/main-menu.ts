import { Context } from "decorator-shared/params";
import { CustomEvents } from "../events";
import { ResponseCache } from "decorator-shared/response-cache";
import { param } from "../params";
import { endpointUrlWithParams } from "../helpers/urls";

const TEN_MIN_MS = 10 * 60 * 1000;

class MainMenu extends HTMLElement {
    private readonly responseCache = new ResponseCache<string>({
        ttl: TEN_MIN_MS,
    });

    private async fetchMenuContent(context: Context) {
        const url = endpointUrlWithParams("/main-menu", { context });
        return fetch(url).then((res) => res.text());
    }

    private buildCacheKey(context: Context) {
        return `${context}_${param("language")}`;
    }

    private updateMenuContent = (context: Context) => {
        const cacheKey = this.buildCacheKey(context);

        this.responseCache
            .get(cacheKey, () => this.fetchMenuContent(context))
            .then((html) => {
                if (!html) {
                    // TODO: better error handling
                    console.error("Failed to fetch content for main-menu");
                    this.innerHTML = "Kunne ikke laste meny-innhold";
                    return;
                }

                this.innerHTML = html;
            });
    };

    private onContextChange = (
        e: CustomEvent<CustomEvents["activecontext"]>,
    ) => {
        this.updateMenuContent(e.detail.context);
    };

    private connectedCallback() {
        this.updateMenuContent(param("context"));
        window.addEventListener("activecontext", this.onContextChange);
    }

    private disconnectedCallback() {
        window.removeEventListener("activecontext", this.onContextChange);
    }
}

customElements.define("main-menu", MainMenu);
