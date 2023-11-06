export type AuthData = {
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
      // credentials: 'include',
    });

    return await sessionResponse.json();
  } catch (error) {
    throw new Error(`Error fetching auth: ${error}`);
  }
}

export async function fethRenew() {
  const sessionUrl = `${window.__DECORATOR_DATA__.env.AUTH_API_URL}/oauth2/session/refresh`;

  try {
    const sessionResponse = await fetch(sessionUrl, {
      // credentials: 'include',
    });

    return await sessionResponse.json();
  } catch (error) {
    throw new Error(`Error fetching auth: ${error}`);
  }
}

export function getSecondsToExpiration(expiration: string) {
  const now = new Date().getTime();
  const expires = new Date(expiration).getTime();
  return Math.ceil((expires - now) / 1000);
}

export function fakeExpirationTime(seconds: number) {
  const fakeTokenEndsAt = new Date(Date.now() + seconds * 1000).toISOString();
  return fakeTokenEndsAt;
}
