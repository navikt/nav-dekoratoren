import { CustomEvents } from "../events";

class UserMenu extends HTMLElement {
    private onAuthUpdated = (e: CustomEvent<CustomEvents["authupdated"]>) => {
        this.innerHTML = e.detail.usermenuHtml || "Tom HTML";
    };

    private connectedCallback() {
        window.addEventListener("authupdated", this.onAuthUpdated);
    }

    private disconnectedCallback() {
        window.removeEventListener("authupdated", this.onAuthUpdated);
    }
}

customElements.define("user-menu", UserMenu);
