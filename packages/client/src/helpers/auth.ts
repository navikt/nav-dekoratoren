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
    const sessionUrl = `${window.__DECORATOR_DATA__.env.AUTH_API_URL}/oauth2/session`;

    try {
        const sessionResponse = await fetch(sessionUrl, {
            credentials: "include",
        });

        return (await sessionResponse.json()) as SessionData;
    } catch (error) {
        return null;
    }
}

export async function fetchRenew() {
    const sessionUrl = `${window.__DECORATOR_DATA__.env.AUTH_API_URL}/oauth2/session/refresh`;

    try {
        const sessionResponse = await fetch(sessionUrl, {
            credentials: "include",
        });

        return (await sessionResponse.json()) as SessionData;
    } catch (error) {
        return null;
    }
}

export function getSecondsToExpiration(isoDate: string) {
    if (!isoDate) return 0;
    const now = new Date().getTime();
    const expires = new Date(isoDate).getTime();
    return Math.ceil((expires - now) / 1000);
}

export function fakeExpirationTime(seconds: number) {
    return new Date(Date.now() + seconds * 1000).toISOString();
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
