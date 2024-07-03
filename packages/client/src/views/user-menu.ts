import { CustomEvents } from "../events";
import html from "decorator-shared/html";
import cls from "decorator-client/src/styles/user-menu.module.css";
import iconButtonCls from "decorator-client/src/styles/icon-button.module.css";
import i18n from "../i18n";
import { registerCustomElement } from "../custom-elements";

const Loader = () => html`
    <span class="${cls.loader} ${iconButtonCls.iconButtonSpan}"
        >${i18n("loading")}</span
    >
`;

class UserMenu extends HTMLElement {
    private onAuthUpdated = (e: CustomEvent<CustomEvents["authupdated"]>) => {
        this.classList.add(cls.userMenuContainer);
        this.innerHTML = e.detail.usermenuHtml;
    };

    connectedCallback() {
        this.innerHTML = Loader().render(window.__DECORATOR_DATA__.params);
        window.addEventListener("authupdated", this.onAuthUpdated);
    }

    disconnectedCallback() {
        window.removeEventListener("authupdated", this.onAuthUpdated);
    }
}

registerCustomElement("user-menu", UserMenu);
