import { CustomEvents } from "../events";

class UserMenu extends HTMLElement {
    private onAuthUpdated = (e: CustomEvent<CustomEvents["authupdated"]>) => {
        const html = e.detail.usermenuHtml;
        if (html) {
            this.innerHTML = html;
        }
    };

    private connectedCallback() {
        window.addEventListener("authupdated", this.onAuthUpdated);
    }

    private disconnectedCallback() {
        window.removeEventListener("authupdated", this.onAuthUpdated);
    }
}

customElements.define("user-menu", UserMenu);
