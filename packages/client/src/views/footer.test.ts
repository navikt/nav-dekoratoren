import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "../helpers/logger";
import { http, setDecoratorData, waitFor } from "../test-setup";
import "./footer";

const dispatchParamsUpdated = (changedKeys: string[]) =>
    window.dispatchEvent(
        new CustomEvent("paramsupdated", {
            detail: { changedKeys, params: {} },
        }),
    );

describe("Footer", () => {
    beforeEach(() => {
        setDecoratorData();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("refetches and swaps innerHTML on a relevant paramsupdated key", async () => {
        http.get("/footer", { text: "<p>new footer</p>" });
        const el = await fixture("<decorator-footer></decorator-footer>");

        dispatchParamsUpdated(["feedback"]);

        // refreshFooter is fire-and-forget
        // handleParamsUpdated is a sync function, awaiting doesn't match the webAPI
        // Waiting for its effect rather than awaiting arbitrary microtasks
        await waitFor(() => expect(el.innerHTML).toBe("<p>new footer</p>"));

        expect(http.lastCall?.pathname).toBe("/footer");
        expect(http.lastCall?.method).toBe("GET");
    });

    it("ignores unrelated paramsupdated keys", async () => {
        await fixture("<decorator-footer></decorator-footer>");

        dispatchParamsUpdated(["pageTitle"]);

        // no effect to observe — settled() waits out anything the mock started
        await http.settled();

        expect(http.calls).toHaveLength(0);
    });

    it("logs and keeps old content when the fetch fails", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        // 400 is non-retryable, so the module-scope retry: 2 client fails fast.
        http.get("/footer", { status: 400 });
        const el = await fixture("<decorator-footer>old</decorator-footer>");

        dispatchParamsUpdated(["simpleFooter"]);
        await waitFor(() => expect(errorSpy).toHaveBeenCalled());

        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to fetch footer",
            expect.objectContaining({ error: expect.any(Error) }),
        );
        expect(el.innerHTML).toBe("old");
    });
});
