import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "../helpers/logger";
import "./footer";
import { decoratorApi, decoratorParams } from "../helpers/api";

vi.mock("../helpers/api", () => ({
    decoratorApi: { get: vi.fn() },
    decoratorParams: vi.fn(() => ({ mocked: true })),
}));

const dispatchParamsUpdated = (changedKeys: string[]) =>
    window.dispatchEvent(
        new CustomEvent("paramsupdated", {
            detail: { changedKeys, params: {} },
        }),
    );

describe("Footer", () => {
    beforeEach(() => {
        window.__DECORATOR_DATA__ = {
            params: {},
            env: {},
            texts: {},
        } as any;
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("refetches and swaps innerHTML on a relevant paramsupdated key", async () => {
        vi.mocked(decoratorApi.get).mockResolvedValue("<p>new footer</p>");
        const el = await fixture("<decorator-footer></decorator-footer>");

        dispatchParamsUpdated(["feedback"]);

        // refreshFooter is fire-and-forget
        // handleParamsUpdated is a sync function, awaiting doesn't match the webAPI
        // Waiting for its effect rather than awaiting arbitrary microtasks
        await vi.waitFor(() => expect(el.innerHTML).toBe("<p>new footer</p>"));

        expect(decoratorApi.get).toHaveBeenCalledWith("/footer", {
            query: { mocked: true },
            responseType: "text",
        });
        expect(decoratorParams).toHaveBeenCalled();
    });

    it("ignores unrelated paramsupdated keys", async () => {
        await fixture("<decorator-footer></decorator-footer>");

        dispatchParamsUpdated(["pageTitle"]);

        // here we have to await arbitrary microtasks because there's no effect to observe
        await Promise.resolve();
        await Promise.resolve();

        expect(decoratorApi.get).not.toHaveBeenCalled();
    });

    it("logs and keeps old content when the fetch fails", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        vi.mocked(decoratorApi.get).mockRejectedValue(new Error("boom"));
        const el = await fixture("<decorator-footer>old</decorator-footer>");

        dispatchParamsUpdated(["simpleFooter"]);
        await vi.waitFor(() => expect(errorSpy).toHaveBeenCalled());

        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to fetch footer",
            expect.objectContaining({ error: expect.any(Error) }),
        );
        expect(el.innerHTML).toBe("old");
    });
});
