import {
    describe,
    expect,
    test,
    beforeAll,
    afterEach,
    afterAll,
} from "bun:test";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { env } from "../env/server";
import { searchHandler } from "./search-handler";

const hits = new Array(6).fill(0).map((_, i) => ({
    displayName: `Hit ${i}`,
    highlight: `highlight ${i}`,
    href: "https://example.com",
}));

const server = setupServer(
    http.get(env.SEARCH_API, () =>
        HttpResponse.json({
            hits,
            total: hits.length,
        }),
    ),
);

describe("Search handler", () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test("Should return html containing first 5 hits only", async () => {
        const response = await searchHandler({
            query: { q: "asdf" },
            url: new URL("http://localhost:3000") as URL, // ?!
            request: new Request("http://localhost:3000"),
        });

        expect(response.ok).toBeTrue();

        const html = await response.text();

        expect(html).toContain("highlight 4");
        expect(html).not.toContain("highlight 5");
    });
});
