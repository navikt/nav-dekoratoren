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
    beforeEach(() => {
        window.__DECORATOR_DATA__ = {
            params: {},
            features: { ["dekoratoren.chatbotscript"]: true },
            env: { ENV: "production" },
        } as any;
        window.boostInit = () => {};
    });
    afterEach(() => {
        reset();
    });

    it("chatbot param changes mounted state", async () => {
        updateDecoratorParams({ chatbot: true });
        const el = await fixture("<d-chatbot></d-chatbot>");
        expect(el.childNodes.length).toBe(1);
        const child = el.childNodes[0];
        expect(child).toBeInstanceOf(HTMLButtonElement);
        updateDecoratorParams({ chatbot: false });
        expect(el.childNodes.length).toBe(0);
    });

    it("reacts to paramsupdated", async () => {
        const el = await fixture("<d-chatbot></d-chatbot>");
        updateDecoratorParams({ chatbot: true, chatbotVisible: true });
        const child = el.childNodes[0] as HTMLElement;
        expect(child.classList).toContain(cls.visible);
        updateDecoratorParams({ chatbotVisible: false });
        expect(child.classList).not.toContain(cls.visible);
        updateDecoratorParams({ chatbot: false });
        expect(el.childNodes.length).toBe(0);
    });

    describe("cookies", () => {
        beforeAll(() => {
            Cookies.set("nav-chatbot%3Aconversation", "value");
        });

        afterAll(() => {
            Cookies.remove("nav-chatbot%3Aconversation");
        });

        it("is visible when cookie is set", async () => {
            updateDecoratorParams({ chatbot: true });
            const el = await fixture("<d-chatbot></d-chatbot>");
            const child = el.childNodes[0] as HTMLElement;
            expect(child.classList).toContain(cls.visible);
        });

        it("doesnt remove visible when cookie is set", async () => {
            updateDecoratorParams({ chatbot: true, chatbotVisible: true });
            const el = await fixture("<d-chatbot></d-chatbot>");
            updateDecoratorParams({ chatbotVisible: false });
            const child = el.childNodes[0] as HTMLElement;
            expect(child.classList).toContain(cls.visible);
        });
    });

    it("doesnt render when feature is not toggled", async () => {
        window.__DECORATOR_DATA__.features["dekoratoren.chatbotscript"] = false;
        updateDecoratorParams({ chatbot: true });
        const el = await fixture("<d-chatbot></d-chatbot>");
        expect(el.childNodes.length).toBe(0);
    });

    describe("external script", async () => {
        let loadedSrc = "";
        const old = document.body.appendChild;
        let calledWith: any[] = [];

        beforeAll(() => {
            document.body.appendChild = <T extends Node>(node: T): T => {
                if (node instanceof HTMLScriptElement) {
                    node.onload?.(new Event("wat"));
                    loadedSrc = node.src;
                }
                return old.call<HTMLElement, T[], T>(document.body, node);
            };
        });
        beforeEach(() => {
            window.boostInit = (urlBase: string, boostConfig: BoostConfig) => {
                calledWith = [urlBase, boostConfig];
            };
        });
        afterAll(() => {
            document.body.appendChild = old;
        });
        afterEach(() => {
            loadedSrc = "";
            calledWith = [];
            Cookies.remove("nav-chatbot%3Aconversation");
        });
        const wasCalled = async () =>
            await new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    if (calledWith.length > 0) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 1);
            });

        it("loads script and inits boost", async () => {
            updateDecoratorParams({ chatbot: true });
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
            updateDecoratorParams({ chatbot: true });
            await fixture("<d-chatbot></d-chatbot>");
            expect(loadedSrc).toBe("");
            expect(calledWith).toEqual([]);
            updateDecoratorParams({ chatbotVisible: true });
            expect(loadedSrc).toBe(
                "https://navtest.boost.ai/chatPanel/chatPanel.js",
            );
            await wasCalled();
            expect(calledWith[0]).toBe("navtest");
        });

        it("sets preferred filter to arbeidsgiver", async () => {
            window.__DECORATOR_DATA__.params.context = "arbeidsgiver";
            updateDecoratorParams({ chatbot: true, chatbotVisible: true });

            await fixture("<d-chatbot></d-chatbot>");
            await wasCalled();
            expect(calledWith[1].chatPanel.header.filters.filterValues).toBe(
                "arbeidsgiver",
            );
        });

        it("sets preferred filter to nynorsk", async () => {
            window.__DECORATOR_DATA__.params.language = "nn";
            updateDecoratorParams({ chatbot: true, chatbotVisible: true });

            await fixture("<d-chatbot></d-chatbot>");
            await wasCalled();
            expect(calledWith[1].chatPanel.header.filters.filterValues).toBe(
                "nynorsk",
            );
        });
    });

    describe("onClick", () => {
        const old = document.body.appendChild;

        beforeEach(() => {
            document.body.appendChild = <T extends Node>(node: T): T => {
                if (node instanceof HTMLScriptElement) {
                    setTimeout(() => node.onload?.(new Event("wat")), 100);
                }
                return old.call<HTMLElement, T[], T>(document.body, node);
            };
        });
        afterAll(() => {
            document.body.appendChild = old;
        });

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
                return {
                    chatPanel: {
                        show: () => {
                            isShown = true;
                        },
                    },
                };
            };
            updateDecoratorParams({ chatbot: true, chatbotVisible: true });
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
            updateDecoratorParams({ chatbot: true, chatbotVisible: true });
            const el = await fixture("<d-chatbot></d-chatbot>");
            const button = el.childNodes[0] as HTMLButtonElement;
            expect(isShown).toBe(false);
            button.click();
            expect(isShown).toBe(false);
            await boostInitialized();
            expect(isShown).toBe(true);
        });
    });
});
