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

// Temporary, for /auth-new. The address is the same in dev and prod.
export const AUTH_NEW_API_URL = 'http://nav-dekoratoren-auth.navno/navno/nav-dekoratoren-auth/auth';

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
 * Each call opens its own connection to nav-dekoratoren-api (`Connection: close`).
 *
 * Its pods run Wonderwall as a native sidecar, which Kubernetes stops only after the app
 * container has exited, and which keeps kept-alive connections open until then. On a scale-down
 * or deploy, a reused connection to that pod gets "connection refused" from Wonderwall, as a 502,
 * for the second or two between the app stopping and Wonderwall stopping. New connections only go
 * to pods that are still in the Service, and nais waits 5 s before stopping the app, so a pod that's
 * shutting down has stopped getting requests by then.
 *
 * A 502/503 or a failed request is retried once, after a random wait of up to 300 ms, and on a
 * new connection too.
 *
 * Each attempt gets 3 s. The api answers in about 50 ms (p99), and its own call to PDL gives up
 * after 2 s. Without a limit, a call waits for undici's defaults: 10 s to connect (a network blip,
 * which hits every call since each one connects) and 300 s for the response (an api pod that
 * hangs). A timed-out attempt is retried like a failed one, so a call takes at most about 6.3 s.
 */
const authApi = corgi.create({
	headers: { 'Cache-Control': 'no-cache', Connection: 'close' },
	timeout: 3000,
	retry: {
		retries: 1,
		statuses: [502, 503],
		maxDelay: 1000,
		onRetry: ({ error, response }) =>
			response
				? logger.warn(`Auth api answered ${response.status}, retrying`)
				: logger.warn('Auth api request failed, retrying', error),
	},
});

const fetchAuth = async (cookiesHeader: string, authApiUrl: string): Promise<Auth | null> => {
	try {
		return await authApi.get<Auth>(authApiUrl, { headers: { Cookie: cookiesHeader } }); // TODO: validate response
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
	authApiUrl = AUTH_API_URL,
}: {
	params: Params;
	cookie: string;
	authApiUrl?: string;
}): Promise<AuthDataResponse> => {
	if (!cookie) {
		return { auth: { authenticated: false } };
	}

	const auth = await fetchAuth(cookie, authApiUrl);
	if (!auth?.authenticated) {
		return { auth: { authenticated: false } };
	}

	const usermenuHtml = await buildUsermenuHtml(auth, cookie, params);

	return { auth, usermenuHtml };
};
