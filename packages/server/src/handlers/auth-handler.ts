import { Auth, AuthDataResponse, AuthLoggedIn } from 'decorator-shared/auth';
import { type Params } from 'decorator-shared/params';
import { LeaveIcon } from 'decorator-icons';
import { corgi } from '@itsy/corgi/chonk';
import { match } from 'ts-pattern';
import { logger } from '../lib/logger';
import { clientEnv, env } from '../env/server';
import i18n from '../i18n';
import { fetchNotifications } from '../notifications';
import { HeaderButton } from '../views/components/header-button';
import { ArbeidsgiverUserMenuDropdown } from '../views/header/arbeidsgiver-user-menu-dropdown';
import { UserMenuDropdown } from '../views/header/user-menu-dropdown';
import { SimpleUserMenu } from '../views/simple-user-menu';

const AUTH_API_URL = `${env.DEKORATOREN_API_URL}/auth`;

export const getLogOutUrl = (params: Params) => {
	if (params.logoutUrl) {
		return params.logoutUrl;
	}

	if (params.redirectToUrlLogout) {
		return `${clientEnv.LOGOUT_URL}?redirect=${params.redirectToUrlLogout}`;
	}

	return clientEnv.LOGOUT_URL;
};

/**
 * `Connection: close` is used below for two reasons
 * - When a pod is stopping, Wonderwall answers with 502s on connections that are kept open
 * - Retries will (more likely) hit a different pod, which is useful if one single pod is hanging or any other error condition
 *
 * The 2.5s timeout is just slightly more than the response time dekoratoren-auth gives PDL.
 * All retries/timeouts together are limited to 3.2s, which is intentionally below the client's 3.5s - that leaves time for a client-retry as well.
 */
const authApi = corgi.create({
	headers: { 'Cache-Control': 'no-cache', Connection: 'close' },
	timeout: 2500,
	retry: {
		retries: 3,
		statuses: [500, 502, 503],
		backoff: 50,
		maxDelay: 500,
		onRetry: ({ error, response }) =>
			response
				? logger.warn(`Auth api answered ${response.status}, retrying`)
				: logger.warn('Auth api request failed, retrying', error),
	},
});

const fetchAuth = async (cookiesHeader: string): Promise<Auth | null> => {
	try {
		// TODO: validate response
		return await authApi.get<Auth>(AUTH_API_URL, {
			headers: { Cookie: cookiesHeader },
			signal: AbortSignal.timeout(3200),
		});
	} catch (e) {
		logger.error('Auth error', e);
		return null;
	}
};

const buildUsermenuHtml = async (auth: AuthLoggedIn, cookie: string, params: Params) => {
	const logoutUrl = getLogOutUrl(params);

	if (params.simple || params.simpleHeader) {
		return SimpleUserMenu({
			logoutUrl,
			name: auth.name,
		}).render(params);
	}

	// @TODO: Tests for important urls, like logout
	const template = await match(params.context)
		.with('privatperson', async () => {
			const notificationsResult = await fetchNotifications({ cookie });

			return UserMenuDropdown({
				name: auth.name,
				notifications: notificationsResult.ok ? notificationsResult.data : null,
				level: `Level${auth.securityLevel}`,
				loginUrl: env.LOGIN_URL,
				logoutUrl: logoutUrl as string,
				minsideUrl: clientEnv.MIN_SIDE_URL,
				personopplysningerUrl: env.PERSONOPPLYSNINGER_URL,
			});
		})
		.with('arbeidsgiver', async () =>
			ArbeidsgiverUserMenuDropdown({
				href: clientEnv.MIN_SIDE_ARBEIDSGIVER_URL,
				logoutUrl: logoutUrl as string,
				name: auth.name,
			})
		)
		.with('samarbeidspartner', async () =>
			HeaderButton({
				content: i18n('logout'),
				icon: LeaveIcon(),
				href: logoutUrl,
			})
		)
		.exhaustive();

	return template.render(params);
};

export const authHandler = async ({
	params,
	cookie,
}: {
	params: Params;
	cookie: string;
}): Promise<AuthDataResponse> => {
	if (!cookie) {
		return { auth: { authenticated: false } };
	}

	const auth = await fetchAuth(cookie);
	if (!auth?.authenticated) {
		return { auth: { authenticated: false } };
	}

	const usermenuHtml = await buildUsermenuHtml(auth, cookie, params);

	return { auth, usermenuHtml };
};
