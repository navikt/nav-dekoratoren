import type { ClientParams } from "decorator-shared/params";
import { updateDecoratorParams } from "../params";
import { analyticsClickListener } from "../analytics/analytics";
import {
    endpointUrlWithParams,
    endpointUrlWithoutParams,
} from "../helpers/urls";
import { defineCustomElement } from "./custom-elements";

const paramsUpdatesToHandle: Array<keyof ClientParams> = [
    "feedback",
    "simple",
    "simpleFooter",
] as const;

class Footer extends HTMLElement {
    private menuVersion?: number;
    private versionPollId?: number;
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

    private readonly pollMenuVersion = async () => {
        try {
            const res = await fetch(
                endpointUrlWithoutParams("/api/menu-version"),
                {
                    cache: "no-store",
                },
            );
            if (!res.ok) return;
            const data = (await res.json()) as { version?: number };
            if (typeof data.version === "number") {
                if (this.menuVersion === undefined) {
                    this.menuVersion = data.version;
                } else if (data.version !== this.menuVersion) {
                    this.menuVersion = data.version;
                    this.refreshFooter();
                }
            }
        } catch {
            // noop
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

        // Start polling for menu updates so footer refreshes when content changes in XP
        this.pollMenuVersion();
        this.versionPollId = window.setInterval(this.pollMenuVersion, 30000);
    }

    disconnectedCallback() {
        window.removeEventListener("message", this.handleMessage);
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
        if (this.versionPollId) {
            clearInterval(this.versionPollId);
        }
    }
}

defineCustomElement("decorator-footer", Footer);
