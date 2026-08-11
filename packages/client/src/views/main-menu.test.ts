import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "../helpers/logger";
import {
    decoratorApiMock,
    decoratorParamsMock,
    resetDecoratorApiMock,
    setDecoratorData,
} from "../helpers/api.testUtils";
import "./main-menu";

vi.mock("../helpers/api", async () => {
    const mock = await import("../helpers/api.testUtils");
    return {
        decoratorApi: mock.decoratorApiMock,
        decoratorParams: mock.decoratorParamsMock,
    };
});

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
        resetDecoratorApiMock();
        setDecoratorData({
            params: { context: "privatperson", language: "nb" },
        } as never);
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("fetches and renders menu content on connect", async () => {
        decoratorApiMock.mockResolvedValue("<p>meny</p>");

        const el = await fixture("<main-menu></main-menu>");

        await vi.waitFor(() => expect(el.innerHTML).toBe("<p>meny</p>"));
        expect(decoratorApiMock).toHaveBeenCalledWith("/main-menu", {
            query: { mocked: true },
            responseType: "text",
        });
        expect(decoratorParamsMock).toHaveBeenCalledWith({
            context: "privatperson",
        });
    });

    it("refetches on a context change", async () => {
        decoratorApiMock.mockResolvedValue("<p>meny</p>");
        const el = await fixture("<main-menu></main-menu>");
        await vi.waitFor(() => expect(el.innerHTML).toBe("<p>meny</p>"));

        decoratorApiMock.mockResolvedValue("<p>arbeidsgiver-meny</p>");
        dispatchContextUpdated("arbeidsgiver");

        await vi.waitFor(() =>
            expect(el.innerHTML).toBe("<p>arbeidsgiver-meny</p>"),
        );
        expect(decoratorParamsMock).toHaveBeenLastCalledWith({
            context: "arbeidsgiver",
        });
    });

    it("shows an error message and logs when the fetch fails", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        decoratorApiMock.mockRejectedValue(new Error("boom"));

        const el = await fixture("<main-menu></main-menu>");

        await vi.waitFor(() =>
            expect(el.innerHTML).toBe("Kunne ikke laste meny-innhold"),
        );
        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to fetch content for main-menu",
        );
    });

    it("ignores unrelated paramsupdated keys", async () => {
        decoratorApiMock.mockResolvedValue("<p>meny</p>");
        const el = await fixture("<main-menu></main-menu>");
        await vi.waitFor(() => expect(el.innerHTML).toBe("<p>meny</p>"));
        decoratorApiMock.mockClear();

        window.dispatchEvent(
            new CustomEvent("paramsupdated", {
                detail: { changedKeys: ["language"], params: {} },
            }),
        );
        await Promise.resolve();
        await Promise.resolve();

        expect(decoratorApiMock).not.toHaveBeenCalled();
    });
});
