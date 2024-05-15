import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    test,
} from "bun:test";
import { clearCache } from "decorator-shared/response-cache";
import { HttpResponse, http } from "msw";
import { SetupServerApi, setupServer } from "msw/node";
import testData from "./menu/main-menu-mock.json";
import { env } from "./env/server";
import requestHandler from "./request-handler";

const req = (url: string, rest?: any) =>
    new Request(url, {
        headers: { Host: "localhost:8089" },
        ...rest,
    });

const fetch = await requestHandler();

describe("request handler", () => {
    let server: SetupServerApi;

    beforeAll(() => {
        server = setupServer(
            http.get(`${env.ENONICXP_SERVICES}/no.nav.navno/menu`, () =>
                HttpResponse.json(testData),
            ),
            http.post(`${env.VARSEL_API_URL}/beskjed/inaktiver`, () =>
                HttpResponse.json({ success: true }),
            ),
        );
        server.listen();
    });
    beforeEach(() => clearCache());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test("is alive", async () => {
        const response = await fetch(req("http://localhost/api/isAlive"));
        expect(response.status).toBe(200);
        expect(await response.text()).toBe("OK");
    });

    test("index", async () => {
        const response = await fetch(req("http://localhost/"));
        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toBe(
            "text/html; charset=utf-8",
        );
        expect(await response.text()).toContain("<!doctype html>");
    });

    test("search", async () => {
        const response = await fetch(req("http://localhost/api/search?q=test"));
        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toBe(
            "text/html; charset=utf-8",
        );
    });

    test("archive notification on POST", async () => {
        const response = await fetch(
            req("http://localhost/api/notifications/archive?id=eventId", {
                method: "POST",
            }),
        );
        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toBe(
            "application/json; charset=utf-8",
        );
        expect(await response.json()).toEqual("eventId");
    });

    test("archive notification gives 404 on GET", async () => {
        const response = await fetch(
            req("http://localhost/api/notifications/message/archive"),
        );
        expect(response.status).toBe(404);
    });
});
