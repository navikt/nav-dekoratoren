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
import { getComplexFooterLinks, getSimpleFooterLinks } from "./main-menu";

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
            (await getSimpleFooterLinks({ language: "nb" })).at(0)?.content,
        ).toBe("Personvern og sikkerhet");
    });

    test("urls start with XP_BASE_URL", async () => {
        expect(
            (await getSimpleFooterLinks({ language: "nb" })).at(0)?.url,
        ).toStartWith(env.XP_BASE_URL);
    });

    test("returns english", async () => {
        expect(
            (await getSimpleFooterLinks({ language: "en" })).at(0)?.content,
        ).toBe("Privacy and cookies");
    });

    test("only prepend XP_BASE_URL to paths", async () => {
        expect(
            (
                await getComplexFooterLinks({
                    language: "en",
                    context: "privatperson",
                })
            )
                .at(0)
                ?.children.at(-1)?.url,
        ).toBe("https://www.nav.no/person/kontakt-oss/en/tilbakemeldinger");
    });
});
