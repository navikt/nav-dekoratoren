import { fixture } from '@open-wc/testing-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSUMER, VERSION_ID_PARAM } from 'decorator-shared/constants';
import { logger } from '../helpers/logger';
import { refreshAuthData } from '../helpers/auth';
import { apiPath, http, setDecoratorData, waitFor } from '../test-setup';
import './header';

vi.mock('../helpers/auth', () => ({
	refreshAuthData: vi.fn(() => Promise.resolve()),
}));

const dispatchParamsUpdated = (changedKeys: string[]) =>
	window.dispatchEvent(
		new CustomEvent('paramsupdated', {
			detail: { changedKeys, params: {} },
		})
	);

const postDecoratorMessage = (payload: Record<string, unknown>) =>
	window.dispatchEvent(
		new MessageEvent('message', {
			data: { source: 'decoratorClient', event: 'params', payload },
			origin: window.location.origin,
			source: window,
		})
	);

describe('Header', () => {
	beforeEach(() => {
		setDecoratorData();
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

	it('refetches and swaps innerHTML on a relevant paramsupdated key', async () => {
		http.get(apiPath('/header'), { text: '<p>new header</p>' });
		const el = await fixture('<decorator-header></decorator-header>');

		dispatchParamsUpdated(['language']);

		await waitFor(() => expect(el.innerHTML).toBe('<p>new header</p>'));

		// The real request pipeline ran: decoratorParams built the query and
		// the withDecoratorMeta plugin appended the version-id/consumer meta.
		expect(http.lastCall?.pathname).toBe(apiPath('/header'));
		expect(http.lastCall?.query.get(VERSION_ID_PARAM)).toBe('test-version-id');
		expect(http.lastCall?.query.get('consumer')).toBe(CONSUMER);
	});

	it('refreshes auth data and asks for a consent banner recheck after a refetch', async () => {
		http.get(apiPath('/header'), { text: '<p>new header</p>' });
		const el = await fixture('<decorator-header></decorator-header>');
		const recheckSpy = vi.fn();
		el.addEventListener('recheckConsentBanner', recheckSpy);

		dispatchParamsUpdated(['simpleHeader']);

		await waitFor(() => expect(recheckSpy).toHaveBeenCalled());
		expect(refreshAuthData).toHaveBeenCalled();
	});

	it('only refreshes auth data on a context change', async () => {
		await fixture('<decorator-header></decorator-header>');

		dispatchParamsUpdated(['context']);

		await waitFor(() => expect(refreshAuthData).toHaveBeenCalled());
		expect(http.calls).toHaveLength(0);
	});

	it('ignores unrelated paramsupdated keys', async () => {
		await fixture('<decorator-header></decorator-header>');

		dispatchParamsUpdated(['pageTitle']);

		// no effect to observe — settled() waits out anything the mock started
		await http.settled();

		expect(http.calls).toHaveLength(0);
		expect(refreshAuthData).not.toHaveBeenCalled();
	});

	it('logs and keeps old content when the fetch fails', async () => {
		const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
		// 400 is non-retryable, so the module-scope retry: 2 client fails fast.
		http.get(apiPath('/header'), { status: 400 });
		const el = await fixture('<decorator-header>old</decorator-header>');

		dispatchParamsUpdated(['language']);
		await waitFor(() => expect(errorSpy).toHaveBeenCalled());

		expect(errorSpy).toHaveBeenCalledWith(
			'Failed to fetch header',
			expect.objectContaining({ error: expect.any(Error) })
		);
		expect(el.innerHTML).toBe('old');
	});

	describe('postMessage params updates for redirectToApp/redirectToUrl', () => {
		it('updates redirectToApp via postMessage', async () => {
			await fixture('<decorator-header></decorator-header>');

			postDecoratorMessage({ redirectToApp: true });

			await waitFor(() => expect(window.__DECORATOR_DATA__.params.redirectToApp).toBe(true));
		});

		it('updates redirectToUrl via postMessage', async () => {
			await fixture('<decorator-header></decorator-header>');

			postDecoratorMessage({ redirectToUrl: 'https://www.nav.no/mine-tjenester' });

			await waitFor(() =>
				expect(window.__DECORATOR_DATA__.params.redirectToUrl).toBe('https://www.nav.no/mine-tjenester')
			);
		});

		it('rejects an external redirectToUrl and leaves the param unset', async () => {
			await fixture('<decorator-header></decorator-header>');

			postDecoratorMessage({ redirectToUrl: 'https://evil.example.com' });

			// The schema `.catch(undefined)`s an invalid URL rather than throwing,
			// so the update is accepted but the value never becomes the external URL.
			await http.settled();
			expect(window.__DECORATOR_DATA__.params.redirectToUrl).not.toBe('https://evil.example.com');
		});
	});

	describe('postMessage params updates for chatbot/redirectToUrlLogout/shareScreen/logoutWarning', () => {
		it('updates chatbot via postMessage', async () => {
			await fixture('<decorator-header></decorator-header>');

			postDecoratorMessage({ chatbot: false });

			await waitFor(() => expect(window.__DECORATOR_DATA__.params.chatbot).toBe(false));
		});

		it('updates redirectToUrlLogout via postMessage', async () => {
			await fixture('<decorator-header></decorator-header>');

			postDecoratorMessage({ redirectToUrlLogout: 'https://www.nav.no/logget-ut' });

			await waitFor(() =>
				expect(window.__DECORATOR_DATA__.params.redirectToUrlLogout).toBe('https://www.nav.no/logget-ut')
			);
		});

		it('updates shareScreen via postMessage', async () => {
			await fixture('<decorator-header></decorator-header>');

			postDecoratorMessage({ shareScreen: false });

			await waitFor(() => expect(window.__DECORATOR_DATA__.params.shareScreen).toBe(false));
		});

		it('updates logoutWarning via postMessage', async () => {
			await fixture('<decorator-header></decorator-header>');

			postDecoratorMessage({ logoutWarning: false });

			await waitFor(() => expect(window.__DECORATOR_DATA__.params.logoutWarning).toBe(false));
		});
	});
});
