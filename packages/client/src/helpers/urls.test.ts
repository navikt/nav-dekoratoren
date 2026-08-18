import { endpointUrlWithParams } from "./urls";
import { describe, expect, it } from "vitest";
import { CONSUMER } from "decorator-shared/constants";

describe("Endpoint urls", () => {
    it("Includes params from the window object", () => {
        const decoratorData = {
            params: {
                simple: true,
                logoutUrl: "https://www.nav.no",
                redirectToUrlLogout: "https://www.nav.no/redirect",
            },
            env: {
                APP_URL: "http://localhost:3000",
                VERSION_ID: "1234",
            },
        } as typeof window.__DECORATOR_DATA__;

        window.__DECORATOR_DATA__ = decoratorData;

        const url = endpointUrlWithParams("/user-menu", {
            feedback: true,
        });

        expect(url).toBe(
            `http://localhost:3000/user-menu?simple=true&logoutUrl=https%3A%2F%2Fwww.nav.no&redirectToUrlLogout=https%3A%2F%2Fwww.nav.no%2Fredirect&feedback=true&version-id=1234&consumer=${CONSUMER}`,
        );
    });
});
