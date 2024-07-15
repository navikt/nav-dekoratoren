import { amplitudeClickListener } from "../analytics/amplitude";
import { endpointUrlWithParams } from "../helpers/urls";
import { defineCustomElement } from "./custom-elements";

class Footer extends HTMLElement {
    handleParamsUpdated = (e: CustomEvent) => {
        if (e.detail.params.language || e.detail.params.context) {
            fetch(endpointUrlWithParams("/footer"))
                .then((res) => res.text())
                .then((footer) => (this.innerHTML = footer));
        }
    };

    connectedCallback() {
        this.addEventListener(
            "click",
            amplitudeClickListener(({ href }) =>
                href && href !== "#"
                    ? {
                          action: `kontakt/${href}`,
                          category: "dekorator-footer",
                      }
                    : null,
            ),
        );

        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }

    disconnectedCallback() {
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("decorator-footer", Footer);
