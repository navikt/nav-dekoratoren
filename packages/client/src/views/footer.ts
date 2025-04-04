import { analyticsClickListener } from "../analytics/analytics";
import { endpointUrlWithParams } from "../helpers/urls";
import { defineCustomElement } from "./custom-elements";

class Footer extends HTMLElement {
    handleParamsUpdated = (e: CustomEvent) => {
        if (
            e.detail.params.language ||
            e.detail.params.context ||
            e.detail.params.feedback !== undefined
        ) {
            fetch(endpointUrlWithParams("/footer"))
                .then((res) => res.text())
                .then((footer) => (this.innerHTML = footer));
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

        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("decorator-footer", Footer);
