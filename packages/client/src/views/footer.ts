import { amplitudeClickListener } from "../analytics/amplitude";
import { defineCustomElement } from "../custom-elements";
import { endpointUrlWithParams } from "../helpers/urls";

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
