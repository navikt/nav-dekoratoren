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
import { env } from "./env/server";
import { search } from "./search";

const hits = new Array(6).fill(0).map((_, i) => ({
    displayName: `Hit ${i}`,
    audience: ["person"],
    createdTime: "2022-02-09T14:51:57.490Z",
    modifiedTime: "2022-02-09T14:51:57.490Z",
    highlight: `highlight ${i}`,
    href: "example.com",
    language: "nb",
    hideModifiedDate: true,
    hidePublishDate: false,
}));

const server = setupServer(
    http.get(env.SEARCH_API, () =>
        HttpResponse.json({
            hits,
            total: hits.length,
        }),
    ),
);

describe("search", () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test("returns first five results", async () => {
        const result = await search({
            query: "asdf",
            language: "no",
            context: "privatperson",
        });

        expect(result.hits.length).toBe(5);
        expect(result.total).toBe(6);
    });
});
