import { describe, expect, it } from "vitest";
import {
    isoDateNow,
    oneHourFromNow,
    sixHoursFromNow,
    getSecondsToDate,
    fakeExpirationTime,
} from "./time";

describe("Mock helpers", () => {
    describe("getSecondsToExpiration", () => {
        it("correctly calculates seconds", () => {
            const mockCurrentISODate = "2021-10-10T10:00:00.000Z";
            const mockFutureISODate = "2021-10-10T11:04:00.000Z";

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            const seconds = getSecondsToDate(mockFutureISODate);

            expect(seconds).toBe(3840);
        });

        it("correctly calculates negative seconds", () => {
            const mockCurrentISODate = "2021-10-10T00:05:00.000Z";
            const mockPastISODate = "2021-10-09T23:05:00.000Z";

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            const seconds = getSecondsToDate(mockPastISODate);

            expect(seconds).toBe(-3600);
        });

        it("correctly calculates negative seconds", () => {
            const mockCurrentISODate = "2021-10-10T00:05:00.000Z";
            const mockPastISODate = "2021-10-09T23:05:00.000Z";

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            const seconds = getSecondsToDate(mockPastISODate);

            expect(seconds).toBe(-3600);
        });

        it("correctly handles lack of input date", () => {
            const mockCurrentISODate = "2021-10-10T00:05:00.000Z";
            const mockUndefinedDate = undefined;

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            // @ts-expect-error Testing undefined input
            const seconds = getSecondsToDate(mockUndefinedDate);

            expect(seconds).toBe(0);
        });
    });

    describe("isoDateNow", () => {
        it("isoDateNow() returns expected date", () => {
            const mockNow = new Date("2021-10-10T10:00:00.000Z");
            vi.useFakeTimers();
            vi.setSystemTime(mockNow);

            const result = isoDateNow();

            expect(result).toBe("2021-10-10T10:00:00.000Z");
        });
    });

    it("oneHourFromNow() returns expected date", () => {
        const mockNow = new Date("2021-10-10T10:00:00.000Z");
        vi.useFakeTimers();
        vi.setSystemTime(mockNow);

        const result = oneHourFromNow();

        expect(result).toBe("2021-10-10T11:00:00.000Z");
    });

    it("sixHoursFromNow() returns expected date", () => {
        const mockNow = new Date("2021-10-10T10:15:00.000Z");
        vi.useFakeTimers();
        vi.setSystemTime(mockNow);

        const result = sixHoursFromNow();

        expect(result).toBe("2021-10-10T16:15:00.000Z");
    });

    describe("fakeExpirationTime", () => {
        it("correctly calculates future date", () => {
            const mockCurrentISODate = "2021-10-10T15:05:00.000Z";
            const mockSeconds = 63;

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            const futureDate = fakeExpirationTime(mockSeconds);

            expect(futureDate).toBe("2021-10-10T15:06:03.000Z");
        });
    });
});
