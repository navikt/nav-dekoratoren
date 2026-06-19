import { type Context } from "decorator-shared/params";
import { ResponseCache } from "decorator-shared/response-cache";
import { endpointUrlWithParams } from "../helpers/urls";
import { onParamsUpdated } from "../helpers/params-updated";
import { param } from "../params";
import { defineCustomElement } from "./custom-elements";
import { analyticsClickListener } from "../analytics/analytics";
import { logger } from "decorator-shared/logger";

const TEN_MIN_MS = 10 * 60 * 1000;

class MainMenu extends HTMLElement {
    private readonly responseCache = new ResponseCache<string>({
        ttl: TEN_MIN_MS,
    });
    private unsubscribeParams?: () => void;

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
                    logger.error("Failed to fetch content for main-menu");
                    this.innerHTML = "Kunne ikke laste meny-innhold";
                    return;
                }

                this.innerHTML = html;
            });
    };

    connectedCallback() {
        this.unsubscribeParams = onParamsUpdated({
            keys: ["context"],
            update: ({ context }) => this.updateMenuContent(context),
        });

        if (!param("ssrMainMenu")) {
            this.updateMenuContent(param("context"));
        }

        this.addEventListener(
            "click",
            analyticsClickListener((anchor) => ({
                kategori: "dekorator-meny",
                lenkegruppe:
                    anchor.getAttribute("data-lenkegruppe") ?? undefined,
                lenketekst:
                    anchor.getAttribute("data-context") ?? //context-links
                    anchor.innerText,
            })),
        );
    }

    disconnectedCallback() {
        this.unsubscribeParams?.();
    }
}

defineCustomElement("main-menu", MainMenu);
