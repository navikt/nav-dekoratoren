import { AuthDataResponse } from 'decorator-shared/auth';
import { createEvent } from '../events';
import { env } from '../params';
import { logger } from './logger';
import { decoratorApi, decoratorParams } from './api';

const OneMinute = 60000;
const authApi = decoratorApi.extend({ retry: 0, timeout: OneMinute });

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

export type FetchRenew = 'fetch' | 'renew';
export async function fetchOrRenewSession(fetchOrRenew: FetchRenew) {
	const sessionUrl = window.__DECORATOR_DATA__.env.LOGIN_SESSION_API_URL;
	const fetchUrl = `${sessionUrl}${fetchOrRenew === 'renew' ? '/refresh' : ''}`;
	const startedAt = performance.now();
	let sessionResponse: Response | undefined;
	const logContext = () => ({
		url: fetchUrl,
		durationMs: Math.round(performance.now() - startedAt),
		online: navigator.onLine,
		visibilityState: document.visibilityState,
		phase: sessionResponse ? 'response' : 'request',
		status: sessionResponse?.status,
		contentType: sessionResponse?.headers.get('content-type'),
		redirected: sessionResponse?.redirected,
	});

	try {
		sessionResponse = await fetch(fetchUrl, {
			credentials: 'include',
		});
		if (!sessionResponse.ok) {
			if (sessionResponse.status !== 401) {
				logger.warn(`Failed to ${fetchOrRenew} session: unexpected HTTP status.`, logContext());
			}
			return null;
		}
		return (await sessionResponse.json()) as SessionData;
	} catch (error) {
		logger.error(`Failed to ${fetchOrRenew} session.`, { ...logContext(), error });
		return null;
	}
}

export function transformSessionToAuth(session: SessionData) {
	const sessionExpireInSeconds = session.session.ends_in_seconds;
	const tokenExpireInSeconds = session.tokens.expire_in_seconds;

	const sessionExpireAtLocal = new Date(new Date().getTime() + sessionExpireInSeconds * 1000).toISOString();
	const tokenExpireAtLocal = new Date(new Date().getTime() + tokenExpireInSeconds * 1000).toISOString();

	return {
		sessionExpireAtLocal,
		tokenExpireAtLocal,
	};
}

export const logout = () => (window.location.href = env('LOGOUT_URL'));

const fetchAuthData = async (): Promise<AuthDataResponse> => {
	try {
		const json = await authApi<AuthDataResponse>('/auth', {
			query: decoratorParams(),
			credentials: 'include',
		});
		return json;
	} catch (error) {
		logger.error(`Failed to fetch auth data.`, { error });
		return { auth: { authenticated: false } };
	}
};

export const refreshAuthData = async () => {
	const authResponse = await fetchAuthData();
	dispatchEvent(createEvent('authupdated', { detail: authResponse }));
	return authResponse;
};
