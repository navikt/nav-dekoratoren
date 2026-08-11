import { type Context } from "decorator-shared/params";
import { ResponseCache } from "decorator-shared/response-cache";
import { param } from "../params";
import { defineCustomElement } from "./custom-elements";
import { analyticsClickListener } from "../analytics/analytics";
import { logger } from "../helpers/logger";
import { CustomEvents } from "../events";
import { decoratorApi, decoratorParams } from "../helpers/api";

const TEN_MIN_MS = 10 * 60 * 1000;
const TEN_SECONDS_MS = 10 * 1000;

class MainMenu extends HTMLElement {
    private readonly responseCache = new ResponseCache<string>({
        ttl: TEN_MIN_MS,
        suppressRetryForMs: TEN_SECONDS_MS,
        logger,
    });

    private async fetchMenuContent(context: Context) {
        return decoratorApi("/main-menu", {
            query: decoratorParams({ context }),
            responseType: "text",
        });
    }

    private buildCacheKey(context: Context) {
        return `${context}_${param("language")}`;
    }

    private updateMenuContent = async (context: Context) => {
        const cacheKey = this.buildCacheKey(context);
        let html: string | null = null;
        html = await this.responseCache.get(cacheKey, () =>
            this.fetchMenuContent(context),
        );
        // context changed while we were fetching, abort
        if (param("context") !== context) return;
        // responseCache returns null on failures and will have already logged the error
        if (!html) {
            logger.error("Failed to fetch content for main-menu");
            this.innerHTML = "Kunne ikke laste meny-innhold";
            return;
        }

        this.innerHTML = html;
    };

    handleParamsUpdated = (
        event: CustomEvent<CustomEvents["paramsupdated"]>,
    ) => {
        if (event.detail.changedKeys.includes("context")) {
            this.updateMenuContent(event.detail.params.context);
        }
    };

    connectedCallback() {
        window.addEventListener("paramsupdated", this.handleParamsUpdated);

        this.updateMenuContent(param("context"));

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
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("main-menu", MainMenu);
