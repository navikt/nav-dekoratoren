import { fixture } from "@open-wc/testing";
import "./chatbot";
import Cookies from "js-cookie";
import cls from "./chatbot.module.css";
import { updateDecoratorParams } from "../params";

/**
 *
 */

describe("chatbot", () => {
    beforeEach(() => {
        window.__DECORATOR_DATA__ = { params: {} } as any;
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
});
