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

const validHits = new Array(6).fill(0).map((_, i) => ({
    displayName: `Hit ${i}`,
    highlight: `highlight ${i}`,
    href: "https://example.com",
}));

const withInvalidHit = [
    {
        displayName: "Invalid hit",
        highlight: "Invalid highlight",
        href: "notaurl",
    },
    ...validHits,
];

describe("Search handler", () => {
    let server: SetupServerApi;

    beforeAll(() => {
        server = setupServer();
        server.listen();
    });

    afterEach(() => server.resetHandlers());

    afterAll(() => server.close());

    test("Should return html containing first 5 hits only, but show total hits", async () => {
        server.use(
            http.get(env.SEARCH_API_URL, () =>
                HttpResponse.json({
                    hits: validHits,
                    total: validHits.length,
                }),
            ),
        );

        const html = await searchHandler({
            context: "privatperson",
            language: "nb",
            query: "",
        });

        expect(html).toContain("6 treff for");
        expect(html).toContain("highlight 4");
        expect(html).not.toContain("highlight 5");
    });

    test("Should not include invalid hits", async () => {
        server.use(
            http.get(env.SEARCH_API_URL, () =>
                HttpResponse.json({
                    hits: withInvalidHit,
                    total: withInvalidHit.length,
                }),
            ),
        );

        const html = await searchHandler({
            context: "privatperson",
            language: "nb",
            query: "",
        });

        expect(html).toContain("Hit 4");
        expect(html).not.toContain("Invalid hit");
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
