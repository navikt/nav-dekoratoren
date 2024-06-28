import Cookies from "js-cookie";
import cls from "./chatbot.module.css";
import { Context, Language, Params } from "decorator-shared/params";
import { loadExternalScript } from "../utils";
import { env, param } from "../params";

type Boost = { chatPanel: { show: () => void } };

const loadScript = () =>
    loadExternalScript(
        env("ENV") === "production"
            ? "https://nav.boost.ai/chatPanel/chatPanel.js"
            : "https://navtest.boost.ai/chatPanel/chatPanel.js",
    );

class Chatbot extends HTMLElement {
    button: HTMLButtonElement;
    boost?: Boost;
    wasClicked = false;

    getBoost = async (): Promise<Boost> => {
        if (!this.boost) {
            await loadScript();
            this.boost = window.boostInit(
                env("ENV") === "production" ? "nav" : "navtest",
                boostConfig({
                    conversationId: Cookies.get("nav-chatbot%3Aconversation"),
                    context: param("context"),
                    language: param("language"),
                }),
            ) as Boost;
        }
        return this.boost;
    };

    constructor() {
        super();
        this.button = document.createElement("button");
        this.button.addEventListener("click", () =>
            this.getBoost().then((boost) => boost.chatPanel.show()),
        );
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
            this.getBoost();
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
