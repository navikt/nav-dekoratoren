import { AuthDataResponse } from "decorator-shared/auth";
import { createEvent } from "../events";
import { env } from "../params";
import { endpointUrlWithParams } from "./urls";

export type SessionData = {
    session: {
        created_at: string;
        ends_at: string;
        timeout_at: string;
        ends_in_seconds: number;
        active: boolean;
        timeout_in_seconds: number;
    };
    tokens: {
        expire_at: string;
        refreshed_at: string;
        expire_in_seconds: number;
        next_auto_refresh_in_seconds: number;
        refresh_cooldown: boolean;
        refresh_cooldown_seconds: number;
    };
};

export async function fetchSession() {
    const sessionUrl = window.__DECORATOR_DATA__.env.LOGIN_SESSION_API_URL;

    try {
        const sessionResponse = await fetch(sessionUrl, {
            credentials: "include",
        });
        if (sessionResponse.status === 401) {
            // Uinnlogget, ikke prøv å hente ut json
            return null;
        }
        return (await sessionResponse.json()) as SessionData;
    } catch (error) {
        console.error(`Failed to fetch session - ${error}`);
        return null;
    }
}

export async function fetchRenew() {
    const sessionRefreshUrl = `${window.__DECORATOR_DATA__.env.LOGIN_SESSION_API_URL}/refresh`;

    try {
        const sessionResponse = await fetch(sessionRefreshUrl, {
            credentials: "include",
        });
        if (sessionResponse.status === 401) {
            // Uinnlogget, ikke prøv å hente ut json
            return null;
        }
        return (await sessionResponse.json()) as SessionData;
    } catch (error) {
        console.error(`Failed to renew session - ${error}`);
        return null;
    }
}

export function transformSessionToAuth(session: SessionData) {
    const sessionExpireInSeconds = session.session.ends_in_seconds;
    const tokenExpireInSeconds = session.tokens.expire_in_seconds;

    const sessionExpireAtLocal = new Date(
        new Date().getTime() + sessionExpireInSeconds * 1000,
    ).toISOString();
    const tokenExpireAtLocal = new Date(
        new Date().getTime() + tokenExpireInSeconds * 1000,
    ).toISOString();

    return {
        sessionExpireAtLocal,
        tokenExpireAtLocal,
    };
}

export const logout = () => (window.location.href = env("LOGOUT_URL"));

const OneMinuteTimeout = 60000;
const fetchAuthData = async (): Promise<AuthDataResponse> => {
    const url = endpointUrlWithParams("/auth");

    return fetch(url, {
        signal: AbortSignal.timeout(OneMinuteTimeout),
        credentials: "include",
    })
        .then((res) => res.json() as Promise<AuthDataResponse>)
        .catch((error) => {
            console.error(`Failed to fetch auth data - ${error}`);
            return { auth: { authenticated: false } };
        });
};

export const refreshAuthData = () =>
    fetchAuthData().then((authResponse) => {
        dispatchEvent(createEvent("authupdated", { detail: authResponse }));
        return authResponse;
    });
