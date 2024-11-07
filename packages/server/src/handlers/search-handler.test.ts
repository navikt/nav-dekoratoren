import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    test,
    jest,
} from "bun:test";
import { HttpResponse, http } from "msw";
import { SetupServerApi, setupServer } from "msw/node";
import { env } from "../env/server";
import { searchHandler } from "./search-handler";

const validHits = new Array(5).fill(0).map((_, i) => ({
    displayName: `Hit ${i}`,
    highlight: `highlight ${i}`,
    href: "https://example.com",
}));

describe("Search handler", () => {
    let server: SetupServerApi;

    beforeAll(() => {
        server = setupServer();
        server.listen();
    });

    afterEach(() => server.resetHandlers());

    afterAll(() => server.close());

    test("Should show total hits", async () => {
        server.use(
            http.get(env.SEARCH_API_URL, () =>
                HttpResponse.json({
                    hits: validHits,
                    total: 10,
                }),
            ),
        );

        const html = await searchHandler({
            context: "privatperson",
            language: "nb",
            query: "",
        });

        expect(html).toContain("10 treff for");
        expect(html).toContain("highlight 4");
    });

    test("Should encode/decode the query as appropriate", async () => {
        const resolver = jest.fn(() => {
            return HttpResponse.json({
                hits: validHits,
                total: validHits.length,
            });
        });

        server.use(http.get(env.SEARCH_API_URL, resolver));

        const query = "Grunnbeløpet";

        const html = await searchHandler({
            context: "privatperson",
            language: "nb",
            query,
        });

        const encodedQuery = encodeURIComponent(query);

        expect(resolver).toHaveBeenCalledWith(
            expect.objectContaining({
                request: expect.objectContaining({
                    url: expect.stringMatching(encodedQuery),
                }),
            }),
        );

        expect(html).toContain(query);
        expect(html).not.toContain(encodedQuery);
    });
});
