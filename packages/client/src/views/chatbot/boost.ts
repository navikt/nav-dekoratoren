import loadExternalScript from "../../helpers/load-external-script";
import { env, param } from "../../params";
import { logger } from "decorator-shared/logger";

type BoostApi = { show: () => void };

let boostApi: BoostApi | undefined = undefined;

export const reset = () => (boostApi = undefined);

export const initBoost = (): Promise<BoostApi | undefined> =>
    boostApi
        ? Promise.resolve(boostApi)
        : loadScript().then(() => {
              if (!window.boostInit) {
                  logger.error("Boost init function not found!");
                  return undefined;
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

              boostApi = { show: boost.chatPanel.show };

              return boostApi;
          });

export const hasActiveConversation = (): boolean =>
    null !==
    (window.localStorage.getItem("boostai.conversation.id") ??
        window.sessionStorage.getItem("boostai.conversation.id"));

export const loadScript = () =>
    loadExternalScript(
        `https://${env("BOOST_ENV")}.boost.ai/chatPanel/chatPanel.js`,
    );
