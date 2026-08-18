import { describe, expect, it } from "vitest";
import { clientEnv } from "../env/server";
import { getLogOutUrl } from "./auth-handler";
import { parseAndValidateParams } from "../validateParams";

describe("getLogOutUrl", () => {
    it("uses explicit logoutUrl when provided", () => {
        const params = parseAndValidateParams({
            logoutUrl: "https://www.nav.no/custom-logout",
            redirectToUrlLogout: "https://www.nav.no/ignored-redirect",
        });

        expect(getLogOutUrl(params)).toBe("https://www.nav.no/custom-logout");
    });

    it("uses redirectToUrlLogout when logoutUrl is missing", () => {
        const redirectToUrlLogout = "https://www.nav.no/after-logout";
        const params = parseAndValidateParams({
            redirectToUrlLogout,
        });

        expect(getLogOutUrl(params)).toBe(
            `${clientEnv.LOGOUT_URL}?redirect=${redirectToUrlLogout}`,
        );
    });

    it("uses default logout url when neither parameter is provided", () => {
        const params = parseAndValidateParams({});

        expect(getLogOutUrl(params)).toBe(clientEnv.LOGOUT_URL);
    });
});
