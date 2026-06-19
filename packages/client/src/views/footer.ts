import { paramsSchema, type ClientParams } from "decorator-shared/params";
import { logger } from "decorator-shared/logger";
import { updateDecoratorParams } from "../params";
import { analyticsClickListener } from "../analytics/analytics";
import { onParamsUpdated } from "../helpers/params-updated";
import { endpointUrlWithParams } from "../helpers/urls";
import { defineCustomElement } from "./custom-elements";

const paramsUpdatesToHandle: Array<keyof ClientParams> = [
    "feedback",
    "simple",
    "simpleFooter",
] as const;

class Footer extends HTMLElement {
    private unsubscribeParams?: () => void;

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
        this.unsubscribeParams = onParamsUpdated({
            keys: ["context", "language", "feedback", "simple", "simpleFooter"],
            update: this.refreshFooter,
        });
    }

    disconnectedCallback() {
        window.removeEventListener("message", this.handleMessage);
        this.unsubscribeParams?.();
    }
}

defineCustomElement("decorator-footer", Footer);
