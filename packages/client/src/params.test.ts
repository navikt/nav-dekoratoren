import { texts } from "decorator-server/src/texts";
import { CustomEvents } from "./events";
import { updateDecoratorParams } from "./params";

describe("updateDecoratorParams", () => {
    beforeEach(() => {
        window.__DECORATOR_DATA__ = {
            params: {
                chatbot: true,
                chatbotVisible: false,
                language: "nb",
                context: "privatperson",
                simple: false,
                simpleHeader: false,
                simpleFooter: false,
                redirectToApp: false,
                level: "Level3",
                availableLanguages: [],
                breadcrumbs: [],
                utilsBackground: "transparent",
                feedback: false,
                shareScreen: true,
                logoutWarning: true,
                ssrMainMenu: false,
                redirectOnUserChange: false,
                analyticsQueryParams: [],
                analyticsRedactFilter: [],
            },
            features: {},
            env: {} as any,
            texts: texts.nb,
        } as any;
    });

    const captureEvent = (): Promise<CustomEvents["paramsupdated"]> =>
        new Promise((resolve) => {
            const handler = (e: Event) => {
                window.removeEventListener("paramsupdated", handler);
                resolve(
                    (e as CustomEvent<CustomEvents["paramsupdated"]>).detail,
                );
            };
            window.addEventListener("paramsupdated", handler);
        });

    it("dispatches full params in event detail", async () => {
        const eventPromise = captureEvent();
        updateDecoratorParams({ language: "en" });
        const { params } = await eventPromise;

        // All keys should be present (full ClientParams, not partial)
        expect(params.language).toBe("en");
        expect(params.chatbot).toBe(true);
        expect(params.chatbotVisible).toBe(false);
        expect(params.context).toBe("privatperson");
    });

    it("dispatches changedKeys containing only the updated keys", async () => {
        const eventPromise = captureEvent();
        updateDecoratorParams({ language: "en" });
        const { changedKeys } = await eventPromise;

        expect(changedKeys).toContain("language");
        expect(changedKeys).not.toContain("chatbot");
        expect(changedKeys).not.toContain("chatbotVisible");
        expect(changedKeys).not.toContain("context");
    });

    it("batches multiple param changes into one event with all changedKeys", async () => {
        const eventPromise = captureEvent();
        updateDecoratorParams({ language: "en", context: "arbeidsgiver" });
        const { changedKeys, params } = await eventPromise;

        expect(changedKeys).toContain("language");
        expect(changedKeys).toContain("context");
        expect(params.language).toBe("en");
        expect(params.context).toBe("arbeidsgiver");
    });

    it("does not dispatch event when value is unchanged", () => {
        const handler = vi.fn();
        window.addEventListener("paramsupdated", handler);
        updateDecoratorParams({ language: "nb" }); // "nb" is already the current value
        window.removeEventListener("paramsupdated", handler);

        expect(handler).not.toHaveBeenCalled();
    });

    it("only includes actually changed keys when some values are unchanged", async () => {
        const eventPromise = captureEvent();
        updateDecoratorParams({ language: "en", chatbot: true }); // chatbot is already true
        const { changedKeys } = await eventPromise;

        expect(changedKeys).toContain("language");
        expect(changedKeys).not.toContain("chatbot");
    });
});
