import { fixture } from "@open-wc/testing";
import { BoostConfig } from "decorator-shared/boost-config";
import Cookies from "js-cookie";
import { updateDecoratorParams } from "../params";
import { reset } from "../utils";
import "./chatbot";
import cls from "./chatbot.module.css";

/**
 * boost.chatPanel listeners
 * view
 */

describe("chatbot", () => {
    const old = document.body.appendChild;
    let loadedSrc = "";
    let calledWith: any[] = [];

    const wasCalled = async () =>
        await new Promise<void>((resolve) => {
            const interval = setInterval(() => {
                if (calledWith.length > 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1);
        });

    afterAll(() => {
        document.body.appendChild = old;
    });

    beforeEach(() => {
        document.body.appendChild = <T extends Node>(node: T): T => {
            if (node instanceof HTMLScriptElement) {
                setTimeout(() => node.onload?.(new Event("wat")), 0);
                loadedSrc = node.src;
            }
            return old.call<HTMLElement, T[], T>(document.body, node);
        };
        window.__DECORATOR_DATA__ = {
            params: { chatbot: true, chatbotVisible: true },
            features: { ["dekoratoren.chatbotscript"]: true },
            env: { ENV: "production" },
        } as any;
        window.boostInit = (urlBase: string, boostConfig: BoostConfig) => {
            calledWith = [urlBase, boostConfig];
        };
    });

    afterEach(() => {
        calledWith = [];
        loadedSrc = "";
        Cookies.remove("nav-chatbot%3Aconversation");
        reset();
    });

    it("reacts to paramsupdated", async () => {
        const el = await fixture("<d-chatbot></d-chatbot>");
        const child = el.childNodes[0] as HTMLElement;
        expect(child.classList).toContain(cls.visible);
        updateDecoratorParams({ chatbotVisible: false });
        expect(child.classList).not.toContain(cls.visible);
        updateDecoratorParams({ chatbot: false });
        expect(el.hasChildNodes()).toBe(false);
    });

    it("doesnt remove visible when cookie is set", async () => {
        Cookies.set("nav-chatbot%3Aconversation", "value");
        const el = await fixture("<d-chatbot></d-chatbot>");
        updateDecoratorParams({ chatbotVisible: false });
        const child = el.childNodes[0] as HTMLElement;
        expect(child.classList).toContain(cls.visible);
    });

    it("doesnt mount when feature is not toggled", async () => {
        window.__DECORATOR_DATA__.features["dekoratoren.chatbotscript"] = false;
        const el = await fixture("<d-chatbot></d-chatbot>");
        expect(el.hasChildNodes()).toBe(false);
    });

    describe("external script", async () => {
        it("loads script and inits boost", async () => {
            updateDecoratorParams({ chatbotVisible: false });
            await fixture("<d-chatbot></d-chatbot>");
            expect(loadedSrc).toBe("");
            expect(calledWith).toEqual([]);
            updateDecoratorParams({ chatbotVisible: true });
            Cookies.set("nav-chatbot%3Aconversation", "value");

            await wasCalled();
            expect(loadedSrc).toBe(
                "https://nav.boost.ai/chatPanel/chatPanel.js",
            );
            expect(calledWith[0]).toBe("nav");
            expect(calledWith[1]).toEqual({
                chatPanel: {
                    settings: {
                        removeRememberedConversationOnChatPanelClose: true,
                        conversationId: "value",
                        openTextLinksInNewTab: true,
                    },
                    styling: { buttons: { multiline: true } },
                    header: { filters: { filterValues: "bokmal" } },
                },
            });
        });

        it("inits boost with dev url base", async () => {
            window.__DECORATOR_DATA__.env.ENV = "development";
            await fixture("<d-chatbot></d-chatbot>");
            expect(loadedSrc).toBe(
                "https://navtest.boost.ai/chatPanel/chatPanel.js",
            );
            await wasCalled();
            expect(calledWith[0]).toBe("navtest");
        });

        it("sets preferred filter to arbeidsgiver", async () => {
            window.__DECORATOR_DATA__.params.context = "arbeidsgiver";
            await fixture("<d-chatbot></d-chatbot>");
            await wasCalled();
            expect(calledWith[1].chatPanel.header.filters.filterValues).toBe(
                "arbeidsgiver",
            );
        });

        it("sets preferred filter to nynorsk", async () => {
            window.__DECORATOR_DATA__.params.language = "nn";
            await fixture("<d-chatbot></d-chatbot>");
            await wasCalled();
            expect(calledWith[1].chatPanel.header.filters.filterValues).toBe(
                "nynorsk",
            );
        });
    });

    describe("onClick", () => {
        it("toggles chatbot if boost is initialized", async () => {
            let isShown = false;
            let wasCalled = false;

            const boostInitialized = async () =>
                await new Promise<void>((resolve) => {
                    const interval = setInterval(() => {
                        if (wasCalled) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 1);
                });
            window.boostInit = () => {
                wasCalled = true;
                return { chatPanel: { show: () => (isShown = true) } };
            };
            const el = await fixture("<d-chatbot></d-chatbot>");
            const button = el.childNodes[0] as HTMLButtonElement;
            expect(isShown).toBe(false);
            await boostInitialized();
            button.click();
            await Promise.resolve();
            expect(isShown).toBe(true);
        });

        it("toggles chatbot after boost init", async () => {
            let isShown = false;
            let wasCalled = false;

            const boostInitialized = async () =>
                await new Promise<void>((resolve) => {
                    const interval = setInterval(() => {
                        if (wasCalled) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 1);
                });
            window.boostInit = () => {
                wasCalled = true;
                return {
                    chatPanel: {
                        show: () => {
                            isShown = true;
                        },
                    },
                };
            };
            const el = await fixture("<d-chatbot></d-chatbot>");
            const button = el.childNodes[0] as HTMLButtonElement;
            expect(isShown).toBe(false);
            button.click();
            expect(isShown).toBe(false);
            await boostInitialized();
            expect(isShown).toBe(true);
        });
    });
}, 1000);
