import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    test,
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
        highlight: "Invaligh highlight",
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

    test("Should return html containing first 5 hits only", async () => {
        server.use(
            http.get(env.SEARCH_API, () =>
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

        expect(html).toContain("highlight 4");
        expect(html).not.toContain("highlight 5");
    });

    test("Should not validate invalid hits", async () => {
        server.use(
            http.get(env.SEARCH_API, () =>
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
});
