import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { clientEnv, env } from '../env/server';
import { logger } from '../lib/logger';
import { authHandler, getLogOutUrl } from './auth-handler';
import { parseAndValidateParams } from '../validateParams';

describe('getLogOutUrl', () => {
	it('uses explicit logoutUrl when provided', () => {
		const params = parseAndValidateParams({
			logoutUrl: 'https://www.nav.no/custom-logout',
			redirectToUrlLogout: 'https://www.nav.no/ignored-redirect',
		});

		expect(getLogOutUrl(params)).toBe('https://www.nav.no/custom-logout');
	});

	it('uses redirectToUrlLogout when logoutUrl is missing', () => {
		const redirectToUrlLogout = 'https://www.nav.no/after-logout';
		const params = parseAndValidateParams({
			redirectToUrlLogout,
		});

		expect(getLogOutUrl(params)).toBe(`${clientEnv.LOGOUT_URL}?redirect=${redirectToUrlLogout}`);
	});

	it('uses default logout url when neither parameter is provided', () => {
		const params = parseAndValidateParams({});

		expect(getLogOutUrl(params)).toBe(clientEnv.LOGOUT_URL);
	});
});

describe('authHandler', () => {
	const authApiUrl = `${env.DEKORATOREN_API_URL}/auth`;
	const loggedIn = { authenticated: true, name: 'Ola Nordmann', userId: '1', securityLevel: '4' };
	// samarbeidspartner renders a logout button, so no notifications are fetched
	const params = parseAndValidateParams({ context: 'samarbeidspartner' });
	const server = setupServer();
	const requests: Request[] = [];

	const answer = (...responses: Array<() => Response>) => {
		let call = 0;
		server.use(
			http.get(authApiUrl, ({ request }) => {
				requests.push(request);
				return responses[Math.min(call++, responses.length - 1)]();
			})
		);
	};

	beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
	afterEach(() => {
		server.resetHandlers();
		requests.length = 0;
		vi.restoreAllMocks();
	});
	afterAll(() => server.close());

	it('asks for a new connection for every call, with the cookies', async () => {
		answer(() => HttpResponse.json(loggedIn));

		const result = await authHandler({ params, cookie: 'sso-nav.no=abc' });

		expect(result.auth).toEqual(loggedIn);
		expect(requests).toHaveLength(1);
		expect(requests[0].headers.get('connection')).toBe('close');
		expect(requests[0].headers.get('cookie')).toBe('sso-nav.no=abc');
	});

	it.each([502, 503])('retries once when the api answers %i', async (status) => {
		vi.spyOn(logger, 'warn').mockImplementation(() => {});
		answer(
			() => new HttpResponse(null, { status }),
			() => HttpResponse.json(loggedIn)
		);

		const result = await authHandler({ params, cookie: 'sso-nav.no=abc' });

		expect(result.auth).toEqual(loggedIn);
		expect(requests).toHaveLength(2);
	});

	it('retries once when the request fails', async () => {
		vi.spyOn(logger, 'warn').mockImplementation(() => {});
		answer(
			() => HttpResponse.error(),
			() => HttpResponse.json(loggedIn)
		);

		const result = await authHandler({ params, cookie: 'sso-nav.no=abc' });

		expect(result.auth).toEqual(loggedIn);
		expect(requests).toHaveLength(2);
	});

	it('gives up after the retry, as logged out', async () => {
		vi.spyOn(logger, 'warn').mockImplementation(() => {});
		const error = vi.spyOn(logger, 'error').mockImplementation(() => {});
		answer(() => new HttpResponse(null, { status: 502 }));

		const result = await authHandler({ params, cookie: 'sso-nav.no=abc' });

		expect(result).toEqual({ auth: { authenticated: false } });
		expect(requests).toHaveLength(2);
		expect(error).toHaveBeenCalledWith('Auth error', expect.any(Error));
	});

	it('does not retry other answers', async () => {
		vi.spyOn(logger, 'error').mockImplementation(() => {});
		answer(() => new HttpResponse(null, { status: 500 }));

		await authHandler({ params, cookie: 'sso-nav.no=abc' });

		expect(requests).toHaveLength(1);
	});
});
