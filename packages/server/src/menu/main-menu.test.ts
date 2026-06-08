import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    test,
    vi,
} from "vitest";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import testData from "./main-menu-mock.json";
import { env } from "../env/server";
import { clearCache } from "decorator-shared/response-cache";
import { getComplexFooterLinks, getSimpleFooterLinks } from "./main-menu";

// Flush microtasks so stale-while-revalidate background fetches complete
const flushPromises = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
};

describe("getSimpleFooterLinks", () => {
    let server: ReturnType<typeof setupServer>;

    beforeAll(() => {
        server = setupServer(
            http.get(`${env.ENONICXP_SERVICES}/no.nav.navno/menu`, () =>
                HttpResponse.json(testData),
            ),
        );
        server.listen();
    });
    beforeEach(() => {
        vi.useFakeTimers();
        clearCache();
    });
    afterEach(() => {
        vi.useRealTimers();
        server.resetHandlers();
    });
    afterAll(() => server.close());

    test("urls start with XP_BASE_URL", async () => {
        expect(
            (await getSimpleFooterLinks({ language: "nb" })).at(0)?.url,
        ).toSatisfy((url: string) => url.startsWith(env.XP_BASE_URL));
    });

    test("only prepend XP_BASE_URL to paths", async () => {
        expect(
            (
                await getComplexFooterLinks({
                    language: "en",
                    context: "privatperson",
                })
            )
                .at(0)
                ?.children.at(-1)?.url,
        ).toBe("https://www.nav.no/person/kontakt-oss/en/tilbakemeldinger");
    });

    test("returns stale menu when Enonic is down", async () => {
        // Populate cache with valid data
        const links = await getSimpleFooterLinks({ language: "nb" });
        expect(links.length).toBeGreaterThan(0);

        // Expire the cache and make Enonic unavailable
        vi.advanceTimersByTime(61_000);
        server.use(
            http.get(
                `${env.ENONICXP_SERVICES}/no.nav.navno/menu`,
                () => new HttpResponse(null, { status: 503 }),
            ),
        );

        // Should still return stale data, not throw
        const staleLinks = await getSimpleFooterLinks({ language: "nb" });
        expect(staleLinks).toEqual(links);
    });

    test("does not retry during backoff window after Enonic failure", async () => {
        let fetchCount = 0;

        server.use(
            http.get(`${env.ENONICXP_SERVICES}/no.nav.navno/menu`, () => {
                fetchCount++;
                return fetchCount === 1
                    ? HttpResponse.json(testData)
                    : new HttpResponse(null, { status: 503 });
            }),
        );

        // Populate cache
        await getSimpleFooterLinks({ language: "nb" });
        expect(fetchCount).toBe(1);

        // Expire cache and trigger failure
        vi.advanceTimersByTime(61_000);
        await getSimpleFooterLinks({ language: "nb" });
        await flushPromises();
        expect(fetchCount).toBe(2);

        const countAfterFailure = fetchCount;

        // Multiple requests during backoff window should not trigger new fetches
        await getSimpleFooterLinks({ language: "nb" });
        await getSimpleFooterLinks({ language: "nb" });
        await getSimpleFooterLinks({ language: "nb" });

        expect(fetchCount).toBe(countAfterFailure);
    });
});
