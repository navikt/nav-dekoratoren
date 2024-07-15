import { Context } from "decorator-shared/params";
import { ResponseCache } from "decorator-shared/response-cache";
import { amplitudeClickListener } from "../analytics/amplitude";
import { defineCustomElement } from "./custom-elements";
import { endpointUrlWithParams } from "../helpers/urls";
import { param } from "../params";

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

    handleParamsUpdated = (event: CustomEvent) => {
        if (event.detail.params.context) {
            this.updateMenuContent(event.detail.params.context);
        }
    };

    connectedCallback() {
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
        this.updateMenuContent(param("context"));
        this.addEventListener(
            "click",
            amplitudeClickListener((anchor) => ({
                category: "dekorator-meny",
                action:
                    anchor.getAttribute("data-action") ??
                    "hovedmeny/forsidelenke",
                label: anchor.getAttribute("data-label") ?? anchor.href,
            })),
        );
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("main-menu", MainMenu);
