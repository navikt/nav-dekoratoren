import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    expect,
    test,
} from "bun:test";
import renderIndex from "./render-index";
import UnleashService from "./unleash-service";
import { http, HttpResponse } from "msw";
import { env } from "./env/server";
import testData from "./content-test-data.json";
import { clearCache } from "decorator-shared/cache";
import { SetupServerApi, setupServer } from "msw/node";

const unleashService = new UnleashService({ mock: true });

test("It masks the document from hotjar", async () => {
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

    expect(
        await renderIndex({
            unleashService,
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
