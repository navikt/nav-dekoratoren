import { fixture } from "@open-wc/testing";
import "./chatbot";
import cls from "./chatbot.module.css";

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
});
