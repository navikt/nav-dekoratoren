import { type Context } from "decorator-shared/params";
import { param } from "../params";
import { defineCustomElement } from "./custom-elements";
import { analyticsClickListener } from "../analytics/analytics";
import { logger } from "../helpers/logger";
import { CustomEvents } from "../events";
import { decoratorApi, decoratorParams } from "../helpers/api";

const TEN_MINUTES = 10 * 60 * 1000;
const TEN_SECONDS = 10 * 1000;

class MainMenu extends HTMLElement {
    // The cache key for swr is the final url - including queryParams
    private readonly menuApi = decoratorApi.extend({
        swr: {
            fresh: TEN_MINUTES,
            // Serve a cached menu forever rather than blocking on the network,
            // and back off when the refresh behind it keeps failing (e.g. a
            // rolling deploy) instead of retrying on every switch.
            stale: Infinity,
            errorBackoff: TEN_SECONDS,
            onError: ({ url, error, response }) =>
                logger.error("Failed to refresh content for main-menu", {
                    error: error ?? response,
                    url,
                }),
        },
    });

    private updateMenuContent = async (context: Context) => {
        // A stale menu is served without a request, so this only rejects on a
        // cold miss - the failure has reached no other caller, and the error
        // message is what we have to render.
        const html = await this.menuApi("/main-menu", {
            query: decoratorParams({ context }),
            responseType: "text",
        }).catch((error: unknown) => {
            logger.error("Failed to fetch content for main-menu", { error });
            return "Kunne ikke laste meny-innhold";
        });

        // context changed while we were fetching, abort
        if (param("context") !== context) {
            logger.warn("Context changed while main-menu update was in-flight");
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
