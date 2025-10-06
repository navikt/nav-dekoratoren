import { fixture } from "@open-wc/testing";
import { texts } from "decorator-server/src/texts";
import { updateDecoratorParams } from "../../params";
import "./chatbot";
import cls from "./chatbot.module.css";
import { BoostClient } from "../../client";

const STORAGE_KEY = "boostai.conversation.id";

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
        window.localStorage.removeItem(STORAGE_KEY);
        loadedSrc = "";
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

    it("doesnt remove visible when conversationid is set", async () => {
        localStorage.setItem(STORAGE_KEY, "123");
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

        const chatPanel = document.createElement(
            "div",
        ) as unknown as BoostClient["chatPanel"];
        chatPanel.show = () => (isShown = true);
        beforeEach(() => {
            isShown = false;
            wasCalled = false;
            window.boostInit = () => {
                wasCalled = true;
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
    });
}, 1000);
