import { paramsSchema, type ClientParams } from "decorator-shared/params";
import { logger } from "decorator-shared/logger";
import { updateDecoratorParams } from "../params";
import { CustomEvents } from "../events";
import { analyticsClickListener } from "../analytics/analytics";
import { endpointUrlWithParams } from "../helpers/urls";
import { defineCustomElement } from "./custom-elements";

const paramsUpdatesToHandle: Array<keyof ClientParams> = [
    "feedback",
    "simple",
    "simpleFooter",
] as const;

class Footer extends HTMLElement {
    private readonly handleMessage = (e: MessageEvent) => {
        const { event, payload } = e.data;
        if (event == "params") {
            const updates = Object.fromEntries(
                paramsUpdatesToHandle
                    .filter((key) => payload[key] !== undefined)
                    .map((key) => [key, payload[key]]),
            ) as Partial<ClientParams>;
            const updateKeys = Object.keys(updates) as (keyof ClientParams)[];
            if (updateKeys.length === 0) return;
            const validated = paramsSchema.partial().safeParse(updates);
            if (validated.success) {
                updateDecoratorParams(
                    Object.fromEntries(
                        updateKeys.map((key) => [key, validated.data[key]]),
                    ) as Partial<ClientParams>,
                );
            } else {
                logger.warn("Invalid params from postMessage", {
                    error: validated.error,
                });
            }
        }
    };

    private readonly refreshFooter = () => {
        fetch(endpointUrlWithParams("/footer"))
            .then((res) => res.text())
            .then((footer) => (this.innerHTML = footer));
    };

    private readonly handleParamsUpdated = (
        e: CustomEvent<CustomEvents["paramsupdated"]>,
    ) => {
        const { changedKeys } = e.detail;
        if (
            changedKeys.includes("context") ||
            changedKeys.includes("language") ||
            changedKeys.includes("feedback") ||
            changedKeys.includes("simple") ||
            changedKeys.includes("simpleFooter")
        ) {
            this.refreshFooter();
        }
    };

    connectedCallback() {
        this.addEventListener(
            "click",
            analyticsClickListener((anchor) => ({
                kategori: "dekorator-footer",
                lenkegruppe:
                    anchor.getAttribute("data-lenkegruppe") ?? undefined,
                lenketekst: anchor.innerText ?? undefined,
            })),
        );
        window.addEventListener("message", this.handleMessage);
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }

    disconnectedCallback() {
        window.removeEventListener("message", this.handleMessage);
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("decorator-footer", Footer);
