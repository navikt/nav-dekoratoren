import { describe, expect, test } from "bun:test";
import { getTaConfig } from "./task-analytics";
import { expectOK } from "./test-expect";

describe("task analytics", () => {
    test("returns config", async () => {
        const result = await getTaConfig();
        expectOK(result);
        expect(result.data.length).toBe(3);
        expect(result.data[2]).toEqual({
            duration: {
                end: "2023-02-28",
                start: "2023-01-30T08:00",
            },
            id: "2357",
            urls: [
                {
                    match: "startsWith",
                    url: "https://www.dev.nav.no/soknader",
                },
            ],
        });
    });

    test("caches config", async () => {
        const res1 = await getTaConfig();
        const res3 = await getTaConfig();

        expectOK(res1);
        expectOK(res3);
        expect(res1.data).toBe(res3.data);
    });
});
