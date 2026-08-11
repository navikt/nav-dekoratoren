import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "../helpers/logger";
import cls from "../styles/search-form.module.css";
import {
    decoratorApiMock,
    decoratorParamsMock,
    resetDecoratorApiMock,
    setDecoratorData,
} from "../helpers/api.testUtils";
import "./search-menu";

vi.mock("../helpers/api", async () => {
    const mock = await import("../helpers/api.testUtils");
    return {
        decoratorApi: mock.decoratorApiMock,
        decoratorParams: mock.decoratorParamsMock,
    };
});

vi.mock("../analytics/analytics", () => ({
    analyticsEvent: vi.fn(),
}));

const markup = `
    <search-menu>
        <form class="${cls.searchForm}">
            <input class="${cls.searchInput}" />
        </form>
    </search-menu>
`;

const DEBOUNCE_MS = 500;

// Fake timers are enabled here rather than in `beforeEach` because open-wc's
// `fixture` waits on real timers/frames and would otherwise hang.
const typeSearch = async (el: Element, value: string) => {
    vi.useFakeTimers();
    const input = el.querySelector("input")!;
    input.value = value;
    input.dispatchEvent(new Event("input"));
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
};

describe("SearchMenu", () => {
    beforeEach(() => {
        resetDecoratorApiMock();
        setDecoratorData({
            params: { context: "privatperson", language: "nb" },
            texts: { loading_preview: "Laster" },
        } as never);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("fetches search results and renders them after the debounce", async () => {
        decoratorApiMock.mockResolvedValue("<p>treff</p>");
        const el = await fixture(markup);

        await typeSearch(el, "dagpenger");

        expect(decoratorApiMock).toHaveBeenCalledWith("/api/search", {
            query: { mocked: true },
            responseType: "text",
        });
        expect(decoratorParamsMock).toHaveBeenCalledWith({
            language: "nb",
            context: "privatperson",
            q: encodeURIComponent("dagpenger"),
        });
        expect(el.innerHTML).toContain("<p>treff</p>");
    });

    it("uses an abortPrevious-enabled client instance", async () => {
        decoratorApiMock.mockResolvedValue("");
        await fixture(markup);

        expect(decoratorApiMock.extend).toHaveBeenCalledWith({
            abortPrevious: true,
        });
    });

    it("does not search for queries of 2 characters or less", async () => {
        const el = await fixture(markup);

        await typeSearch(el, "da");

        expect(decoratorApiMock).not.toHaveBeenCalled();
    });

    it("ignores abort errors from superseded requests", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        decoratorApiMock.mockRejectedValue(
            Object.assign(new Error("superseded"), { name: "AbortError" }),
        );
        const el = await fixture(markup);

        await typeSearch(el, "dagpenger");

        expect(errorSpy).not.toHaveBeenCalled();
    });

    it("logs other fetch failures", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        decoratorApiMock.mockRejectedValue(new Error("boom"));
        const el = await fixture(markup);

        await typeSearch(el, "dagpenger");

        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to fetch search results",
            expect.objectContaining({ error: expect.any(Error) }),
        );
    });
});
