import { LoginLevel } from 'decorator-shared/params';
// NOTE: I don't think this file is used anymore

export type Auth = {
  authenticated: boolean;
  name: string;
  securityLevel: string;
};

export async function checkAuth({
  onSuccess,
  onError,
}: {
  onSuccess?: (response: Auth) => void;
  onError?: (error: Error) => void;
}) {
  const authUrl = `${window.__DECORATOR_DATA__.env.APP_URL}/api/auth`;
  const sessionUrl = `${window.__DECORATOR_DATA__.env.AUTH_API_URL}/oauth2/session`;

  try {
    const fetchResponse = await fetch(authUrl, {
      credentials: 'include',
    });
    const response = await fetchResponse.json();

    if (!response.authenticated) {
      onSuccess && onSuccess(response);
      return;
    }

    const sessionResponse = await fetch(sessionUrl, {
      credentials: 'include',
    });
    const session = await sessionResponse.json();
    console.log(session);
    onSuccess && onSuccess(response);
  } catch (error) {
    onError && onError(error as Error);
    throw new Error(`Error fetching auth: ${error}`);
  }
}

export function makeLoginUrl(loginLevel: LoginLevel): string {
  return `${window.__DECORATOR_DATA__.env.LOGIN_URL}?redirect=${
    window.location.href
  }&level=${loginLevel}`;
}

export function archive(eventId: { eventId: string }) {
  return fetch(
    `${window.__DECORATOR_DATA__.env.VARSEL_API_URL}/notifications/message/archive`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventId),
      // onnly testing
      credentials: 'include',
      keepalive: true,
    },
  ).catch((e) =>
    console.info(
      `Error posting done event for notifications [eventId: ${eventId?.eventId} - error: ${e}]`,
    ),
  );
}
