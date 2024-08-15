import { describe, expect, it } from "vitest";
import { addSecondsFromNow, getSecondsRemaining } from "./time";

describe("Mock helpers", () => {
    describe("getSecondsRemaining", () => {
        it("correctly calculates seconds", () => {
            const mockCurrentISODate = "2021-10-10T10:00:00.000Z";
            const mockFutureISODate = "2021-10-10T11:04:00.000Z";

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            const seconds = getSecondsRemaining(mockFutureISODate);

            expect(seconds).toBe(3840);
        });

        it("correctly calculates negative seconds", () => {
            const mockCurrentISODate = "2021-10-10T00:05:00.000Z";
            const mockPastISODate = "2021-10-09T23:05:00.000Z";

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            const seconds = getSecondsRemaining(mockPastISODate);

            expect(seconds).toBe(-3600);
        });

        it("correctly handles undefined input", () => {
            const mockCurrentISODate = "2021-10-10T00:05:00.000Z";
            const mockUndefinedDate = undefined;

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            // @ts-expect-error Testing undefined input
            const seconds = getSecondsRemaining(mockUndefinedDate);

            expect(seconds).toBe(0);
        });
    });

    describe("addSecondsFromNow", () => {
        it("correctly calculates future time", () => {
            const mockCurrentISODate = "2021-10-10T15:05:00.000Z";
            const mockSeconds = 63;

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            const futureDate = addSecondsFromNow(mockSeconds);

            expect(futureDate).toBe("2021-10-10T15:06:03.000Z");
        });

        it("correctly calculates past time", () => {
            const mockCurrentISODate = "2021-10-10T15:05:00.000Z";
            const mockSeconds = -63;

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            const futureDate = addSecondsFromNow(mockSeconds);

            expect(futureDate).toBe("2021-10-10T15:03:57.000Z");
        });
    });
});
