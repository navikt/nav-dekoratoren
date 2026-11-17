import { addFaroMetaData } from './faro';

describe('addFaroMetaData', () => {
	beforeEach(() => {
		window.__DECORATOR_DATA__ = {
			env: { APP_URL: 'https://www.nav.no/dekoratoren' },
			params: { context: 'privatperson' },
		} as any;
	});

	afterEach(() => {
		delete window.faro;
	});

	it('adds env and params to the Faro session', () => {
		const setSession = vi.fn();
		window.faro = { api: { setSession } };

		addFaroMetaData();

		expect(setSession).toHaveBeenCalledWith({
			attributes: {
				decorator_env: '{"APP_URL":"https://www.nav.no/dekoratoren"}',
				decorator_params: '{"context":"privatperson"}',
			},
		});
	});

	it('does not throw when Faro has no setSession', () => {
		window.faro = { api: {} };
		expect(() => addFaroMetaData()).not.toThrow();

		window.faro = {};
		expect(() => addFaroMetaData()).not.toThrow();
	});
});
