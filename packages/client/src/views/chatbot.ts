import { Context, Language, Params } from "decorator-shared/params";
import Cookies from "js-cookie";
import { env, param } from "../params";
import { loadExternalScript } from "../utils";
import cls from "./chatbot.module.css";

interface CustomEventMap {
    conversationIdChanged: CustomEvent<{ conversationId: string }>;
    chatPanelClosed: CustomEvent<undefined>;
    setFilterValue: CustomEvent<{ filterValue: string[]; nextId?: number }>;
}

export type Boost = {
    chatPanel: {
        show: () => void;
        addEventListener: <K extends keyof CustomEventMap>(
            type: K,
            listener: (this: Document, ev: CustomEventMap[K]) => void,
        ) => void;
        dispatchEvent: (event: CustomEventMap[keyof CustomEventMap]) => void;
        setFilterValues: (filterValues: string[]) => void;
        triggerAction: (actionId: number) => void;
    };
};

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
            this.boost.chatPanel.addEventListener(
                "conversationIdChanged",
                (event) => {
                    console.log("event", event.detail.conversationId);
                    if (event.detail.conversationId) {
                        Cookies.set(
                            "nav-chatbot%3Aconversation",
                            event.detail.conversationId,
                            {
                                expires: 1,
                                domain: location.hostname.includes("nav.no")
                                    ? ".nav.no"
                                    : undefined,
                            },
                        );
                    } else {
                        Cookies.remove("nav-chatbot%3Aconversation");
                    }
                },
            );
            this.boost.chatPanel.addEventListener("setFilterValue", (event) => {
                this.boost?.chatPanel.setFilterValues(event.detail.filterValue);
                if (event.detail.nextId) {
                    this.boost?.chatPanel.triggerAction(event.detail.nextId);
                }
            });
            this.boost.chatPanel.addEventListener("chatPanelClosed", () => {
                Cookies.remove("nav-chatbot%3Aconversation");
            });
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
            loadScript();
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
