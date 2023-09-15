import { LoginLevel } from 'decorator-shared/params';

export type Auth = {
  authenticated: boolean;
  name: string;
  securityLevel: string;
};

console.log(import.meta.env.VITE_DECORATOR_API);

export async function checkAuth({
  onSuccess,
  onError,
}: {
  onSuccess?: (response: Auth) => void;
  onError?: (error: Error) => void;
}) {
  const authUrl = `${import.meta.env.VITE_DECORATOR_API}/auth`;
  const sessionUrl = `${import.meta.env.VITE_AUTH_API}/oauth2/session`;

  try {
    const fetchResponse = await fetch(authUrl, {
      credentials: 'include',
    });
    const response = await fetchResponse.json();

    if (!response.authenticated) {
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
  return `${import.meta.env.VITE_LOGIN_URL}?redirect=${
    window.location.href
  }&level=${loginLevel}`;
}
