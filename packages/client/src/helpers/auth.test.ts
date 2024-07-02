import { describe, expect, it } from "vitest";
import {
    SessionData,
    fakeExpirationTime,
    getSecondsToExpiration,
    transformSessionToAuth,
} from "./auth";

describe("Auth helpers", () => {
    describe("getSecondsToExpiration", () => {
        it("correctly calculates seconds", () => {
            const mockCurrentISODate = "2021-10-10T10:00:00.000Z";
            const mockFutureISODate = "2021-10-10T11:04:00.000Z";

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            const seconds = getSecondsToExpiration(mockFutureISODate);

            expect(seconds).toBe(3840);
        });

        it("correctly calculates negative seconds", () => {
            const mockCurrentISODate = "2021-10-10T00:05:00.000Z";
            const mockPastISODate = "2021-10-09T23:05:00.000Z";

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            const seconds = getSecondsToExpiration(mockPastISODate);

            expect(seconds).toBe(-3600);
        });

        it("correctly calculates negative seconds", () => {
            const mockCurrentISODate = "2021-10-10T00:05:00.000Z";
            const mockPastISODate = "2021-10-09T23:05:00.000Z";

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            const seconds = getSecondsToExpiration(mockPastISODate);

            expect(seconds).toBe(-3600);
        });

        it("correctly handles lack of input date", () => {
            const mockCurrentISODate = "2021-10-10T00:05:00.000Z";
            const mockUndefinedDate = undefined;

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            // @ts-expect-error Testing undefined input
            const seconds = getSecondsToExpiration(mockUndefinedDate);

            expect(seconds).toBe(0);
        });
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

    describe("transformSessionToAuth", () => {
        it("correctly uses expire_in_seconds when transforming to local time", () => {
            const mockCurrentISODate = "2021-10-10T10:10:00.000Z";

            // Note: Discrepancy between ISO dates and ends_in_seconds and expire_in_seconds
            // This is intentional to test that the function does infact use the seconds and not the time stamps.
            const mockSessionData: SessionData = {
                session: {
                    created_at: "2021-10-10T10:00:00.000Z",
                    ends_at: "2021-10-10T16:00:00.000Z",
                    timeout_at: "2021-10-10T16:00:00.000Z",
                    ends_in_seconds: 3600,
                    active: true,
                    timeout_in_seconds: 3600,
                },
                tokens: {
                    expire_at: "2021-10-10T11:05:00.000Z",
                    refreshed_at: "2021-10-10T12:05:00.000Z",
                    expire_in_seconds: 1800,
                    next_auto_refresh_in_seconds: 1800,
                    refresh_cooldown: false,
                    refresh_cooldown_seconds: 0,
                },
            };

            vi.useFakeTimers();
            vi.setSystemTime(mockCurrentISODate);

            const authData = transformSessionToAuth(mockSessionData);

            expect(authData.sessionExpireAtLocal).toBe(
                "2021-10-10T11:10:00.000Z",
            );
            expect(authData.tokenExpireAtLocal).toBe(
                "2021-10-10T10:40:00.000Z",
            );
        });
    });
});
