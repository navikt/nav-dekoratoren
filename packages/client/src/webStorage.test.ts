import Cookies from 'js-cookie';
import { PublicStorageItem } from 'decorator-shared/types';
import { CONSENT_COOKIE_NAME, CONSENT_STATE_ELEMENT_ID, CURRENT_CONSENT_VERSION } from 'decorator-shared/constants';
import { consentDetectionScript } from 'decorator-server/src/views/consent-banner';
import { WebStorageController } from './webStorage';
import { logger } from './helpers/logger';
import { apiPath, http, setDecoratorData, waitFor } from './test-setup';

const mockStorageDictionary: PublicStorageItem[] = [
	{
		name: 'selvbetjening-idtoken',
		type: 'cookie',
		optional: false,
	},
	{
		name: 'usertest-*',
		optional: true,
		type: 'cookie',
	},
	{
		name: 'AMP_*',
		type: 'cookie',
		optional: true,
	},
	{
		name: '_hjSession*',
		type: 'cookie',
		optional: true,
	},
] as PublicStorageItem[];

/**
 * The controller clears cookies, localStorage, and sessionStorage in one
 * synchronous pass, a few microtask hops after construction. For the
 * "slettes ikke"-tests, waiting on the surviving item would pass before the
 * pass has even run — so wait for a sentinel the pass always deletes; once
 * it's gone, everything still present survived for real.
 */
const waitForClearingPass = () => waitFor(() => expect(window.sessionStorage.getItem('usertest-1234')).toBeNull());

const consentCookie = (version = CURRENT_CONSENT_VERSION) =>
	JSON.stringify({
		consent: { analytics: true, surveys: true },
		userActionTaken: true,
		meta: {
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-01T00:00:00.000Z',
			version,
			analyticsId: null,
		},
	});

const getConsentState = () => document.getElementById(CONSENT_STATE_ELEMENT_ID)?.dataset.state;

// Leaves the state element the way the pre-paint script, or an earlier
// controller, would.
const seedConsentState = (state: 'pending' | 'decided' | 'reshow') => {
	const stateElement = document.createElement('style');
	stateElement.id = CONSENT_STATE_ELEMENT_ID;
	stateElement.dataset.state = state;
	document.head.append(stateElement);
};

describe('Pre-paint-skriptet', () => {
	// Runs the real script, with whitespace collapsed the way the production build
	// minifies html`` templates (packages/server/build.ts), so anything relying on
	// newlines fails here too.
	const runPrePaintScript = () => {
		const template = document.createElement('template');
		template.innerHTML = consentDetectionScript().render({ language: 'nb' }).replace(/\s+/g, ' ').replace(/> </g, '><');

		const script = document.createElement('script');
		script.textContent = template.content.querySelector('script')?.textContent ?? '';
		document.body.append(script);
		script.remove();
	};

	beforeEach(() => {
		document.getElementById(CONSENT_STATE_ELEMENT_ID)?.remove();
		Cookies.remove(CONSENT_COOKIE_NAME);
	});

	it('setter pending uten samtykke-cookie, uten å røre <html>', () => {
		const htmlAttributeCount = document.documentElement.attributes.length;
		runPrePaintScript();

		const stateElement = document.getElementById(CONSENT_STATE_ELEMENT_ID);
		expect(stateElement?.parentElement).toBe(document.head);
		expect(stateElement?.dataset.state).toBe('pending');
		expect(document.documentElement.attributes).toHaveLength(htmlAttributeCount);
	});

	it('setter decided ved gyldig samtykke', () => {
		Cookies.set(CONSENT_COOKIE_NAME, consentCookie());
		runPrePaintScript();

		expect(getConsentState()).toBe('decided');
	});

	it('setter pending ved samtykke til en eldre versjon', () => {
		Cookies.set(CONSENT_COOKIE_NAME, consentCookie(CURRENT_CONSENT_VERSION - 1));
		runPrePaintScript();

		expect(getConsentState()).toBe('pending');
	});

	it('setter pending når samtykke-cookien ikke kan leses', () => {
		Cookies.set(CONSENT_COOKIE_NAME, '{ikke json');
		runPrePaintScript();

		expect(getConsentState()).toBe('pending');
	});

	it('overskriver ikke tilstand som allerede er satt', () => {
		seedConsentState('reshow');
		runPrePaintScript();

		expect(document.querySelectorAll(`#${CONSENT_STATE_ELEMENT_ID}`)).toHaveLength(1);
		expect(getConsentState()).toBe('reshow');
	});
});

describe('Tester webStorage', () => {
	const controllers: WebStorageController[] = [];

	// Instances register listeners on window/document in their constructor.
	// Track them so every test tears its own down instead of stacking
	// listeners across the suite.
	const createController = () => {
		const controller = new WebStorageController();
		controllers.push(controller);
		return controller;
	};

	beforeEach(() => {
		document.getElementById(CONSENT_STATE_ELEMENT_ID)?.remove();
		Cookies.remove(CONSENT_COOKIE_NAME);

		setDecoratorData({
			allowedStorage: mockStorageDictionary,
		} as never);

		Cookies.set('usertest-1234', 'foobar');
		Cookies.set('AMP_1234', 'foobar');
		Cookies.set('_hjSessionUser_118350', 'foobar');
		Cookies.set('amp_abcdef', 'foobar');
		Cookies.set('selvbetjening-idtoken', 'foobar');
		Cookies.set('ukjent-cookie', 'foobar');

		window.localStorage.setItem('usertest-1234', 'foobar');
		window.localStorage.setItem('ukjentdata', 'foobar');

		window.sessionStorage.setItem('usertest-1234', 'foobar');
		window.sessionStorage.setItem('ukjentdata', 'foobar');

		http.post(apiPath('/api/consentping'), { status: 204 });
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

	afterEach(() => {
		controllers.forEach((controller) => controller.destroy());
		controllers.length = 0;
	});

	it('kontrolleren sender event om å åpne cookie-banner ved manglende samtykke-handling', () => {
		const triggerEvent = vi.fn();
		const listenerController = new AbortController();
		window.addEventListener('showConsentBanner', triggerEvent, {
			signal: listenerController.signal,
		});
		createController();

		expect(triggerEvent).toHaveBeenCalled();
		expect(getConsentState()).toBe('pending');

		listenerController.abort();
	});

	it('gyldig samtykke lar tilstanden fra pre-paint-skriptet stå urørt', () => {
		seedConsentState('decided');
		Cookies.set(CONSENT_COOKIE_NAME, consentCookie());

		const triggerEvent = vi.fn();
		const listenerController = new AbortController();
		window.addEventListener('showConsentBanner', triggerEvent, {
			signal: listenerController.signal,
		});
		createController();

		expect(triggerEvent).not.toHaveBeenCalled();
		expect(getConsentState()).toBe('decided');

		listenerController.abort();
	});

	// The banner is hidden by default in CSS, but the pre-paint script sets
	// "pending" for anyone without a valid consent cookie. Suppressing the
	// banner therefore has to be an explicit downgrade to "decided".
	it('banneret skjules for kjente verktøy selv om pre-paint-skriptet har satt pending', () => {
		seedConsentState('pending');

		// Shadow the prototype getter with an own property, then drop it again
		// so the real getter takes over.
		Object.defineProperty(window.navigator, 'userAgent', {
			value: 'Mozilla/5.0 (compatible; siteimprove.com)',
			configurable: true,
		});

		const triggerEvent = vi.fn();
		const listenerController = new AbortController();
		window.addEventListener('showConsentBanner', triggerEvent, {
			signal: listenerController.signal,
		});

		try {
			createController();

			expect(triggerEvent).not.toHaveBeenCalled();
			expect(getConsentState()).toBe('decided');
		} finally {
			listenerController.abort();
			Reflect.deleteProperty(window.navigator, 'userAgent');
		}
	});

	it('eksplisitt visning via showConsentBanner gir reshow og sender begge eventene', () => {
		const controller = createController();
		expect(getConsentState()).toBe('pending');

		const showEvent = vi.fn();
		const reshowEvent = vi.fn();
		const listenerController = new AbortController();
		const { signal } = listenerController;
		window.addEventListener('showConsentBanner', showEvent, { signal });
		window.addEventListener('reshowConsentBanner', reshowEvent, {
			signal,
		});

		controller.showConsentBanner();

		expect(getConsentState()).toBe('reshow');
		expect(showEvent).toHaveBeenCalledTimes(1);
		expect(reshowEvent).toHaveBeenCalledTimes(1);

		listenerController.abort();
	});

	it('klikk på data-consent-banner-trigger gir reshow og sender begge eventene', () => {
		createController();

		// Mirrors the "Endre samtykke" link rendered by the main menu.
		const trigger = document.createElement('a');
		trigger.href = '#';
		trigger.dataset.consentBannerTrigger = 'true';
		document.body.append(trigger);

		const showEvent = vi.fn();
		const reshowEvent = vi.fn();
		const listenerController = new AbortController();
		const { signal } = listenerController;
		window.addEventListener('showConsentBanner', showEvent, { signal });
		window.addEventListener('reshowConsentBanner', reshowEvent, {
			signal,
		});

		try {
			trigger.click();

			expect(getConsentState()).toBe('reshow');
			expect(showEvent).toHaveBeenCalledTimes(1);
			expect(reshowEvent).toHaveBeenCalledTimes(1);
		} finally {
			listenerController.abort();
			trigger.remove();
		}
	});

	it('consent-reset i URL-en gir reshow, også når pre-paint-skriptet har satt decided', () => {
		// What the pre-paint script sets for users with valid consent.
		seedConsentState('decided');
		window.location.hash = 'consent-reset';

		try {
			createController();

			expect(getConsentState()).toBe('reshow');
		} finally {
			history.replaceState(null, '', window.location.pathname + window.location.search);
		}
	});

	it('kjente frivillige cookies slettes når cookie-banner vises', async () => {
		expect(Cookies.get('usertest-1234')).toBe('foobar');
		expect(Cookies.get('AMP_1234')).toBe('foobar');
		expect(Cookies.get('_hjSessionUser_118350')).toBe('foobar');
		expect(Cookies.get('amp_abcdef')).toBe('foobar');

		createController();

		await waitFor(() => {
			expect(Cookies.get('usertest-1234')).toBeUndefined();
			expect(Cookies.get('AMP_1234')).toBeUndefined();
			expect(Cookies.get('_hjSessionUser_118350')).toBeUndefined();
			expect(Cookies.get('amp_abcdef')).toBeUndefined();
		});
	});
	it('kjente nødvendige cookies slettes ikke når cookie-banner vises', async () => {
		expect(Cookies.get('selvbetjening-idtoken')).toBe('foobar');

		createController();
		await waitForClearingPass();

		expect(Cookies.get('selvbetjening-idtoken')).toBe('foobar');
	});

	it('ukjente cookies slettes ikke når cookie-banner vises', async () => {
		expect(Cookies.get('ukjent-cookie')).toBe('foobar');

		createController();
		await waitForClearingPass();

		expect(Cookies.get('ukjent-cookie')).toBe('foobar');
	});

	it('kjente frivillige localStorage-elementer slettes når cookie-banner vises', async () => {
		expect(window.localStorage.getItem('usertest-1234')).toBe('foobar');

		createController();

		await waitFor(() => expect(window.localStorage.getItem('usertest-1234')).toBeNull());
	});
	it('ukjente localStorage-elementer slettes ikke når cookie-banner vises', async () => {
		expect(window.localStorage.getItem('ukjentdata')).toBe('foobar');

		createController();
		await waitForClearingPass();

		expect(window.localStorage.getItem('ukjentdata')).toBe('foobar');
	});
	it('kjente frivillige sessionStorage-elementer slettes når cookie-banner vises', async () => {
		expect(window.sessionStorage.getItem('usertest-1234')).toBe('foobar');

		createController();

		await waitFor(() => expect(window.sessionStorage.getItem('usertest-1234')).toBeNull());
	});
	it('ukjente sessionStorage-elementer slettes ikke når cookie-banner vises', async () => {
		expect(window.sessionStorage.getItem('ukjentdata')).toBe('foobar');

		createController();
		await waitForClearingPass();

		expect(window.sessionStorage.getItem('ukjentdata')).toBe('foobar');
	});

	it('samtykke sendes til consentping-endepunktet', async () => {
		createController();

		window.dispatchEvent(new CustomEvent('consentAllWebStorage'));

		await http.settled();
		const call = http.lastCall!;
		expect(call.pathname).toBe(apiPath('/api/consentping'));
		expect(call.method).toBe('POST');
		expect(call.init.credentials).toBe('omit');

		// The body was already a JSON string in production code; the mock
		// hands it back parsed instead of via mock.calls spelunking.
		expect(call.json()).toEqual(
			expect.objectContaining({
				consentObject: expect.objectContaining({
					consent: { analytics: true, surveys: true },
					userActionTaken: true,
				}),
				originUrl: expect.objectContaining({
					redactedUrl: expect.any(String),
				}),
			})
		);
	});

	it('samtykke lagres selv om consentping feiler', async () => {
		const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
		http.post(apiPath('/api/consentping'), { status: 400 });
		createController();

		window.dispatchEvent(new CustomEvent('consentAllWebStorage'));

		await waitFor(() => expect(errorSpy).toHaveBeenCalled());
		expect(errorSpy).toHaveBeenCalledWith(
			'Failed to send consent ping',
			expect.objectContaining({ error: expect.any(Error) })
		);
		expect(Cookies.get('navno-consent')).toBeDefined();
	});
});
