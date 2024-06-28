import Cookies from "js-cookie";
import cls from "./chatbot.module.css";
import { Params } from "decorator-shared/params";
import { loadExternalScript } from "../utils";

class Chatbot extends HTMLElement {
    button: HTMLButtonElement = document.createElement("button");

    connectedCallback() {
        window.addEventListener("paramsupdated", (event: CustomEvent) =>
            this.update(event.detail.params),
        );
        this.update(window.__DECORATOR_DATA__.params);
    }

    async update({ chatbot, chatbotVisible }: Partial<Params>) {
        if (
            !window.__DECORATOR_DATA__.features["dekoratoren.chatbotscript"] ||
            chatbot === false
        ) {
            this.innerHTML = "";
        } else if (chatbot) {
            this.appendChild(this.button);
        }
        this.button.classList.toggle(
            cls.visible,
            chatbotVisible || !!Cookies.get("nav-chatbot%3Aconversation"),
        );

        if (chatbotVisible || !!Cookies.get("nav-chatbot%3Aconversation")) {
            await loadExternalScript(
                "https://nav.boost.ai/chatPanel/chatPanel.js",
            );
        }
    }
}

customElements.define("d-chatbot", Chatbot);
