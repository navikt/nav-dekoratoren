import { LoginLevel } from "decorator-shared/params";

export type Auth = {
  authenticated: boolean;
  name: string;
  securityLevel: string;
};

// @TODO: Implement handling of API errors
export type AuthResponse = Auth;

export async function checkAuth() {
  const authUrl = `${window.__DECORATOR_DATA__.env.API_DEKORATOREN_URL}/auth`;
  const sessionUrl = window.__DECORATOR_DATA__.env.API_SESSION_URL;

  try {
    const fetchResponse = await fetch(authUrl, {
      credentials: "include",
    });
    const response = await fetchResponse.json();
    const sessionResponse = await fetch(sessionUrl, {
      credentials: "include",
    });
    const session = await sessionResponse.json();
    console.log(session)

    return response as Auth;
    // const session = await sessionResponse.json();
  } catch (error) {
    return {
      authenticated: false,
      name: "",
      securityLevel: "",
    };
  }
}

export function makeLoginUrl(loginLevel: LoginLevel): string {
  return `${window.__DECORATOR_DATA__.env.LOGIN_URL}?redirect=${window.location.href}&level=${loginLevel}`;
}

export function archive(eventId: { eventId: string }) {
  return fetch(
    `${window.__DECORATOR_DATA__.env.VARSEL_API_URL}/notifications/message/archive`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventId),
      credentials: "include",
      keepalive: true,
    },
  ).catch((e) =>
    console.info(
      `Error posting done event for notifications [eventId: ${eventId?.eventId} - error: ${e}]`,
    )
  );
}
