import { Context, Language, Params } from "decorator-shared/params";
import Cookies from "js-cookie";
import { env, param } from "../params";
import { loadExternalScript } from "../utils";
import cls from "./chatbot.module.css";

interface CustomEventMap {
    conversationIdChanged: CustomEvent<{ conversationId?: string }>;
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

class Chatbot extends HTMLElement {
    button: HTMLButtonElement;
    boost?: Boost;

    constructor() {
        super();
        this.button = document.createElement("button");
        this.button.addEventListener("click", () =>
            this.getBoost().then((boost) => boost?.chatPanel.show()),
        );
    }

    paramsUpdatedListener = (event: CustomEvent) =>
        this.update(event.detail.params);

    connectedCallback() {
        window.addEventListener("paramsupdated", this.paramsUpdatedListener);
        this.update(window.__DECORATOR_DATA__.params);
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.paramsUpdatedListener);
    }

    update = ({ chatbot, chatbotVisible }: Partial<Params>) => {
        if (
            !window.__DECORATOR_DATA__.features["dekoratoren.chatbotscript"] ||
            chatbot === false
        ) {
            this.innerHTML = "";
        } else if (chatbot) {
            this.appendChild(this.button);
        }
        const isVisible = chatbotVisible || !!this.getCookie();
        this.button.classList.toggle(cls.visible, isVisible);
        if (isVisible) {
            loadScript();
        }
    };

    getBoost = async (): Promise<Boost | undefined> => {
        if (
            !this.boost &&
            typeof window !== "undefined" &&
            typeof window.boostInit !== "undefined"
        ) {
            await loadScript();
            this.boost = window.boostInit(
                env("ENV") === "production" ? "nav" : "navtest",
                boostConfig({
                    conversationId: this.getCookie(),
                    context: param("context"),
                    language: param("language"),
                }),
            ) as Boost;
            this.boost.chatPanel.addEventListener(
                "conversationIdChanged",
                (event) =>
                    event.detail.conversationId
                        ? this.setCookie(event.detail.conversationId)
                        : this.removeCookie(),
            );
            this.boost.chatPanel.addEventListener("setFilterValue", (event) => {
                this.boost?.chatPanel.setFilterValues(event.detail.filterValue);
                if (event.detail.nextId) {
                    this.boost?.chatPanel.triggerAction(event.detail.nextId);
                }
            });
            this.boost.chatPanel.addEventListener(
                "chatPanelClosed",
                this.removeCookie,
            );
        }
        return this.boost;
    };

    cookieName = "nav-chatbot%3Aconversation";
    getCookie = () => Cookies.get(this.cookieName);
    setCookie = (value: string) =>
        Cookies.set(this.cookieName, value, {
            expires: 1,
            domain: location.hostname.includes("nav.no")
                ? ".nav.no"
                : undefined,
        });
    removeCookie = () => Cookies.remove(this.cookieName);
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

const loadScript = () =>
    loadExternalScript(
        env("ENV") === "production"
            ? "https://nav.boost.ai/chatPanel/chatPanel.js"
            : "https://navtest.boost.ai/chatPanel/chatPanel.js",
    );

customElements.define("d-chatbot", Chatbot);
