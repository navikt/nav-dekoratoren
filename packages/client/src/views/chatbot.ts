import Cookies from "js-cookie";
import cls from "./chatbot.module.css";
import { Params } from "decorator-shared/params";
import { loadExternalScript } from "../utils";
import { env, param } from "../params";

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
            loadExternalScript(
                env("ENV") === "production"
                    ? "https://nav.boost.ai/chatPanel/chatPanel.js"
                    : "https://navtest.boost.ai/chatPanel/chatPanel.js",
            ).then(() => {
                window.boostInit(
                    env("ENV") === "production" ? "nav" : "navtest",
                    {
                        chatPanel: {
                            settings: {
                                removeRememberedConversationOnChatPanelClose:
                                    true,
                                conversationId: Cookies.get(
                                    "nav-chatbot%3Aconversation",
                                ),
                                openTextLinksInNewTab: true,
                            },
                            styling: { buttons: { multiline: true } },
                            header: {
                                filters: {
                                    filterValues:
                                        param("context") === "arbeidsgiver"
                                            ? "arbeidsgiver"
                                            : param("language") === "nn"
                                              ? "nynorsk"
                                              : "bokmal",
                                },
                            },
                        },
                    },
                );
            });
        }
    }
}

customElements.define("d-chatbot", Chatbot);
