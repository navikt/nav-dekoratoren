import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { abortError } from "@itsy/corgi/testing";
import { logger } from "../helpers/logger";
import cls from "../styles/search-form.module.css";
import { http, setDecoratorData } from "../test-setup";
import "./search-menu";

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
        http.get("/api/search", { text: "<p>treff</p>" });
        const el = await fixture(markup);

        await typeSearch(el, "dagpenger");

        // The real query builder ran: per-call overrides merged into params.
        expect(http.lastCall?.pathname).toBe("/api/search");
        expect(http.lastCall?.query.get("q")).toBe("dagpenger");
        expect(http.lastCall?.query.get("context")).toBe("privatperson");
        expect(http.lastCall?.query.get("language")).toBe("nb");
        expect(el.innerHTML).toContain("<p>treff</p>");
    });

    it("cancels the previous in-flight search when a new one starts", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        http.get("/api/search", { hang: true });
        const el = await fixture(markup);

        await typeSearch(el, "dagpenger");
        http.get("/api/search", { text: "<p>nye treff</p>" }); // override the hang
        await typeSearch(el, "dagpengesats");

        // The real abortPrevious plugin superseded the hung request: the second
        // one rendered, and the AbortError was swallowed rather than logged.
        expect(el.innerHTML).toContain("<p>nye treff</p>");
        expect(http.calls).toHaveLength(2);
        expect(errorSpy).not.toHaveBeenCalled();
    });

    it("does not search for queries of 2 characters or less", async () => {
        const el = await fixture(markup);

        await typeSearch(el, "da");

        expect(http.calls).toHaveLength(0);
    });

    it("ignores abort errors from superseded requests", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        http.get("/api/search", abortError("superseded"));
        const el = await fixture(markup);

        await typeSearch(el, "dagpenger");

        expect(errorSpy).not.toHaveBeenCalled();
    });

    it("logs other fetch failures", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        // 400 is non-retryable, so the retrying client fails fast.
        http.get("/api/search", { status: 400 });
        const el = await fixture(markup);

        await typeSearch(el, "dagpenger");

        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to fetch search results",
            expect.objectContaining({ error: expect.any(Error) }),
        );
    });
});
