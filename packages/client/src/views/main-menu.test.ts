import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "../helpers/logger";
import { http, setDecoratorData, waitFor } from "../test-setup";
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

const TEN_MIN_MS = 10 * 60 * 1000;

describe("MainMenu", () => {
    beforeEach(() => {
        setDecoratorData({
            params: { context: "privatperson", language: "nb" },
        } as never);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("fetches and renders menu content on connect", async () => {
        http.get("/main-menu", { text: "<p>meny</p>" });

        const el = await fixture("<main-menu></main-menu>");

        await waitFor(() => expect(el.innerHTML).toBe("<p>meny</p>"));
        // decoratorParams really ran: current params merged with the override.
        expect(http.lastCall?.pathname).toBe("/main-menu");
        expect(http.lastCall?.query.get("context")).toBe("privatperson");
        expect(http.lastCall?.query.get("language")).toBe("nb");
    });

    it("refetches on a context change", async () => {
        http.get("/main-menu", { text: "<p>meny</p>" });
        const el = await fixture("<main-menu></main-menu>");
        await waitFor(() => expect(el.innerHTML).toBe("<p>meny</p>"));

        http.get("/main-menu", { text: "<p>arbeidsgiver-meny</p>" });
        dispatchContextUpdated("arbeidsgiver");

        await waitFor(() =>
            expect(el.innerHTML).toBe("<p>arbeidsgiver-meny</p>"),
        );
        expect(http.lastCall?.query.get("context")).toBe("arbeidsgiver");
    });

    it("shows an error message and logs when the fetch fails", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        // 400 is non-retryable, so the retry: 2 client fails fast.
        http.get("/main-menu", { status: 400 });

        const el = await fixture("<main-menu></main-menu>");

        await waitFor(() =>
            expect(el.innerHTML).toBe("Kunne ikke laste meny-innhold"),
        );
        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to fetch content for main-menu",
            expect.objectContaining({ error: expect.any(Error) }),
        );
    });

    it("ignores unrelated paramsupdated keys", async () => {
        http.get("/main-menu", { text: "<p>meny</p>" });
        const el = await fixture("<main-menu></main-menu>");
        await waitFor(() => expect(el.innerHTML).toBe("<p>meny</p>"));
        http.resetCalls();

        window.dispatchEvent(
            new CustomEvent("paramsupdated", {
                detail: { changedKeys: ["language"], params: {} },
            }),
        );
        await http.settled();

        expect(http.calls).toHaveLength(0);
    });

    it("serves a cached menu when a context is revisited", async () => {
        http.get("/main-menu", (call) => ({
            text: `<p>${call.query.get("context")}-meny</p>`,
        }));

        const el = await fixture("<main-menu></main-menu>");
        await waitFor(() =>
            expect(el.innerHTML).toBe("<p>privatperson-meny</p>"),
        );

        dispatchContextUpdated("arbeidsgiver");
        await waitFor(() =>
            expect(el.innerHTML).toBe("<p>arbeidsgiver-meny</p>"),
        );

        dispatchContextUpdated("privatperson");
        await waitFor(() =>
            expect(el.innerHTML).toBe("<p>privatperson-meny</p>"),
        );

        // Third render came out of the swr store, so only two trips were made.
        expect(http.calls).toHaveLength(2);
    });

    it("keeps rendering a cached menu whose refresh fails", async () => {
        vi.useFakeTimers();
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        http.get("/main-menu", (call) => ({
            text: `<p>${call.query.get("context")}-meny</p>`,
        }));

        const el = await fixture("<main-menu></main-menu>");
        await waitFor(() =>
            expect(el.innerHTML).toBe("<p>privatperson-meny</p>"),
        );

        // Past the `fresh` window: privatperson is now stale, so a request for
        // it is answered from the store while a refresh runs behind it. 400 is
        // non-retryable, so that refresh fails fast; the route is scoped to
        // privatperson so the arbeidsgiver leg still hits the route above.
        vi.advanceTimersByTime(TEN_MIN_MS + 1);
        http.get((call) => call.query.get("context") === "privatperson", {
            status: 400,
        });

        dispatchContextUpdated("arbeidsgiver");
        await waitFor(() =>
            expect(el.innerHTML).toBe("<p>arbeidsgiver-meny</p>"),
        );

        dispatchContextUpdated("privatperson");

        await waitFor(() =>
            expect(errorSpy).toHaveBeenCalledWith(
                "Failed to refresh content for main-menu",
                // A refused status arrives as the response; a rejected request
                // (network, timeout) would arrive as an Error instead.
                expect.objectContaining({
                    error: expect.any(Response),
                    url: expect.stringContaining("context=privatperson"),
                }),
            ),
        );
        // The stale menu was served, not the error message.
        expect(el.innerHTML).toBe("<p>privatperson-meny</p>");
    });

    it("does not overwrite a newer context when an older fetch fails", async () => {
        vi.spyOn(logger, "error").mockImplementation(() => {});
        // privatperson is still in flight when the context moves on, and fails
        // once it lands - its error message must not replace what is rendered.
        http.get((call) => call.query.get("context") === "privatperson", {
            status: 400,
            delay: 50,
        });
        http.get((call) => call.query.get("context") === "arbeidsgiver", {
            text: "<p>arbeidsgiver-meny</p>",
        });

        const el = await fixture("<main-menu></main-menu>");
        dispatchContextUpdated("arbeidsgiver");
        await waitFor(() =>
            expect(el.innerHTML).toBe("<p>arbeidsgiver-meny</p>"),
        );

        await http.settled();
        expect(el.innerHTML).toBe("<p>arbeidsgiver-meny</p>");
    });
});
