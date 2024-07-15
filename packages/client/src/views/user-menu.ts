import { AuthDataResponse } from "decorator-shared/auth";
import { CustomEvents } from "../events";
import globalCls from "../styles/global.module.css";
import cls from "../styles/user-menu.module.css";
import { defineCustomElement } from "./custom-elements";

let auth: AuthDataResponse;

class UserMenu extends HTMLElement {
    private update = (auth: AuthDataResponse) => {
        this.classList.add(cls.userMenuContainer);
        this.querySelector(`.${cls.loader}`)?.classList.add(globalCls.hidden);
        if (auth.auth.authenticated) {
            this.innerHTML = auth.usermenuHtml!;
        } else {
            this.querySelector("login-button")?.classList.remove(
                globalCls.hidden,
            );
        }
    };

    private onAuthUpdated = (e: CustomEvent<CustomEvents["authupdated"]>) => {
        this.update((auth = e.detail));
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
