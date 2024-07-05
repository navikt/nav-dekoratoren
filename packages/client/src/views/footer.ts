import { formatParams } from "decorator-shared/json";
import { defineCustomElement } from "../custom-elements";
import { env } from "../params";

class Footer extends HTMLElement {
    handleParamsUpdated = (e: CustomEvent) => {
        if (e.detail.params.language) {
            fetch(
                `${env("APP_URL")}/footer?${formatParams(window.__DECORATOR_DATA__.params)}`,
            )
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
