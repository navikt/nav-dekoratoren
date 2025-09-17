import loadExternalScript from "../../helpers/load-external-script";
import { env, param } from "../../params";

export const initBoost = (): Promise<{ show: () => void }> =>
    loadScript().then(() => {
        if (!window.boostInit) {
            console.error("Boost init function not found!");
            return { show: () => {} };
        }

        const boost = window.boostInit(env("BOOST_ENV"), {
            chatPanel: {
                settings: {
                    removeRememberedConversationOnChatPanelClose: true,
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
        });

        boost.chatPanel.addEventListener("setFilterValue", (event) => {
            boost.chatPanel.setFilterValues(event.detail.filterValue);
            if (event.detail.nextId) {
                boost.chatPanel.triggerAction(event.detail.nextId);
            }
        });

        return { show: boost.chatPanel.show };
    });

export const hasActiveConversation = (): boolean =>
    null !==
    (window.localStorage.getItem("boostai.conversation.id") ??
        window.sessionStorage.getItem("boostai.conversation.id"));

export const loadScript = () =>
    loadExternalScript(
        `https://${env("BOOST_ENV")}.boost.ai/chatPanel/chatPanel.js`,
    );
