import { describe, expect, it } from 'bun:test';
import { handleCors, isAllowedDomain } from './cors';

describe("Matching domains", () => {
    it("should match intern.dev.nav.no", () => {
        expect(isAllowedDomain("https://www.intern.dev.nav.no")).toBe(true)
    });
});

describe("Headers", () => {
    it("Should set headers", () => {
        const request = new Request("https://www.intern.dev.nav.no", {
            headers: {
                host: "https://www.intern.dev.nav.no"
            }
        });


        expect(handleCors(request).get("Access-Control-Allow-Origin")).toEqual("https://www.intern.dev.nav.no");
    });
});
