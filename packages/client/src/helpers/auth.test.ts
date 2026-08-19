import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { networkError } from "@itsy/corgi/testing";
import {
    SessionData,
    fetchOrRenewSession,
    refreshAuthData,
    transformSessionToAuth,
} from "./auth";
import { logger } from "./logger";
import { http, setDecoratorData } from "../test-setup";

describe("Auth helpers", () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
        vi.restoreAllMocks();
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

    describe("refreshAuthData", () => {
        beforeEach(() => {
            setDecoratorData();
        });

        it("fetches auth data and dispatches an authupdated event", async () => {
            const authResponse = { auth: { authenticated: true, userId: "1" } };
            http.get("/auth", { json: authResponse });
            const listener = vi.fn();
            window.addEventListener("authupdated", listener);

            const result = await refreshAuthData();

            expect(http.lastCall?.pathname).toBe("/auth");
            expect(http.lastCall?.init.credentials).toBe("include");
            expect(result).toEqual(authResponse);
            expect(listener).toHaveBeenCalled();

            window.removeEventListener("authupdated", listener);
        });

        it("logs and falls back to unauthenticated when the fetch fails", async () => {
            const errorSpy = vi
                .spyOn(logger, "error")
                .mockImplementation(() => {});
            // A retryable 503 — but authApi is extended with retry: 0, so it
            // must fail after exactly one attempt. The parent client's retry: 2
            // would have made this three calls (and much slower).
            http.get("/auth", { status: 503 });

            const result = await refreshAuthData();

            expect(errorSpy).toHaveBeenCalledWith(
                "Failed to fetch auth data.",
                expect.objectContaining({ error: expect.any(Error) }),
            );
            expect(result).toEqual({ auth: { authenticated: false } });
            expect(http.calls).toHaveLength(1);
        });
    });

    describe("fetchOrRenewSession", () => {
        const sessionApiUrl = "https://login.nav.no/oauth2/session";

        beforeEach(() => {
            setDecoratorData({
                env: { LOGIN_SESSION_API_URL: sessionApiUrl },
            } as never);
        });

        it("fetches the session", async () => {
            const session = { session: {}, tokens: {} };
            // Bare fetch, not corgi — the same installed global records it.
            http.get(sessionApiUrl, { json: session });

            const result = await fetchOrRenewSession("fetch");

            expect(http.lastCall?.url).toBe(sessionApiUrl);
            expect(http.lastCall?.init.credentials).toBe("include");
            expect(result).toEqual(session);
        });

        it("hits the refresh endpoint when renewing", async () => {
            http.get(`${sessionApiUrl}/refresh`, { json: {} });

            await fetchOrRenewSession("renew");

            expect(http.lastCall?.url).toBe(`${sessionApiUrl}/refresh`);
            expect(http.lastCall?.init.credentials).toBe("include");
        });

        it("returns null on a non-ok response", async () => {
            http.get(sessionApiUrl, { status: 401 });

            expect(await fetchOrRenewSession("fetch")).toBeNull();
        });

        it("logs and returns null when the fetch throws", async () => {
            const errorSpy = vi
                .spyOn(logger, "error")
                .mockImplementation(() => {});
            http.get(`${sessionApiUrl}/refresh`, networkError());

            expect(await fetchOrRenewSession("renew")).toBeNull();
            expect(errorSpy).toHaveBeenCalledWith(
                "Failed to renew session.",
                expect.objectContaining({ error: expect.any(Error) }),
            );
        });
    });
});
