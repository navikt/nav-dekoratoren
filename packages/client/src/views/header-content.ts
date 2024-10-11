import { defineCustomElement } from "./custom-elements";

class HeaderContent extends HTMLElement {
    private handleFocusOut = (e: FocusEvent) => {
        if (!this.contains(e.relatedTarget as Node)) {
            this.dispatchEvent(new Event("closemenus", { bubbles: true }));
        }
    };

    connectedCallback() {
        window.addEventListener("focusout", this.handleFocusOut);
    }

    disconnectedCallback() {
        window.removeEventListener("focusout", this.handleFocusOut);
    }
}

defineCustomElement("header-content", HeaderContent);
