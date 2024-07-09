import { defineCustomElement } from "../custom-elements";
import { endpointUrlWithParams } from "../helpers/urls";

class Footer extends HTMLElement {
    handleParamsUpdated = (e: CustomEvent) => {
        if (e.detail.params.language || e.detail.params.context) {
            fetch(endpointUrlWithParams("/footer"))
                .then((res) => res.text())
                .then((footer) => (this.innerHTML = footer));
        }
    };

    connectedCallback() {
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }

    disconnectedCallback() {
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("decorator-footer", Footer);