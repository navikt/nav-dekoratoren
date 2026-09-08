import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSUMER, VERSION_ID_PARAM } from "decorator-shared/constants";
import { logger } from "../helpers/logger";
import { refreshAuthData } from "../helpers/auth";
import { http, setDecoratorData } from "../test-setup";
import "./header";

vi.mock("../helpers/auth", () => ({
    refreshAuthData: vi.fn(() => Promise.resolve()),
}));

const dispatchParamsUpdated = (changedKeys: string[]) =>
    window.dispatchEvent(
        new CustomEvent("paramsupdated", {
            detail: { changedKeys, params: {} },
        }),
    );

describe("Header", () => {
    beforeEach(() => {
        setDecoratorData();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("refetches and swaps innerHTML on a relevant paramsupdated key", async () => {
        http.get("/header", { text: "<p>new header</p>" });
        const el = await fixture("<decorator-header></decorator-header>");

        dispatchParamsUpdated(["language"]);

        await vi.waitFor(() => expect(el.innerHTML).toBe("<p>new header</p>"));

        // The real request pipeline ran: decoratorParams built the query and
        // the withDecoratorMeta plugin appended the version-id/consumer meta.
        expect(http.lastCall?.pathname).toBe("/header");
        expect(http.lastCall?.query.get(VERSION_ID_PARAM)).toBe(
            "test-version-id",
        );
        expect(http.lastCall?.query.get("consumer")).toBe(CONSUMER);
    });

    it("refreshes auth data and asks for a consent banner recheck after a refetch", async () => {
        http.get("/header", { text: "<p>new header</p>" });
        const el = await fixture("<decorator-header></decorator-header>");
        const recheckSpy = vi.fn();
        el.addEventListener("recheckConsentBanner", recheckSpy);

        dispatchParamsUpdated(["simpleHeader"]);

        await vi.waitFor(() => expect(recheckSpy).toHaveBeenCalled());
        expect(refreshAuthData).toHaveBeenCalled();
    });

    it("only refreshes auth data on a context change", async () => {
        await fixture("<decorator-header></decorator-header>");

        dispatchParamsUpdated(["context"]);

        await vi.waitFor(() => expect(refreshAuthData).toHaveBeenCalled());
        expect(http.calls).toHaveLength(0);
    });

    it("ignores unrelated paramsupdated keys", async () => {
        await fixture("<decorator-header></decorator-header>");

        dispatchParamsUpdated(["pageTitle"]);

        // no effect to observe — settled() waits out anything the mock started
        await http.settled();

        expect(http.calls).toHaveLength(0);
        expect(refreshAuthData).not.toHaveBeenCalled();
    });

    it("logs and keeps old content when the fetch fails", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        // 400 is non-retryable, so the module-scope retry: 2 client fails fast.
        http.get("/header", { status: 400 });
        const el = await fixture("<decorator-header>old</decorator-header>");

        dispatchParamsUpdated(["language"]);
        await vi.waitFor(() => expect(errorSpy).toHaveBeenCalled());

        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to fetch header",
            expect.objectContaining({ error: expect.any(Error) }),
        );
        expect(el.innerHTML).toBe("old");
    });
});
