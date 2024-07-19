import { describe, expect, test } from "bun:test";
import { getTaskAnalyticsSurveys } from "./task-analytics-config";

describe("task analytics", () => {
    test("returns config", async () => {
        const result = getTaskAnalyticsSurveys();

        expect(result.length).toBe(3);
        expect(result[2]).toEqual({
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
        const res1 = getTaskAnalyticsSurveys();
        const res2 = getTaskAnalyticsSurveys();

        expect(res1).toBe(res2);
    });
});
