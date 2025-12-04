import { redactData } from "./redactData";
import { knownRedactPaths, RedactConfig } from "./knownRedactPaths";
import { describe, expect, it, beforeEach, afterEach } from "vitest";

describe("redactData", () => {
    const originalWindow = global.window;

    const setRedactPaths = (paths: Array<[string, RedactConfig]>) => {
        knownRedactPaths.clear();
        for (const [path, config] of paths) {
            knownRedactPaths.set(path, config);
        }
    };

    beforeEach(() => {
        global.window = {
            location: {
                origin: "https://www.nav.no",
            },
        } as unknown as Window & typeof globalThis;
        knownRedactPaths.clear();
    });

    afterEach(() => {
        global.window = originalWindow;
        knownRedactPaths.clear();
    });

    describe("null and undefined values", () => {
        it("should return null when value is null", () => {
            expect(redactData(null)).toBe(null);
        });

        it("should return undefined when value is undefined", () => {
            expect(redactData(undefined)).toBe(undefined);
        });
    });

    describe("string values", () => {
        it("should return string unchanged when not a URL key", () => {
            expect(redactData("hello world")).toBe("hello world");
        });

        it("should redact UUIDs in strings", () => {
            const uuid = "123e4567-e89b-12d3-a456-426614174000";
            expect(redactData(`some text ${uuid} more text`)).toBe(
                "some text [redacted: uuid] more text",
            );
        });

        it("should redact multiple UUIDs in a string", () => {
            const uuid1 = "123e4567-e89b-12d3-a456-426614174000";
            const uuid2 = "987fcdeb-51a2-3bc4-d567-890123456789";
            expect(redactData(`${uuid1} and ${uuid2}`)).toBe(
                "[redacted: uuid] and [redacted: uuid]",
            );
        });

        it("should apply URL redaction for url key", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: false },
                ],
            ]);

            expect(redactData("/person/12345/sak", "url")).toBe(
                "/person/[redacted]/sak",
            );
        });

        it("should apply URL redaction for referrer key", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: false },
                ],
            ]);

            expect(redactData("/person/12345/sak", "referrer")).toBe(
                "/person/[redacted]/sak",
            );
        });

        it("should apply URL redaction for destinasjon key", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: false },
                ],
            ]);

            expect(redactData("/person/12345/sak", "destinasjon")).toBe(
                "/person/[redacted]/sak",
            );
        });

        it("should not apply URL redaction for non-URL keys", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: false },
                ],
            ]);

            expect(redactData("/person/12345/sak", "someOtherKey")).toBe(
                "/person/12345/sak",
            );
        });

        it("should redact both URL path and UUIDs when applicable", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: false },
                ],
            ]);

            const uuid = "123e4567-e89b-12d3-a456-426614174000";
            expect(redactData(`/person/${uuid}/sak`, "url")).toBe(
                "/person/[redacted]/sak",
            );
        });
    });

    describe("array values", () => {
        it("should recursively redact array items", () => {
            const uuid = "123e4567-e89b-12d3-a456-426614174000";
            expect(redactData(["hello", uuid, "world"])).toEqual([
                "hello",
                "[redacted: uuid]",
                "world",
            ]);
        });

        it("should handle nested arrays", () => {
            const uuid = "123e4567-e89b-12d3-a456-426614174000";
            expect(redactData([["nested", uuid]])).toEqual([
                ["nested", "[redacted: uuid]"],
            ]);
        });

        it("should handle empty arrays", () => {
            expect(redactData([])).toEqual([]);
        });
    });

    describe("object values", () => {
        it("should recursively redact object values", () => {
            const uuid = "123e4567-e89b-12d3-a456-426614174000";
            expect(redactData({ name: "test", id: uuid })).toEqual({
                name: "test",
                id: "[redacted: uuid]",
            });
        });

        it("should apply URL redaction to url key in objects", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: false },
                ],
            ]);

            expect(
                redactData({ url: "/person/12345/sak", name: "test" }),
            ).toEqual({
                url: "/person/[redacted]/sak",
                name: "test",
            });
        });

        it("should not redact exempt keys", () => {
            const uuid = "123e4567-e89b-12d3-a456-426614174000";
            expect(redactData({ website: uuid, other: uuid })).toEqual({
                website: uuid,
                other: "[redacted: uuid]",
            });
        });

        it("should handle nested objects", () => {
            const uuid = "123e4567-e89b-12d3-a456-426614174000";
            expect(
                redactData({
                    outer: {
                        inner: uuid,
                    },
                }),
            ).toEqual({
                outer: {
                    inner: "[redacted: uuid]",
                },
            });
        });

        it("should handle empty objects", () => {
            expect(redactData({})).toEqual({});
        });
    });

    describe("title redaction based on URL", () => {
        it("should redact title when URL matches pattern with redactTitle: true", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: true },
                ],
            ]);

            expect(
                redactData({
                    url: "/person/12345/sak",
                    title: "Person Details - Sensitive Name",
                }),
            ).toEqual({
                url: "/person/[redacted]/sak",
                title: "[redacted]",
            });
        });

        it("should not redact title when URL matches pattern with redactTitle: false", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: false },
                ],
            ]);

            expect(
                redactData({
                    url: "/person/12345/sak",
                    title: "Person Details",
                }),
            ).toEqual({
                url: "/person/[redacted]/sak",
                title: "Person Details",
            });
        });

        it("should redact title even when redactPath is false", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: false, redactTitle: true },
                ],
            ]);

            expect(
                redactData({
                    url: "/person/12345/sak",
                    title: "Sensitive Title",
                }),
            ).toEqual({
                url: "/person/12345/sak",
                title: "[redacted]",
            });
        });

        it("should not redact title when URL does not match any pattern", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: true },
                ],
            ]);

            expect(
                redactData({
                    url: "/other/path",
                    title: "Some Title",
                }),
            ).toEqual({
                url: "/other/path",
                title: "Some Title",
            });
        });

        it("should not redact title when object has no url property", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: true },
                ],
            ]);

            expect(
                redactData({
                    title: "Some Title",
                    name: "test",
                }),
            ).toEqual({
                title: "Some Title",
                name: "test",
            });
        });

        it("should not redact title when object has no title property", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: true },
                ],
            ]);

            expect(
                redactData({
                    url: "/person/12345/sak",
                    name: "test",
                }),
            ).toEqual({
                url: "/person/[redacted]/sak",
                name: "test",
            });
        });

        it("should handle title redaction in nested objects", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: true },
                ],
            ]);

            expect(
                redactData({
                    outer: {
                        url: "/person/12345/sak",
                        title: "Nested Sensitive Title",
                    },
                }),
            ).toEqual({
                outer: {
                    url: "/person/[redacted]/sak",
                    title: "[redacted]",
                },
            });
        });
    });

    describe("sidetittel redaction", () => {
        it("should redact data.sidetittel when URL matches pattern with redactTitle: true", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: true },
                ],
            ]);

            expect(
                redactData({
                    url: "/person/12345/sak",
                    title: "Page Title",
                    data: {
                        sidetittel: "Sensitive Sidetittel",
                        other: "value",
                    },
                }),
            ).toEqual({
                url: "/person/[redacted]/sak",
                title: "[redacted]",
                data: {
                    sidetittel: "[redacted]",
                    other: "value",
                },
            });
        });

        it("should not redact data.sidetittel when redactTitle is false", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: false },
                ],
            ]);

            expect(
                redactData({
                    url: "/person/12345/sak",
                    title: "Page Title",
                    data: {
                        sidetittel: "Sidetittel",
                    },
                }),
            ).toEqual({
                url: "/person/[redacted]/sak",
                title: "Page Title",
                data: {
                    sidetittel: "Sidetittel",
                },
            });
        });

        it("should not redact data.sidetittel when URL does not match", () => {
            setRedactPaths([
                [
                    "/person/:redact:/sak",
                    { redactPath: true, redactTitle: true },
                ],
            ]);

            expect(
                redactData({
                    url: "/other/path",
                    data: {
                        sidetittel: "Sidetittel",
                    },
                }),
            ).toEqual({
                url: "/other/path",
                data: {
                    sidetittel: "Sidetittel",
                },
            });
        });
    });

    describe("other value types", () => {
        it("should return numbers unchanged", () => {
            expect(redactData(42)).toBe(42);
        });

        it("should return booleans unchanged", () => {
            expect(redactData(true)).toBe(true);
            expect(redactData(false)).toBe(false);
        });
    });
});
