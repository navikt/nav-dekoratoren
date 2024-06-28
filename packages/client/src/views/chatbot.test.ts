import { fixture } from "@open-wc/testing";
import "./chatbot";
import Cookies from "js-cookie";
import cls from "./chatbot.module.css";
import { updateDecoratorParams } from "../params";

/**
 * Reagere på paramsupdated
 * Hva er sannheten, params eller attributter?
 */

describe("chatbot", () => {
    it("data-chatbot changes mounted state", async () => {
        const el = await fixture("<d-chatbot data-chatbot></d-chatbot>");
        expect(el.childNodes.length).toBe(1);
        const child = el.childNodes[0];
        expect(child).toBeInstanceOf(HTMLButtonElement);
        el.removeAttribute("data-chatbot");
        expect(el.childNodes.length).toBe(0);
    });

    it("data-chatbot-visible changes visibility", async () => {
        const el = await fixture("<d-chatbot></d-chatbot>");
        el.setAttribute("data-chatbot-visible", "");
        el.setAttribute("data-chatbot", "");
        const child = el.childNodes[0] as HTMLElement;
        expect(child.classList).toContain(cls.visible);
        el.removeAttribute("data-chatbot-visible");
        expect(child.classList).not.toContain(cls.visible);
    });

    it("reacts to paramsupdated", async () => {
        window.__DECORATOR_DATA__ = { params: {} } as any;
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
            const el = await fixture("<d-chatbot data-chatbot></d-chatbot>");
            const child = el.childNodes[0] as HTMLElement;
            expect(child.classList).toContain(cls.visible);
        });

        it("doesnt remove visible when cookie is set", async () => {
            const el = await fixture(
                "<d-chatbot data-chatbot data-chatbot-visible></d-chatbot>",
            );
            el.removeAttribute("data-chatbot-visible");
            const child = el.childNodes[0] as HTMLElement;
            expect(child.classList).toContain(cls.visible);
        });
    });
});
