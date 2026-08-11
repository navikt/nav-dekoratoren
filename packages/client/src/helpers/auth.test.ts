import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    SessionData,
    fetchOrRenewSession,
    refreshAuthData,
    transformSessionToAuth,
} from "./auth";
import { logger } from "./logger";
import {
    decoratorApiMock,
    decoratorParamsMock,
    resetDecoratorApiMock,
    setDecoratorData,
} from "./api.testUtils";

vi.mock("./api", async () => {
    const mock = await import("./api.testUtils");
    return {
        decoratorApi: mock.decoratorApiMock,
        decoratorParams: mock.decoratorParamsMock,
    };
});

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
            resetDecoratorApiMock();
            setDecoratorData();
        });

        it("fetches auth data and dispatches an authupdated event", async () => {
            const authResponse = { auth: { authenticated: true, userId: "1" } };
            decoratorApiMock.mockResolvedValue(authResponse);
            const listener = vi.fn();
            window.addEventListener("authupdated", listener);

            const result = await refreshAuthData();

            expect(decoratorApiMock).toHaveBeenCalledWith("/auth", {
                query: { mocked: true },
                credentials: "include",
            });
            expect(decoratorParamsMock).toHaveBeenCalled();
            expect(result).toEqual(authResponse);
            expect(listener).toHaveBeenCalled();

            window.removeEventListener("authupdated", listener);
        });

        it("logs and falls back to unauthenticated when the fetch fails", async () => {
            const errorSpy = vi
                .spyOn(logger, "error")
                .mockImplementation(() => {});
            decoratorApiMock.mockRejectedValue(new Error("boom"));

            const result = await refreshAuthData();

            expect(errorSpy).toHaveBeenCalledWith(
                "Failed to fetch auth data.",
                expect.objectContaining({ error: expect.any(Error) }),
            );
            expect(result).toEqual({ auth: { authenticated: false } });
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
            const fetchSpy = vi
                .spyOn(globalThis, "fetch")
                .mockResolvedValue(
                    new Response(JSON.stringify(session), { status: 200 }),
                );

            const result = await fetchOrRenewSession("fetch");

            expect(fetchSpy).toHaveBeenCalledWith(sessionApiUrl, {
                credentials: "include",
            });
            expect(result).toEqual(session);
        });

        it("hits the refresh endpoint when renewing", async () => {
            const fetchSpy = vi
                .spyOn(globalThis, "fetch")
                .mockResolvedValue(new Response("{}", { status: 200 }));

            await fetchOrRenewSession("renew");

            expect(fetchSpy).toHaveBeenCalledWith(`${sessionApiUrl}/refresh`, {
                credentials: "include",
            });
        });

        it("returns null on a non-ok response", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue(
                new Response("", { status: 401 }),
            );

            expect(await fetchOrRenewSession("fetch")).toBeNull();
        });

        it("logs and returns null when the fetch throws", async () => {
            const errorSpy = vi
                .spyOn(logger, "error")
                .mockImplementation(() => {});
            vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("boom"));

            expect(await fetchOrRenewSession("renew")).toBeNull();
            expect(errorSpy).toHaveBeenCalledWith(
                "Failed to renew session.",
                expect.objectContaining({ error: expect.any(Error) }),
            );
        });
    });
});
