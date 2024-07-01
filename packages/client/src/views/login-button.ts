import { env, param } from "../params";

class LoginButton extends HTMLElement {
    connectedCallback() {
        this.addEventListener("click", () => {
            window.location.href = `${env("LOGIN_URL")}?redirect=${window.location.href}&level=${param("level") || "Level4"}`;
        });
    }
}

customElements.define("login-button", LoginButton);
