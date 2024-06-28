import Cookies from "js-cookie";
import cls from "./chatbot.module.css";
import { Context, Language, Params } from "decorator-shared/params";
import { loadExternalScript } from "../utils";
import { env, param } from "../params";

class Chatbot extends HTMLElement {
    button: HTMLButtonElement;
    boost?: any;
    wasClicked = false;

    constructor() {
        super();
        this.button = document.createElement("button");
        this.button.addEventListener("click", () => {
            if (this.boost) {
                this.boost.chatPanel.show();
            } else {
                this.wasClicked = true;
            }
        });
    }

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
                env("ENV") === "production"
                    ? "https://nav.boost.ai/chatPanel/chatPanel.js"
                    : "https://navtest.boost.ai/chatPanel/chatPanel.js",
            );
            this.boost = window.boostInit(
                env("ENV") === "production" ? "nav" : "navtest",
                boostConfig({
                    conversationId: Cookies.get("nav-chatbot%3Aconversation"),
                    context: param("context"),
                    language: param("language"),
                }),
            );
            if (this.wasClicked) {
                this.wasClicked = false;
                this.boost.chatPanel.show();
            }
        }
    }
}

const boostConfig = ({
    conversationId,
    context,
    language,
}: {
    conversationId?: string;
    context: Context;
    language: Language;
}) => {
    return {
        chatPanel: {
            settings: {
                removeRememberedConversationOnChatPanelClose: true,
                conversationId,
                openTextLinksInNewTab: true,
            },
            styling: { buttons: { multiline: true } },
            header: {
                filters: {
                    filterValues:
                        context === "arbeidsgiver"
                            ? "arbeidsgiver"
                            : language === "nn"
                              ? "nynorsk"
                              : "bokmal",
                },
            },
        },
    };
};

customElements.define("d-chatbot", Chatbot);
