import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    expect,
    test,
} from "bun:test";
import { clearCache } from "decorator-shared/response-cache";
import { HttpResponse, http } from "msw";
import { SetupServerApi, setupServer } from "msw/node";
import { env } from "./env/server";
import testData from "./menu/main-menu-mock.json";
import renderIndex from "./render-index";
import { validParams } from "./validateParams";

let server: SetupServerApi;

beforeAll(() => {
    server = setupServer(
        http.get(`${env.ENONICXP_SERVICES}/no.nav.navno/menu`, () =>
            HttpResponse.json(testData),
        ),
    );
    server.listen();
});
beforeEach(() => clearCache());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("render-index", async () => {
    expect(
        await renderIndex({ data: validParams({}), url: "localhost:8089/" }),
    ).toContain("<!doctype html>");
});
