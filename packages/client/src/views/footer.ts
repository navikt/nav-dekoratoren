import { amplitudeEvent } from "../analytics/amplitude";
import { defineCustomElement } from "../custom-elements";
import { endpointUrlWithParams } from "../helpers/urls";
import { param } from "../params";

class Footer extends HTMLElement {
    handleParamsUpdated = (e: CustomEvent) => {
        if (e.detail.params.language || e.detail.params.context) {
            fetch(endpointUrlWithParams("/footer"))
                .then((res) => res.text())
                .then((footer) => (this.innerHTML = footer));
        }
    };

    connectedCallback() {
        this.addEventListener("click", (event: MouseEvent) => {
            if (event.target instanceof HTMLAnchorElement) {
                const url = event.target.getAttribute("href");

                if (url && url !== "#") {
                    amplitudeEvent({
                        context: param("context"),
                        action: `kontakt/${url}`,
                        category: "dekorator-footer",
                        label: url,
                    });
                }
            }
        });

        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }

    disconnectedCallback() {
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("decorator-footer", Footer);
