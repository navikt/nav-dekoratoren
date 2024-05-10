import { CustomEvents } from "../events";
import html from "decorator-shared/html";
import cls from "decorator-client/src/styles/user-menu.module.css";
import iconButtonCls from "decorator-client/src/styles/icon-button.module.css";
import { LoginButton } from "decorator-server/src/views/login-button";

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

        const html = e.detail.usermenuHtml;
        if (html) {
            this.innerHTML = html;
        } else {
            this.innerHTML = LoginButton(
                window.__DECORATOR_DATA__.texts,
            ).render();
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
