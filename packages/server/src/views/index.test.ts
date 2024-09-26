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
import testData from "../menu/main-menu-mock.json";
import { IndexHtml } from "./index";
import { env } from "../env/server";

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

test("Index component should render", async () => {
    const indexContent = await IndexHtml({
        reqParams: {},
        url: "localhost:8089/",
    });

    expect(indexContent).toContain("<!doctype html>");
});
