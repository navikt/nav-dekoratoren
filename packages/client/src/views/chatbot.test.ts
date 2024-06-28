import { fixture } from "@open-wc/testing";
import Cookies from "js-cookie";
import { env, updateDecoratorParams } from "../params";
import { reset } from "../utils";
import "./chatbot";
import cls from "./chatbot.module.css";
import { BoostConfig } from "decorator-shared/boost-config";

/**
 * init boost
 * env
 *  load prod/script
 * onClick
 *  buffer load
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

        it("loads script and inits boost", async () => {
            updateDecoratorParams({ chatbot: true });
            await fixture("<d-chatbot></d-chatbot>");
            expect(loadedSrc).toBe("");
            expect(calledWith).toEqual([]);
            updateDecoratorParams({ chatbotVisible: true });
            Cookies.set("nav-chatbot%3Aconversation", "value");
            expect(loadedSrc).toBe(
                "https://nav.boost.ai/chatPanel/chatPanel.js",
            );
            await new Promise((resolve) => setTimeout(resolve, 10));
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
            await new Promise((resolve) => setTimeout(resolve, 10));
            expect(calledWith[0]).toBe("navtest");
        });

        it("sets preferred filter to arbeidsgiver", async () => {
            window.__DECORATOR_DATA__.params.context = "arbeidsgiver";
            updateDecoratorParams({ chatbot: true, chatbotVisible: true });
            Cookies.set("nav-chatbot%3Aconversation", "value");

            await fixture("<d-chatbot></d-chatbot>");
            await new Promise((resolve) => setTimeout(resolve, 10));
            expect(calledWith[1].chatPanel.header.filters.filterValues).toBe(
                "arbeidsgiver",
            );
        });

        it("sets preferred filter to nynorsk", async () => {
            window.__DECORATOR_DATA__.params.language = "nn";
            updateDecoratorParams({ chatbot: true, chatbotVisible: true });
            Cookies.set("nav-chatbot%3Aconversation", "value");

            await fixture("<d-chatbot></d-chatbot>");
            await new Promise((resolve) => setTimeout(resolve, 10));
            expect(calledWith[1].chatPanel.header.filters.filterValues).toBe(
                "nynorsk",
            );
        });
    });
});
