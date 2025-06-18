import type { ClientParams } from "decorator-shared/params";
import { updateDecoratorParams } from "../params";
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
