import { corgi, type Plugin, type Query } from '@itsy/corgi/chonk';
import { type ClientParams } from 'decorator-shared/params';
import { CONSUMER, VERSION_ID_PARAM } from 'decorator-shared/constants';
import { env } from '../params';

// Request metadata (cache-busting version id + consumer tag) as a plugin.
// baseURL is applied before the plugin chain runs, so `url` is already absolute.
const withDecoratorMeta = (): Plugin => (next) => (url, init) => {
	const u = new URL(url);
	u.searchParams.set(VERSION_ID_PARAM, env('VERSION_ID'));
	u.searchParams.set('consumer', CONSUMER);
	return next(u.toString(), init);
};

/**
 * `env()` is read EAGERLY here, at module scope: corgi's `create` destructures
 * its options immediately, so `window.__DECORATOR_DATA__` has to exist by the
 * time this module is evaluated. In the browser it does - the inline
 * `d-data-parser` classic script in packages/server/src/views/scripts.ts runs at
 * parse time, ahead of every deferred/async module script. In tests, test-setup.ts
 * seeds it at module scope for the same reason.
 */
export const decoratorApi = corgi.create({
	baseURL: env('APP_URL'),
	plugins: [withDecoratorMeta()],
	retry: 2,
});

type DecoratorFetchOverrides = Partial<ClientParams> & Record<string, unknown>;

/**
 * Current decorator client params, merged with per-call overrides.
 * Array fields are JSON-stringified — the server (packages/server/src/validateParams.ts)
 * expects a string and not Corgi's default of repeated-keys - applies to namely
 * `breadcrumbs`/`availableLanguages`/`analyticsQueryParams`/`analyticsRedactFilter`,
 */
export const decoratorParams = (overrides?: DecoratorFetchOverrides): Query => {
	const merged: Record<string, unknown> = {
		...window.__DECORATOR_DATA__.params,
		...overrides,
	};
	return Object.fromEntries(
		Object.entries(merged).map(([key, value]) => [key, Array.isArray(value) ? JSON.stringify(value) : value])
	) as Query;
};
