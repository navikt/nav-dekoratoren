import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    expect,
    test,
    describe,
} from "bun:test";
import { clearCache } from "./lib/response-cache";
import { HttpResponse, http } from "msw";
import { SetupServerApi, setupServer } from "msw/node";
import testData from "./menu/main-menu-mock.json";
import { env } from "./env/server";
import renderIndex from "./render-index";

describe("render-index", () => {
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

    test("It masks the document from hotjar", async () => {
        expect(
            await renderIndex({
                data: {
                    redirectToLogout: "https://www.nav.no",
                    context: "privatperson",
                    simple: false,
                    simpleHeader: false,
                    simpleFooter: false,
                    enforceLogin: false,
                    redirectToApp: false,
                    level: "Level3",
                    language: "en",
                    availableLanguages: [],
                    breadcrumbs: [],
                    utilsBackground: "transparent",
                    feedback: false,
                    chatbot: true,
                    chatbotVisible: false,
                    urlLookupTable: false,
                    shareScreen: false,
                    logoutUrl: "/logout",
                    maskHotjar: true,
                    logoutWarning: false,
                    redirectToUrl: "https://www.nav.no",
                    ssr: true,
                },
                url: "localhost:8089/",
            }),
        ).toContain("data-hj-supress");
    });
});
