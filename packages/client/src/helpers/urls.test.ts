import { endpointUrlWithParams } from "./urls";
import { describe, expect, it } from "vitest";

describe("Endpoint urls", () => {
    it("Includes params from the window object", () => {
        const decoratorData = {
            params: {
                simple: true,
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
            "http://localhost:3000/user-menu?simple=true&feedback=true&version-id=1234",
        );
    });
});
