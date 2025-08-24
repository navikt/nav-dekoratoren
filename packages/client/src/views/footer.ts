import type { ClientParams } from "decorator-shared/params";
import { updateDecoratorParams } from "../params";
import { analyticsClickListener } from "../analytics/analytics";
import {
    endpointUrlWithoutParams,
    endpointUrlWithParams,
} from "../helpers/urls";
import { defineCustomElement } from "./custom-elements";

const paramsUpdatesToHandle: Array<keyof ClientParams> = [
    "feedback",
    "simple",
    "simpleFooter",
] as const;

class Footer extends HTMLElement {
    private lastSeenMenuVersion: number | null = null;
    private menuVersionInterval: number | null = null;

    private readonly handleMessage = (e: MessageEvent) => {
        const { event, payload } = e.data;
        if (event == "params") {
            paramsUpdatesToHandle.forEach((key) => {
                if (payload[key] !== undefined) {
                    // TODO: validation
                    updateDecoratorParams({
                        [key]: payload[key],
                    });
                }
            });
        }
    };

    private readonly refreshFooter = () => {
        fetch(endpointUrlWithParams("/footer"))
            .then((res) => res.text())
            .then((footer) => (this.innerHTML = footer));
    };

    private readonly handleParamsUpdated = (e: CustomEvent) => {
        const { context, language, feedback, simple, simpleFooter } =
            e.detail.params;
        const isFeedbackChange = feedback !== undefined;
        const isSimpleChange = simple !== undefined;
        const isSimpleFooterChange = simpleFooter !== undefined;

        if (
            context ||
            language ||
            isFeedbackChange ||
            isSimpleChange ||
            isSimpleFooterChange
        ) {
            this.refreshFooter();
        }
    };

    private async fetchMenuVersion(): Promise<number | null> {
        try {
            const res = await fetch(
                endpointUrlWithoutParams("/api/menu-version"),
                { cache: "no-store" },
            );
            if (!res.ok) return null;
            const data = await res.json();
            return typeof data.version === "number" ? data.version : null;
        } catch {
            return null;
        }
    }

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

        this.fetchMenuVersion().then((version) => {
            if (version !== null) {
                this.lastSeenMenuVersion = version;
            }
        });

        const POLL_MS = 60000; //TODO: consider less frequent polling

        this.menuVersionInterval = window.setInterval(async () => {
            const fetchedMenuVersion = await this.fetchMenuVersion();

            if (
                fetchedMenuVersion !== null &&
                this.lastSeenMenuVersion !== null &&
                fetchedMenuVersion > this.lastSeenMenuVersion
            ) {
                this.lastSeenMenuVersion = fetchedMenuVersion;
                this.refreshFooter();
            }
        }, POLL_MS);
    }

    disconnectedCallback() {
        window.removeEventListener("message", this.handleMessage);
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);

        if (this.menuVersionInterval) {
            clearInterval(this.menuVersionInterval);
            this.menuVersionInterval = null;
        }
    }
}

defineCustomElement("decorator-footer", Footer);
