import cls from "decorator-client/src/styles/user-menu.module.css";
import { defineCustomElement } from "../custom-elements";
import { CustomEvents } from "../events";

class UserMenu extends HTMLElement {
    private onAuthUpdated = (e: CustomEvent<CustomEvents["authupdated"]>) => {
        this.classList.add(cls.userMenuContainer);
        this.querySelector(`.${cls.loader}`)?.classList.add(cls.hidden);
        if (e.detail.auth.authenticated) {
            this.innerHTML = e.detail.usermenuHtml!;
        } else {
            this.querySelector("login-button")?.classList.remove(cls.hidden);
        }
    };

    connectedCallback() {
        window.addEventListener("authupdated", this.onAuthUpdated);
    }

    disconnectedCallback() {
        window.removeEventListener("authupdated", this.onAuthUpdated);
    }
}

defineCustomElement("user-menu", UserMenu);
