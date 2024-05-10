import { env, param } from "../params";

class LoginButton extends HTMLElement {
    handleClick() {
        const loginLevel = param("level") || "Level4";
        window.location.href = `${env("LOGIN_URL")}?redirect=${window.location.href}&level=${loginLevel}`;
    }

    connectedCallback() {
        this.addEventListener("click", this.handleClick);
    }
}

customElements.define("login-button", LoginButton);
