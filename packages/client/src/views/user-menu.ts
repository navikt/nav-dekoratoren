import { CustomEvents } from "../events";
import html from "decorator-shared/html";
import cls from "decorator-client/src/styles/user-menu.module.css";
import iconButtonCls from "decorator-client/src/styles/icon-button.module.css";

const Loader = html`
    <span class="${cls.loader} ${iconButtonCls.iconButtonSpan}">Laster</span>
`;

class UserMenu extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = Loader.render();
    }

    private onAuthUpdated = (e: CustomEvent<CustomEvents["authupdated"]>) => {
        this.classList.add(cls.userMenuContainer);
        this.innerHTML = e.detail.usermenuHtml;
    };

    private connectedCallback() {
        window.addEventListener("authupdated", this.onAuthUpdated);
    }

    private disconnectedCallback() {
        window.removeEventListener("authupdated", this.onAuthUpdated);
    }
}

customElements.define("user-menu", UserMenu);
