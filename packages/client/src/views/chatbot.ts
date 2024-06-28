import Cookies from "js-cookie";
import cls from "./chatbot.module.css";

class Chatbot extends HTMLElement {
    connectedCallback() {}

    static observedAttributes = ["data-chatbot", "data-chatbot-visible"];

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === "data-chatbot" && newValue === null) {
            this.innerHTML = "";
        } else if (
            name === "data-chatbot" &&
            this.innerHTML === "" &&
            newValue !== null
        ) {
            const button = document.createElement("button");
            if (
                this.getAttribute("data-chatbot-visible") !== null ||
                Cookies.get("nav-chatbot%3Aconversation")
            ) {
                button.classList.add(cls.visible);
            }
            this.appendChild(button);
        } else if (name === "data-chatbot-visible") {
            const button = this.childNodes[0] as HTMLElement | undefined;
            if (
                newValue !== null ||
                Cookies.get("nav-chatbot%3Aconversation")
            ) {
                button?.classList.add(cls.visible);
            } else {
                button?.classList.remove(cls.visible);
            }
        }
    }
}

customElements.define("d-chatbot", Chatbot);
