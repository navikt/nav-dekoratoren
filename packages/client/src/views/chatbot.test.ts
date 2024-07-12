import { fixture } from "@open-wc/testing";
import Cookies from "js-cookie";
import { texts } from "decorator-server/src/texts";
import { updateDecoratorParams } from "../params";
import "./chatbot";
import { BoostClient } from "./chatbot";
import cls from "./chatbot.module.css";

const COOKIE_NAME = "nav-chatbot:conversation";

describe("chatbot", () => {
    const old = document.body.appendChild;
    let loadedSrc = "";

    afterAll(() => {
        document.body.appendChild = old;
    });

    beforeEach(() => {
        document.body.appendChild = <T extends Node>(node: T): T => {
            if (node instanceof HTMLScriptElement) {
                setTimeout(() => node.onload?.(new Event("wat")), 10);
                loadedSrc = node.src;
            }
            return old.call<HTMLElement, T[], T>(document.body, node);
        };
        window.__DECORATOR_DATA__ = {
            params: { chatbot: true, chatbotVisible: true },
            features: { ["dekoratoren.chatbotscript"]: true },
            env: { BOOST_ENV: "nav" },
            texts: texts.nb,
        } as any;
    });

    afterEach(() => {
        loadedSrc = "";
        Cookies.remove(COOKIE_NAME);
    });

    it("reacts to paramsupdated", async () => {
        updateDecoratorParams({ chatbot: false, chatbotVisible: false });
        const el = await fixture("<d-chatbot></d-chatbot>");
        expect(el.hasChildNodes()).toBe(false);

        updateDecoratorParams({ chatbot: true });
        expect(el.hasChildNodes()).toBe(true);
        const child = el.childNodes[0] as HTMLElement;
        expect(child.classList).not.toContain(cls.visible);
        expect(loadedSrc).toBe("");

        updateDecoratorParams({ chatbotVisible: true });
        expect(child.classList).toContain(cls.visible);
        expect(loadedSrc).toBe("https://nav.boost.ai/chatPanel/chatPanel.js");

        updateDecoratorParams({ chatbot: false });
        expect(el.hasChildNodes()).toBe(false);
    });

    it("uses test url in navtest environment", async () => {
        window.__DECORATOR_DATA__.env.BOOST_ENV = "navtest";
        await fixture("<d-chatbot></d-chatbot>");
        expect(loadedSrc).toBe(
            "https://navtest.boost.ai/chatPanel/chatPanel.js",
        );
    });

    it("doesnt remove visible when cookie is set", async () => {
        Cookies.set(COOKIE_NAME, "value");
        updateDecoratorParams({ chatbotVisible: false });
        const el = await fixture("<d-chatbot></d-chatbot>");
        const child = el.childNodes[0] as HTMLElement;
        expect(child.classList).toContain(cls.visible);
    });

    it("doesnt mount when feature is not toggled", async () => {
        window.__DECORATOR_DATA__.features["dekoratoren.chatbotscript"] = false;
        const el = await fixture("<d-chatbot></d-chatbot>");
        expect(el.hasChildNodes()).toBe(false);
    });

    describe("onClick", () => {
        let isShown = false;
        let wasCalled = false;
        let calledWith: any[] = [];
        let filterValues: string[] = [];
        let triggeredAction: number;
        const chatPanel = document.createElement(
            "div",
        ) as unknown as BoostClient["chatPanel"];
        chatPanel.show = () => (isShown = true);
        chatPanel.setFilterValues = (f) => (filterValues = f);
        chatPanel.triggerAction = (a) => (triggeredAction = a);
        beforeEach(() => {
            isShown = false;
            wasCalled = false;
            window.boostInit = (a: any, b: any) => {
                wasCalled = true;
                calledWith = [a, b];
                return { chatPanel };
            };
        });

        const boostInitialized = async () =>
            await new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    if (wasCalled) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 1);
            });

        it("initializes boost on click and shows panel after init", async () => {
            const el = await fixture("<d-chatbot></d-chatbot>");
            (el.childNodes[0] as HTMLButtonElement).click();
            expect(wasCalled).toBe(false);
            expect(isShown).toBe(false);
            await boostInitialized();
            expect(isShown).toBe(true);
        });

        it("initializes boost with correct config", async () => {
            Cookies.set(COOKIE_NAME, "value");
            const el = await fixture("<d-chatbot></d-chatbot>");
            (el.childNodes[0] as HTMLButtonElement).click();
            await boostInitialized();
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
            window.__DECORATOR_DATA__.env.BOOST_ENV = "navtest";
            const el = await fixture("<d-chatbot></d-chatbot>");
            (el.childNodes[0] as HTMLButtonElement).click();
            await boostInitialized();
            expect(calledWith[0]).toBe("navtest");
        });

        it("sets preferred filter to arbeidsgiver", async () => {
            window.__DECORATOR_DATA__.params.context = "arbeidsgiver";
            const el = await fixture("<d-chatbot></d-chatbot>");
            (el.childNodes[0] as HTMLButtonElement).click();
            await boostInitialized();
            expect(calledWith[1].chatPanel.header.filters.filterValues).toBe(
                "arbeidsgiver",
            );
        });

        it("sets preferred filter to nynorsk", async () => {
            window.__DECORATOR_DATA__.params.language = "nn";
            const el = await fixture("<d-chatbot></d-chatbot>");
            (el.childNodes[0] as HTMLButtonElement).click();
            await boostInitialized();
            expect(calledWith[1].chatPanel.header.filters.filterValues).toBe(
                "nynorsk",
            );
        });

        it("sets cookie on id changed if present", async () => {
            const el = await fixture("<d-chatbot></d-chatbot>");
            (el.childNodes[0] as HTMLButtonElement).click();
            chatPanel.dispatchEvent(
                new CustomEvent("conversationIdChanged", {
                    detail: { conversationId: "newId" },
                }),
            );
            expect(Cookies.get(COOKIE_NAME)).toBe("newId");
            chatPanel.dispatchEvent(
                new CustomEvent("conversationIdChanged", {
                    detail: { conversationId: "" },
                }),
            );
            expect(Cookies.get(COOKIE_NAME)).toBe(undefined);
        });

        it("removes cookie on close", async () => {
            Cookies.set(COOKIE_NAME, "value");
            const el = await fixture("<d-chatbot></d-chatbot>");
            (el.childNodes[0] as HTMLButtonElement).click();
            chatPanel.dispatchEvent(new CustomEvent("chatPanelClosed"));
            expect(Cookies.get(COOKIE_NAME)).toBe(undefined);
        });

        it("sets filter value and triggers next actions", async () => {
            const el = await fixture("<d-chatbot></d-chatbot>");
            (el.childNodes[0] as HTMLButtonElement).click();
            chatPanel.dispatchEvent(
                new CustomEvent("setFilterValue", {
                    detail: { filterValue: ["filter value"], nextId: 37 },
                }),
            );
            expect(filterValues).toEqual(["filter value"]);
            expect(triggeredAction).toBe(37);
        });
    });
}, 1000);
