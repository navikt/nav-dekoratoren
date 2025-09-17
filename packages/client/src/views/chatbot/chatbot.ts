import type { ClientParams } from "decorator-shared/params";
import { cdnUrl } from "../../helpers/urls";
import { defineCustomElement } from "../custom-elements";
import i18n from "../i18n";
import { hasActiveConversation, initBoost, loadScript } from "./boost";
import cls from "./chatbot.module.css";
import frida from "./frida.svg";

class Chatbot extends HTMLElement {
    private readonly button: HTMLButtonElement;
    private boost?: Awaited<ReturnType<typeof initBoost>>;

    constructor() {
        super();

        this.button = document.createElement("button");
        this.button.addEventListener("click", async () => {
            if (!this.boost) {
                this.boost = await initBoost();
            }
            this.boost.show();
        });
        this.button.id = "chatbot-frida-knapp";
        this.button.setAttribute(
            "aria-label",
            i18n("open_chat").render(window.__DECORATOR_DATA__.params),
        );
        this.button.classList.add(cls.button);

        const div = document.createElement("div");
        div.classList.add(cls.chatbotWrapper);
        const img = document.createElement("img");
        img.src = cdnUrl(frida);
        img.alt = "";
        img.classList.add(cls.frida);
        div.appendChild(img);

        this.button.appendChild(div);
    }

    connectedCallback() {
        window.addEventListener("paramsupdated", this.paramsUpdatedListener);
        this.update(window.__DECORATOR_DATA__.params);
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.paramsUpdatedListener);
    }

    private paramsUpdatedListener = (event: CustomEvent) =>
        this.update(event.detail.params);

    private update = ({ chatbot, chatbotVisible }: Partial<ClientParams>) => {
        if (
            !window.__DECORATOR_DATA__.features["dekoratoren.chatbotscript"] ||
            chatbot === false
        ) {
            this.innerHTML = "";
        } else if (chatbot) {
            this.appendChild(this.button);
        }

        const isVisible = chatbotVisible || hasActiveConversation();
        this.button.classList.toggle(cls.visible, isVisible);

        if (isVisible) {
            loadScript();
        }
    };
}

defineCustomElement("d-chatbot", Chatbot);
