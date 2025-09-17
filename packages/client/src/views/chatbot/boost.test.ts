import "./chatbot";
import { BoostClient } from "../../client";
import { initBoost } from "./boost";
import { texts } from "decorator-server/src/texts";

describe("init boost", () => {
    let wasCalled = false;
    let calledWith: any[] = [];
    let filterValues: string[] = [];
    let triggeredAction: number;
    const chatPanel = document.createElement(
        "div",
    ) as unknown as BoostClient["chatPanel"];
    chatPanel.setFilterValues = (f) => (filterValues = f);
    chatPanel.triggerAction = (a) => (triggeredAction = a);

    const old = document.body.appendChild;

    beforeEach(() => {
        document.body.appendChild = <T extends Node>(node: T): T => {
            if (node instanceof HTMLScriptElement) {
                setTimeout(() => node.onload?.(new Event("wat")), 10);
            }
            return old.call<HTMLElement, T[], T>(document.body, node);
        };
        wasCalled = false;
        window.boostInit = (a: any, b: any) => {
            wasCalled = true;
            calledWith = [a, b];
            return { chatPanel };
        };
        window.__DECORATOR_DATA__ = {
            params: { chatbot: true, chatbotVisible: true },
            features: { ["dekoratoren.chatbotscript"]: true },
            env: { BOOST_ENV: "nav" },
            texts: texts.nb,
        } as any;
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

    it("initializes boost with correct config", async () => {
        initBoost();
        await boostInitialized();
        expect(calledWith[0]).toBe("nav");
        expect(calledWith[1]).toEqual({
            chatPanel: {
                settings: {
                    removeRememberedConversationOnChatPanelClose: true,
                    openTextLinksInNewTab: true,
                },
                styling: { buttons: { multiline: true } },
                header: { filters: { filterValues: "bokmal" } },
            },
        });
    });

    it("inits boost with dev url base", async () => {
        window.__DECORATOR_DATA__.env.BOOST_ENV = "navtest";
        initBoost();
        await boostInitialized();
        expect(calledWith[0]).toBe("navtest");
    });

    it("sets preferred filter to arbeidsgiver", async () => {
        window.__DECORATOR_DATA__.params.context = "arbeidsgiver";
        initBoost();
        await boostInitialized();
        expect(calledWith[1].chatPanel.header.filters.filterValues).toBe(
            "arbeidsgiver",
        );
    });

    it("sets preferred filter to nynorsk", async () => {
        window.__DECORATOR_DATA__.params.language = "nn";
        initBoost();
        await boostInitialized();
        expect(calledWith[1].chatPanel.header.filters.filterValues).toBe(
            "nynorsk",
        );
    });

    it("sets filter value and triggers next actions", async () => {
        initBoost();
        chatPanel.dispatchEvent(
            new CustomEvent("setFilterValue", {
                detail: { filterValue: ["filter value"], nextId: 37 },
            }),
        );
        expect(filterValues).toEqual(["filter value"]);
        expect(triggeredAction).toBe(37);
    });
}, 1000);
