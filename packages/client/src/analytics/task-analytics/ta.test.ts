import { describe, expect, it } from "vitest";
import { isMatchingDuration } from "./ta-matching";

describe("Task Analytics", () => {
    it("isMatchingDuration outside duration", () => {
        const duration = {
            start: "2023-01-30T08:00",
            end: "2023-04-05T14:56",
        };

        const mockNow = new Date("2021-10-10T10:00:00.000Z");

        vi.useFakeTimers();
        vi.setSystemTime(mockNow);

        expect(isMatchingDuration(duration)).toBe(false);
    });

    it("isMatchingDuration inside duration", () => {
        const duration = {
            start: "2023-01-30T08:00",
            end: "2023-04-05T14:56",
        };

        const mockNow = new Date("2023-02-10T10:00:00.000Z");

        vi.useFakeTimers();
        vi.setSystemTime(mockNow);

        expect(isMatchingDuration(duration)).toBe(true);
    });
});
