import { fixture } from "@open-wc/testing";
import Cookies from "js-cookie";
import { updateDecoratorParams } from "../params";
import { reset } from "../utils";
import "./chatbot";
import cls from "./chatbot.module.css";

/**
 * load script
 * init boost
 * env
 * onClick
 *  buffer load
 * view
 */

describe("chatbot", () => {
    beforeEach(() => {
        window.__DECORATOR_DATA__ = {
            params: {},
            features: { ["dekoratoren.chatbotscript"]: true },
        } as any;
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
        let wasLoaded = false;
        const old = document.body.appendChild;

        beforeAll(() => {
            document.body.appendChild = <T extends Node>(node: T): T => {
                if (node instanceof HTMLScriptElement) {
                    node.onload?.(new Event("wat"));
                    wasLoaded = true;
                }
                return old.call<HTMLElement, T[], T>(document.body, node);
            };
        });
        afterAll(() => {
            document.body.appendChild = old;
        });

        it("loads script", async () => {
            updateDecoratorParams({ chatbot: true });
            await fixture("<d-chatbot></d-chatbot>");
            expect(wasLoaded).toBe(false);
            updateDecoratorParams({ chatbotVisible: true });
            expect(wasLoaded).toBe(true);
        });
    });
});
