import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    test,
} from "bun:test";
import { HttpResponse, http } from "msw";
import { SetupServerApi, setupServer } from "msw/node";
import testData from "./main-menu-mock.json";
import { env } from "../env/server";
import { clearCache } from "decorator-shared/response-cache";
import { getSimpleFooterLinks } from "./main-menu";

describe("getSimpleFooterLinks", () => {
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

    test("returns norwegian", async () => {
        expect(
            (await getSimpleFooterLinks({ language: "nb" }))?.at(0)?.content,
        ).toBe("Personvern og informasjonskapsler");
    });

    test("returns english", async () => {
        expect(
            (await getSimpleFooterLinks({ language: "en" }))?.at(0)?.content,
        ).toBe("Privacy and cookies");
    });
});
