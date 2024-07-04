import cls from "../styles/user-menu.module.css";
import globalCls from "../styles/global.module.css";
import { defineCustomElement } from "../custom-elements";
import { CustomEvents } from "../events";

class UserMenu extends HTMLElement {
    private onAuthUpdated = (
        e: CustomEvent<CustomEvents["client-state-updated"]>,
    ) => {
        this.classList.add(cls.userMenuContainer);
        this.querySelector(`.${cls.loader}`)?.classList.add(globalCls.hidden);
        if (e.detail.auth.authenticated) {
            this.innerHTML = e.detail.usermenuHtml!;
        } else {
            this.querySelector("login-button")?.classList.remove(
                globalCls.hidden,
            );
        }
    };

    connectedCallback() {
        window.addEventListener("client-state-updated", this.onAuthUpdated);
    }

    disconnectedCallback() {
        window.removeEventListener("client-state-updated", this.onAuthUpdated);
    }
}

defineCustomElement("user-menu", UserMenu);
