import { redactFromUrl } from "./redactUrl";
import { knownRedactPaths, RedactConfig } from "./knownRedactPaths";
import { describe, expect, it, beforeEach, afterEach } from "vitest";

describe("redactFromUrl", () => {
    const originalWindow = globalThis.window;

    const setRedactPaths = (
        paths: Array<[string, RedactConfig]> | string[],
    ) => {
        knownRedactPaths.clear();
        for (const path of paths) {
            if (typeof path === "string") {
                // Legacy format - default to redactPath: true, redactTitle: false
                knownRedactPaths.set(path, {
                    redactPath: true,
                    redactTitle: false,
                });
            } else {
                knownRedactPaths.set(path[0], path[1]);
            }
        }
    };

    beforeEach(() => {
        // Setup a mock window with location
        globalThis.window = {
            location: {
                origin: "https://www.nav.no",
            },
        } as unknown as Window & typeof globalThis;
        knownRedactPaths.clear();
    });

    afterEach(() => {
        globalThis.window = originalWindow;
        knownRedactPaths.clear();
    });

    describe("when window is undefined (SSR)", () => {
        it("should return the original URL", () => {
            const url = "/person/12345678901/sak";
            globalThis.window = undefined as unknown as Window &
                typeof globalThis;

            const result = redactFromUrl(url);
            expect(result.redactedUrl).toBe(url);
            expect(result.originalUrl).toBe(url);
            expect(result.shouldRedactTitle).toBe(false);
        });
    });

    describe("when knownRedactPaths is empty", () => {
        it("should return the original URL when knownRedactPaths is empty", () => {
            const url = "/person/12345678901/sak";

            const result = redactFromUrl(url);
            expect(result.redactedUrl).toBe(url);
            expect(result.originalUrl).toBe(url);
            expect(result.shouldRedactTitle).toBe(false);
        });
    });

    describe("when redacting path segments", () => {
        it("should redact matching path segments", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            expect(redactFromUrl("/person/12345678901/sak").redactedUrl).toBe(
                "/person/[redacted]/sak",
            );
        });

        it("should handle multiple :redact: placeholders in a pattern", () => {
            setRedactPaths(["/person/:redact:/dokument/:redact:"]);

            expect(
                redactFromUrl("/person/12345678901/dokument/abc123")
                    .redactedUrl,
            ).toBe("/person/[redacted]/dokument/[redacted]");
        });

        it("should preserve trailing slashes", () => {
            setRedactPaths(["/person/:redact:/sak/"]);

            expect(redactFromUrl("/person/12345678901/sak/").redactedUrl).toBe(
                "/person/[redacted]/sak/",
            );
        });

        it("should preserve query strings and hash", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            expect(
                redactFromUrl("/person/12345678901/sak?foo=bar#section")
                    .redactedUrl,
            ).toBe("/person/[redacted]/sak?foo=bar#section");
        });

        it("should be case-insensitive for literal segments", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            expect(redactFromUrl("/Person/12345678901/Sak").redactedUrl).toBe(
                "/Person/[redacted]/Sak",
            );
        });
    });

    describe("when URL does not match any pattern", () => {
        it("should return the original URL unchanged", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            expect(redactFromUrl("/other/path/here").redactedUrl).toBe(
                "/other/path/here",
            );
        });

        it("should not match when path is shorter than pattern", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            expect(redactFromUrl("/person/12345678901").redactedUrl).toBe(
                "/person/12345678901",
            );
        });
    });

    describe("prefix matching", () => {
        it("should match and redact when URL has additional segments after pattern", () => {
            setRedactPaths(["/foobar/mypage/:redact:"]);

            expect(
                redactFromUrl("/foobar/mypage/382737/list").redactedUrl,
            ).toBe("/foobar/mypage/[redacted]/list");
            expect(
                redactFromUrl("/foobar/mypage/3827273/list/page2").redactedUrl,
            ).toBe("/foobar/mypage/[redacted]/list/page2");
        });

        it("should match exact length paths as well", () => {
            setRedactPaths(["/foobar/mypage/:redact:"]);

            expect(redactFromUrl("/foobar/mypage/382737").redactedUrl).toBe(
                "/foobar/mypage/[redacted]",
            );
        });

        it("should handle multiple :redact: with prefix matching", () => {
            setRedactPaths(["/person/:redact:/dokument/:redact:"]);

            expect(
                redactFromUrl("/person/123/dokument/abc/extra/segments")
                    .redactedUrl,
            ).toBe("/person/[redacted]/dokument/[redacted]/extra/segments");
        });

        it("should preserve query strings and hash with prefix matching", () => {
            setRedactPaths(["/foobar/mypage/:redact:"]);

            expect(
                redactFromUrl("/foobar/mypage/382737/list?foo=bar#section")
                    .redactedUrl,
            ).toBe("/foobar/mypage/[redacted]/list?foo=bar#section");
        });
    });

    describe("with absolute URLs", () => {
        it("should handle absolute URLs correctly", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            expect(
                redactFromUrl("https://www.nav.no/person/12345678901/sak")
                    .redactedUrl,
            ).toBe("https://www.nav.no/person/[redacted]/sak");
        });

        it("should handle absolute URLs with query and hash", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            expect(
                redactFromUrl(
                    "https://www.nav.no/person/12345678901/sak?a=b#hash",
                ).redactedUrl,
            ).toBe("https://www.nav.no/person/[redacted]/sak?a=b#hash");
        });
    });

    describe("edge cases", () => {
        it("should handle invalid URLs gracefully", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            // This malformed URL should just return as-is
            expect(redactFromUrl("://invalid").redactedUrl).toBe("://invalid");
        });

        it("should handle patterns without leading slash", () => {
            setRedactPaths(["person/:redact:/sak"]);

            expect(redactFromUrl("/person/12345678901/sak").redactedUrl).toBe(
                "/person/[redacted]/sak",
            );
        });

        it("should handle empty path patterns gracefully", () => {
            setRedactPaths([""]);

            expect(redactFromUrl("/person/12345678901/sak").redactedUrl).toBe(
                "/person/12345678901/sak",
            );
        });

        it("should handle multiple matching patterns", () => {
            setRedactPaths([
                "/person/:redact:/sak",
                "/bruker/:redact:/dokument",
                "/annen/:redact:/liste/:redact:",
            ]);

            expect(redactFromUrl("/person/12345678901/sak").redactedUrl).toBe(
                "/person/[redacted]/sak",
            );
            expect(redactFromUrl("/bruker/abc123/dokument").redactedUrl).toBe(
                "/bruker/[redacted]/dokument",
            );
            expect(
                redactFromUrl("/annen/abc123/liste/xyz789").redactedUrl,
            ).toBe("/annen/[redacted]/liste/[redacted]");
        });

        it("should handle root path", () => {
            setRedactPaths(["/"]);

            expect(redactFromUrl("/").redactedUrl).toBe("/");
        });
    });

    describe("return object structure", () => {
        it("should return originalUrl, redactedUrl, and shouldRedactTitle", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            const result = redactFromUrl("/person/12345678901/sak");

            expect(result.originalUrl).toBe("/person/12345678901/sak");
            expect(result.redactedUrl).toBe("/person/[redacted]/sak");
            expect(result.shouldRedactTitle).toBe(false);
        });

        it("should preserve originalUrl even when redacted", () => {
            setRedactPaths(["/person/:redact:/sak"]);

            const result = redactFromUrl("/person/sensitive-data/sak");

            expect(result.originalUrl).toBe("/person/sensitive-data/sak");
            expect(result.redactedUrl).toBe("/person/[redacted]/sak");
        });
    });

    describe("shouldRedactTitle behavior", () => {
        it("should set shouldRedactTitle to true when redactTitle config is true", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: true },
                ],
            ]);

            const result = redactFromUrl("/person/12345678901/sak");

            expect(result.shouldRedactTitle).toBe(true);
            expect(result.redactedUrl).toBe("/person/[redacted]/sak");
        });

        it("should set shouldRedactTitle to false when redactTitle config is false", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: false },
                ],
            ]);

            const result = redactFromUrl("/person/12345678901/sak");

            expect(result.shouldRedactTitle).toBe(false);
            expect(result.redactedUrl).toBe("/person/[redacted]/sak");
        });

        it("should set shouldRedactTitle to true even when redactPath is false", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: false, redactTitle: true },
                ],
            ]);

            const result = redactFromUrl("/person/12345678901/sak");

            expect(result.shouldRedactTitle).toBe(true);
            // Path should NOT be redacted since redactPath is false
            expect(result.redactedUrl).toBe("/person/12345678901/sak");
        });

        it("should not redact path or title when both are false", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: false, redactTitle: false },
                ],
            ]);

            const result = redactFromUrl("/person/12345678901/sak");

            expect(result.shouldRedactTitle).toBe(false);
            expect(result.redactedUrl).toBe("/person/12345678901/sak");
        });
    });

    describe("redactPath behavior", () => {
        it("should redact path segments when redactPath is true", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: false },
                ],
            ]);

            const result = redactFromUrl("/person/12345678901/sak");

            expect(result.redactedUrl).toBe("/person/[redacted]/sak");
        });

        it("should not redact path segments when redactPath is false", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: false, redactTitle: false },
                ],
            ]);

            const result = redactFromUrl("/person/12345678901/sak");

            expect(result.redactedUrl).toBe("/person/12345678901/sak");
        });

        it("should handle mixed redactPath configs across multiple patterns", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: false },
                ],
                [
                    "/bruker/:redact:/info",
                    { redactPath: false, redactTitle: true },
                ],
            ]);

            const personResult = redactFromUrl("/person/123/sak");
            expect(personResult.redactedUrl).toBe("/person/[redacted]/sak");
            expect(personResult.shouldRedactTitle).toBe(false);

            const brukerResult = redactFromUrl("/bruker/456/info");
            expect(brukerResult.redactedUrl).toBe("/bruker/456/info");
            expect(brukerResult.shouldRedactTitle).toBe(true);
        });
    });
});
