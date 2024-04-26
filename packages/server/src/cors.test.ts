import { describe, expect, it } from "bun:test";
import { isAllowedDomain } from "./cors";

describe("Matching domains", () => {
    it("should match intern.dev.nav.no", () => {
        expect(isAllowedDomain("https://www.intern.dev.nav.no")).toBe(true);
    });
});
