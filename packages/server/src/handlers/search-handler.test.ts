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

const hits = new Array(6).fill(0).map((_, i) => ({
    displayName: `Hit ${i}`,
    highlight: `highlight ${i}`,
    href: "https://example.com",
}));

describe("Search handler", () => {
    let server: SetupServerApi;

    beforeAll(() => {
        server = setupServer(
            http.get(env.SEARCH_API, () =>
                HttpResponse.json({
                    hits,
                    total: hits.length,
                }),
            ),
        );
        server.listen();
    });
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test("Should return html containing first 5 hits only", async () => {
        const html = await searchHandler({
            context: "privatperson",
            language: "nb",
            query: "",
        });

        expect(html).toContain("highlight 4");
        expect(html).not.toContain("highlight 5");
    });
});
