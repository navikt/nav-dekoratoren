import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "../helpers/logger";
import { refreshAuthData } from "../helpers/auth";
import {
    decoratorApiMock,
    decoratorParamsMock,
    resetDecoratorApiMock,
    setDecoratorData,
} from "../helpers/api.testUtils";
import "./header";

vi.mock("../helpers/api", async () => {
    const mock = await import("../helpers/api.testUtils");
    return {
        decoratorApi: mock.decoratorApiMock,
        decoratorParams: mock.decoratorParamsMock,
    };
});
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
        resetDecoratorApiMock();
        setDecoratorData();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("refetches and swaps innerHTML on a relevant paramsupdated key", async () => {
        decoratorApiMock.get.mockResolvedValue("<p>new header</p>");
        const el = await fixture("<decorator-header></decorator-header>");

        dispatchParamsUpdated(["language"]);

        await vi.waitFor(() => expect(el.innerHTML).toBe("<p>new header</p>"));

        expect(decoratorApiMock.get).toHaveBeenCalledWith("/header", {
            query: { mocked: true },
            responseType: "text",
        });
        expect(decoratorParamsMock).toHaveBeenCalled();
    });

    it("refreshes auth data and asks for a consent banner recheck after a refetch", async () => {
        decoratorApiMock.get.mockResolvedValue("<p>new header</p>");
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
        expect(decoratorApiMock.get).not.toHaveBeenCalled();
    });

    it("ignores unrelated paramsupdated keys", async () => {
        await fixture("<decorator-header></decorator-header>");

        dispatchParamsUpdated(["pageTitle"]);

        // no effect to observe, so we flush arbitrary microtasks
        await Promise.resolve();
        await Promise.resolve();

        expect(decoratorApiMock.get).not.toHaveBeenCalled();
        expect(refreshAuthData).not.toHaveBeenCalled();
    });

    it("logs and keeps old content when the fetch fails", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        decoratorApiMock.get.mockRejectedValue(new Error("boom"));
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
