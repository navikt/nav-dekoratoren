import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseBooleanParam, validateParams, parseAndValidateParams } from './validateParams';
import { formatParams } from 'decorator-shared/json';
import { Params } from 'decorator-shared/params';
import { logger } from './lib/logger';

describe('Validating urls', () => {
	it('Should validate nav.no urls', () => {
		const params = parseAndValidateParams({
			redirectToUrl: 'https://myapp.nav.no/foo',
			redirectToUrlLogout: 'https://my.app.nav.no/bar',
			logoutUrl: 'https://www.nav.no/qwer',
			breadcrumbs: JSON.stringify([
				{
					handleInApp: false,
					title: 'test',
					url: 'https://www.nav.no/foobar',
				},
			]),
			availableLanguages: JSON.stringify([
				{
					handleInApp: false,
					url: 'https://www.nav.no/asdf',
					locale: 'nb',
				},
			]),
		} satisfies Partial<Record<keyof Params, unknown>>);

		const { redirectToUrl, redirectToUrlLogout, logoutUrl, breadcrumbs, availableLanguages } = params;

		expect([
			redirectToUrl,
			redirectToUrlLogout,
			logoutUrl,
			breadcrumbs[0].url,
			availableLanguages[0].url,
		]).not.toContain(undefined);
	});

	it('Should validate paths', () => {
		const params = parseAndValidateParams({
			redirectToUrl: '/foo',
			redirectToUrlLogout: '/bar',
			logoutUrl: '/qwer',
			breadcrumbs: JSON.stringify([
				{
					handleInApp: false,
					title: 'test',
					url: '/foobar',
				},
			]),
			availableLanguages: JSON.stringify([
				{
					handleInApp: false,
					url: '/asdf',
					locale: 'nb',
				},
			]),
		} satisfies Partial<Record<keyof Params, unknown>>);

		const { redirectToUrl, redirectToUrlLogout, logoutUrl, breadcrumbs, availableLanguages } = params;

		expect([
			redirectToUrl,
			redirectToUrlLogout,
			logoutUrl,
			breadcrumbs[0].url,
			availableLanguages[0].url,
		]).not.toContain(undefined);
	});

	it('Should not validate redirectToUrl with non-nav origin', () => {
		const params = parseAndValidateParams({
			redirectToUrl: 'https://www.vg.no',
		} satisfies Partial<Record<keyof Params, unknown>>);

		expect(params.redirectToUrl).toBeUndefined();
	});

	it('Should not validate redirectToUrlLogout with non-nav origins', () => {
		const params = parseAndValidateParams({
			redirectToUrlLogout: 'https://navv.no',
		} satisfies Partial<Record<keyof Params, unknown>>);

		expect(params.redirectToUrlLogout).toBeUndefined();
	});

	it('Should not validate logoutUrl with non-nav origins', () => {
		const params = parseAndValidateParams({
			logoutUrl: 'https://www.notevilatall.no',
		} satisfies Partial<Record<keyof Params, unknown>>);

		expect(params.logoutUrl).toBeUndefined();
	});

	it('Should not validate breadcrumbs with non-nav origins', () => {
		const params = parseAndValidateParams({
			breadcrumbs: JSON.stringify([
				{
					title: 'test',
					url: 'https://wwwnav.no/foobar',
				},
			]),
		} satisfies Partial<Record<keyof Params, unknown>>);

		expect(params.breadcrumbs[0].url).toBeUndefined();
	});

	it('Should not validate availableLanguages with non-nav origins', () => {
		const validateAvailableLanguage = () =>
			parseAndValidateParams({
				availableLanguages: JSON.stringify([
					{
						handleInApp: false,
						url: 'https://www.navno/asdf',
						locale: 'nb',
					},
				]),
			} satisfies Partial<Record<keyof Params, unknown>>);
		expect(validateAvailableLanguage).toThrow();
	});

	it('Should not validate logoutUrl without protocol prefix', () => {
		const params = parseAndValidateParams({
			logoutUrl: 'www.nav.no',
		} satisfies Partial<Record<keyof Params, unknown>>);

		expect(params.logoutUrl).toBeUndefined();
	});

	// Regression test: these passed the old regex-based system
	it.each([
		'//evil.com',
		'//evil.com/path',
		'/\\evil.com',
		'/\t/evil.com',
		'http://localhost.evil.com',
		'https://localhost.evil.com/steal',
		'http://localhost@evil.com',
		'http://localhost:8080@evil.com/x',
		'https://localhost-evil.com',
		'http://localhostevil.com',
	])('Should not validate open-redirect url %j', (url) => {
		const params = parseAndValidateParams({
			redirectToUrl: url,
			redirectToUrlLogout: url,
			logoutUrl: url,
		} satisfies Partial<Record<keyof Params, unknown>>);

		expect(params.redirectToUrl).toBeUndefined();
		expect(params.redirectToUrlLogout).toBeUndefined();
		expect(params.logoutUrl).toBeUndefined();
	});
});

describe('Parsing boolean query paramters', () => {
	it('"true" should return a boolean true', () => {
		expect(parseBooleanParam('true')).toEqual(true);
	});
	it('should reflect boolean if passed directly', () => {
		expect(parseBooleanParam(true)).toEqual(true);
	});
	it('Anything else should return false', () => {
		expect(parseBooleanParam({})).toEqual(false);
		expect(parseBooleanParam([])).toEqual(false);
		expect(parseBooleanParam([1, 2, 3])).toEqual(false);
	});
});

describe('Interpolating with defaults', () => {
	it('should return the default value if the key is not present', () => {
		const params = validateParams({});

		expect(params.shareScreen).toEqual(true);
	});

	it('should override the default value if the key is present', () => {
		const params = validateParams({
			shareScreen: 'false',
		});

		expect(params.shareScreen).toEqual(false);
	});
});

describe('Validating analytics origin', () => {
	it('should preserve a configured app origin', () => {
		const params = parseAndValidateParams({
			origin: 'navno-frontend',
		} satisfies Partial<Record<keyof Params, unknown>>);

		expect(params.origin).toBe('navno-frontend');
	});

	it('should reject an empty app origin', () => {
		expect(() =>
			parseAndValidateParams({
				origin: '',
			} satisfies Partial<Record<keyof Params, unknown>>)
		).toThrow();
	});
});

describe('JSON parsing', () => {
	it('should parse no breadcrumbs as an empty array', () => {
		const params = validateParams({});
		expect(params.breadcrumbs).toEqual([]);
	});

	it('should parse a stringified array of breadcrumbs', () => {
		const base = [
			{
				title: 'Arbeid og opphold i Norge',
				url: '/no/person/flere-tema/arbeid-og-opphold-i-norge',
			},
			{
				title: 'Medlemskap i folketrygden',
			},
		];
		const params = validateParams(
			Object.fromEntries(
				formatParams({
					breadcrumbs: base,
				}).entries()
			)
		);

		expect(params.breadcrumbs).toEqual(base);
	});
});

describe('decorator moduler metadata', () => {
	it('should parse valid decorator moduler metadata', () => {
		const params = parseAndValidateParams({
			decoratorModulerVersion: '4.1.1',
			decoratorModulerEntryPoint: 'ssr',
		});

		expect(params.decoratorModulerVersion).toBe('4.1.1');
		expect(params.decoratorModulerEntryPoint).toBe('ssr');
	});

	it('should keep decorator moduler version when entry point is missing', () => {
		const params = parseAndValidateParams({
			decoratorModulerVersion: '4.1.1',
		});

		expect(params.decoratorModulerVersion).toBe('4.1.1');
		expect(params.decoratorModulerEntryPoint).toBeUndefined();
	});

	it('should keep decorator moduler entry point when version is missing', () => {
		const params = parseAndValidateParams({
			decoratorModulerEntryPoint: 'csr',
		});

		expect(params.decoratorModulerVersion).toBeUndefined();
		expect(params.decoratorModulerEntryPoint).toBe('csr');
	});

	it('should keep valid decorator moduler version when the entry point is invalid', () => {
		const params = parseAndValidateParams({
			decoratorModulerVersion: '4.1.1',
			decoratorModulerEntryPoint: 'invalid',
		});

		expect(params.decoratorModulerVersion).toBe('4.1.1');
		expect(params.decoratorModulerEntryPoint).toBeUndefined();
	});

	it('should keep valid decorator moduler entry point when the version is not semver', () => {
		const params = parseAndValidateParams({
			decoratorModulerVersion: 'not-a-version',
			decoratorModulerEntryPoint: 'ssr',
		});

		expect(params.decoratorModulerVersion).toBeUndefined();
		expect(params.decoratorModulerEntryPoint).toBe('ssr');
	});
});

describe('Consumer identification', () => {
	it('should keep teamName as part of the validated params so it propagates to window.__DECORATOR_DATA__.params', () => {
		const params = parseAndValidateParams({
			teamName: 'nav-dekoratoren.navno',
		} satisfies Partial<Record<keyof Params, unknown>>);

		expect(params.teamName).toBe('nav-dekoratoren.navno');
	});

	it('should not throw when teamName is missing', () => {
		const params = parseAndValidateParams({});

		expect(params.teamName).toBeUndefined();
	});

	describe('logging', () => {
		afterEach(() => {
			vi.restoreAllMocks();
		});

		const spyOnLogger = () => ({
			info: vi.spyOn(logger, 'info').mockImplementation(() => {}),
			warn: vi.spyOn(logger, 'warn').mockImplementation(() => {}),
		});

		it('does not throw on an invalid teamName, drops it and warns with the raw value', () => {
			const { warn } = spyOnLogger();

			const params = parseAndValidateParams({ teamName: 'MittTeam' }, {}, 'ssr');

			expect(params.teamName).toBeUndefined();
			expect(warn).toHaveBeenCalledWith(
				expect.stringContaining('Ugyldig teamName'),
				expect.objectContaining({ metaData: expect.objectContaining({ teamName: 'MittTeam' }) })
			);
		});

		it('falls back to origin when teamName is invalid', () => {
			const { info } = spyOnLogger();

			parseAndValidateParams({ teamName: 'MittTeam' }, { origin: 'https://www.nav.no' }, 'csr');

			expect(info).toHaveBeenCalledWith(
				'Decorator consumer info.',
				expect.objectContaining({
					metaData: expect.objectContaining({ consumer: 'origin: https://www.nav.no' }),
				})
			);
		});

		it('warns when no consumer can be identified on an entry request without moduler', () => {
			const { warn } = spyOnLogger();

			parseAndValidateParams({}, {}, 'ssr');

			expect(warn).toHaveBeenCalledWith(expect.stringContaining('SSR-forespørselen'));
		});

		it('does not warn about a missing consumer when moduler is used, since moduler warns in the app', () => {
			const { warn } = spyOnLogger();

			parseAndValidateParams({ decoratorModulerVersion: '4.1.1', decoratorModulerEntryPoint: 'ssr' }, {}, 'ssr');

			expect(warn).not.toHaveBeenCalled();
		});

		it('does not log consumer info on follow-up requests without requestType', () => {
			const { info, warn } = spyOnLogger();

			parseAndValidateParams({ teamName: 'MittTeam' });
			parseAndValidateParams({});

			expect(info).not.toHaveBeenCalled();
			expect(warn).not.toHaveBeenCalled();
		});
	});
});
