import { AuthDataResponse } from "decorator-shared/auth";
import { CustomEvents } from "../events";
import cls from "../styles/user-menu.module.css";
import utils from "../styles/utils.module.css";
import { defineCustomElement } from "./custom-elements";

let auth: AuthDataResponse;

class UserMenu extends HTMLElement {
    private update = (auth: AuthDataResponse) => {
        this.classList.add(cls.userMenuContainer);
        this.querySelector(`.${cls.loader}`)?.classList.add(utils.hidden);
        if (auth.auth.authenticated) {
            this.innerHTML = auth.usermenuHtml!;
        } else {
            this.querySelector("login-button")?.classList.remove(utils.hidden);
        }
    };

    private onAuthUpdated = (e: CustomEvent<CustomEvents["authupdated"]>) => {
        this.update(e.detail);
    };

    connectedCallback() {
        window.addEventListener("authupdated", this.onAuthUpdated);
        if (auth) {
            this.update(auth);
        }
    }

    disconnectedCallback() {
        window.removeEventListener("authupdated", this.onAuthUpdated);
    }
}

defineCustomElement("user-menu", UserMenu);
