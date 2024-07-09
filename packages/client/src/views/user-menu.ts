import cls from "../styles/user-menu.module.css";
import globalCls from "../styles/global.module.css";
import { defineCustomElement } from "../custom-elements";
import { CustomEvents } from "../events";
import { AuthDataResponse } from "decorator-shared/auth";

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
        auth = e.detail;
        this.update(auth);
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
