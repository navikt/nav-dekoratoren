import { redactFromUrl } from "./redactUrl";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

describe("redactFromUrl", () => {
    const originalWindow = global.window;

    const setRedactPaths = (paths: string[]) => {
        (global.window as any).DECORATOR_DATA.params.redactPaths = paths;
    };

    beforeEach(() => {
        // Setup a mock window with location
        global.window = {
            location: {
                origin: "https://www.nav.no",
            },
            DECORATOR_DATA: {
                params: {
                    redactPaths: [],
                },
            },
        } as unknown as Window & typeof globalThis;
    });

    afterEach(() => {
        global.window = originalWindow;
    });

    describe("when window is undefined (SSR)", () => {
        it("should return the original URL", () => {
            const url = "/person/12345678901/sak";
            global.window = undefined as unknown as Window & typeof globalThis;

            expect(redactFromUrl(url)).toBe(url);
        });
    });

    describe("when redactPaths is empty or not defined", () => {
        it("should return the original URL when redactPaths is empty", () => {
            const url = "/person/12345678901/sak";
            setRedactPaths([]);

            expect(redactFromUrl(url)).toBe(url);
        });

        it("should return the original URL when redactPaths is not an array", () => {
            const url = "/person/12345678901/sak";
            (window as any).DECORATOR_DATA.params.redactPaths = "not-an-array";

            expect(redactFromUrl(url)).toBe(url);
        });
    });

    describe("when redacting path segments", () => {
        it("should redact matching path segments", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            expect(redactFromUrl("/person/12345678901/sak")).toBe(
                "/person/[redacted]/sak",
            );
        });

        it("should handle multiple :redact: placeholders in a pattern", () => {
            setRedactPaths(["/person/:redact:/dokument/:redact:"]);

            expect(redactFromUrl("/person/12345678901/dokument/abc123")).toBe(
                "/person/[redacted]/dokument/[redacted]",
            );
        });

        it("should preserve trailing slashes", () => {
            setRedactPaths(["/person/:redact:/sak/"]);

            expect(redactFromUrl("/person/12345678901/sak/")).toBe(
                "/person/[redacted]/sak/",
            );
        });

        it("should preserve query strings and hash", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            expect(
                redactFromUrl("/person/12345678901/sak?foo=bar#section"),
            ).toBe("/person/[redacted]/sak?foo=bar#section");
        });

        it("should be case-insensitive for literal segments", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            expect(redactFromUrl("/Person/12345678901/Sak")).toBe(
                "/Person/[redacted]/Sak",
            );
        });
    });

    describe("when URL does not match any pattern", () => {
        it("should return the original URL unchanged", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            expect(redactFromUrl("/other/path/here")).toBe("/other/path/here");
        });

        it("should not match when segment count differs", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            expect(redactFromUrl("/person/12345678901")).toBe(
                "/person/12345678901",
            );
            expect(redactFromUrl("/person/12345678901/sak/extra")).toBe(
                "/person/12345678901/sak/extra",
            );
        });
    });

    describe("with absolute URLs", () => {
        it("should handle absolute URLs correctly", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            expect(
                redactFromUrl("https://www.nav.no/person/12345678901/sak"),
            ).toBe("https://www.nav.no/person/[redacted]/sak");
        });

        it("should handle absolute URLs with query and hash", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            expect(
                redactFromUrl(
                    "https://www.nav.no/person/12345678901/sak?a=b#hash",
                ),
            ).toBe("https://www.nav.no/person/[redacted]/sak?a=b#hash");
        });
    });

    describe("edge cases", () => {
        it("should handle invalid URLs gracefully", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            // This malformed URL should just return as-is
            expect(redactFromUrl("://invalid")).toBe("://invalid");
        });

        it("should handle patterns without leading slash", () => {
            setRedactPaths(["person/:redact:/sak"]);

            expect(redactFromUrl("/person/12345678901/sak")).toBe(
                "/person/[redacted]/sak",
            );
        });

        it("should handle empty path patterns gracefully", () => {
            setRedactPaths([""]);

            expect(redactFromUrl("/person/12345678901/sak")).toBe(
                "/person/12345678901/sak",
            );
        });

        it("should handle multiple matching patterns", () => {
            setRedactPaths([
                "/person/:redact:/sak",
                "/bruker/:redact:/dokument",
                "/annen/:redact:/liste/:redact:",
            ]);

            expect(redactFromUrl("/person/12345678901/sak")).toBe(
                "/person/[redacted]/sak",
            );
            expect(redactFromUrl("/bruker/abc123/dokument")).toBe(
                "/bruker/[redacted]/dokument",
            );
            expect(redactFromUrl("/annen/abc123/liste/xyz789")).toBe(
                "/annen/[redacted]/liste/[redacted]",
            );
        });

        it("should handle root path", () => {
            setRedactPaths(["/"]);

            expect(redactFromUrl("/")).toBe("/");
        });
    });
});
