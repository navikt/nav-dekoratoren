import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "../helpers/logger";
import { http, setDecoratorData } from "../test-setup";
import "./main-menu";

const setContext = (context: string) => {
    window.__DECORATOR_DATA__.params.context = context as never;
};

const dispatchContextUpdated = (context: string) => {
    setContext(context);
    window.dispatchEvent(
        new CustomEvent("paramsupdated", {
            detail: { changedKeys: ["context"], params: { context } },
        }),
    );
};

describe("MainMenu", () => {
    beforeEach(() => {
        setDecoratorData({
            params: { context: "privatperson", language: "nb" },
        } as never);
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("fetches and renders menu content on connect", async () => {
        http.get("/main-menu", { text: "<p>meny</p>" });

        const el = await fixture("<main-menu></main-menu>");

        await vi.waitFor(() => expect(el.innerHTML).toBe("<p>meny</p>"));
        // decoratorParams really ran: current params merged with the override.
        expect(http.lastCall?.pathname).toBe("/main-menu");
        expect(http.lastCall?.query.get("context")).toBe("privatperson");
        expect(http.lastCall?.query.get("language")).toBe("nb");
    });

    it("refetches on a context change", async () => {
        http.get("/main-menu", { text: "<p>meny</p>" });
        const el = await fixture("<main-menu></main-menu>");
        await vi.waitFor(() => expect(el.innerHTML).toBe("<p>meny</p>"));

        http.get("/main-menu", { text: "<p>arbeidsgiver-meny</p>" });
        dispatchContextUpdated("arbeidsgiver");

        await vi.waitFor(() =>
            expect(el.innerHTML).toBe("<p>arbeidsgiver-meny</p>"),
        );
        expect(http.lastCall?.query.get("context")).toBe("arbeidsgiver");
    });

    it("shows an error message and logs when the fetch fails", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        // 400 is non-retryable, so the module-scope retry: 2 client fails fast.
        http.get("/main-menu", { status: 400 });

        const el = await fixture("<main-menu></main-menu>");

        await vi.waitFor(() =>
            expect(el.innerHTML).toBe("Kunne ikke laste meny-innhold"),
        );
        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to fetch content for main-menu",
        );
    });

    it("ignores unrelated paramsupdated keys", async () => {
        http.get("/main-menu", { text: "<p>meny</p>" });
        const el = await fixture("<main-menu></main-menu>");
        await vi.waitFor(() => expect(el.innerHTML).toBe("<p>meny</p>"));
        http.resetCalls();

        window.dispatchEvent(
            new CustomEvent("paramsupdated", {
                detail: { changedKeys: ["language"], params: {} },
            }),
        );
        await http.settled();

        expect(http.calls).toHaveLength(0);
    });
});
