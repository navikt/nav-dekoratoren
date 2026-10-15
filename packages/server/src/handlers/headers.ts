import { MiddlewareHandler } from 'hono';
import { csp } from '../content-security-policy';

const ALLOWED_DOMAINS = [
	'.nav.no',
	'.oera.no',
	'.nais.io',
	'preview-sykdomifamilien.gtsb.io',
	'navdialog--sit2.sandbox.my.site.com',
	'navdialog--uathot.sandbox.my.site.com',
] as const;

const isAllowedOrigin = (origin?: string) =>
	origin && (ALLOWED_DOMAINS.some((domain) => origin.endsWith(domain)) || origin.includes('/localhost:'));

export const headers: MiddlewareHandler = async (c, next) => {
	const origin = c.req.header('origin');
	const allowedOrigin = isAllowedOrigin(origin);
	const isPreflight = c.req.method === 'OPTIONS' && !!c.req.header('Access-Control-Request-Method');

	if (allowedOrigin && isPreflight) {
		c.res = c.body(null, 204);
	} else {
		await next();
	}

	c.res.headers.delete('Date');
	c.header('Vary', 'Origin', { append: true });

	if (allowedOrigin) {
		c.header('Access-Control-Allow-Origin', origin);
		c.header('Access-Control-Allow-Credentials', 'true');

		// Browsers only read these on the preflight response.
		if (isPreflight) {
			c.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');

			// Consumers' own fetch instrumentation (tracing, correlation ids) adds headers we can't list up front.
			// Allowed origins can already send credentials, so allow whatever headers they ask for.
			const requestedHeaders = c.req.header('Access-Control-Request-Headers');
			if (requestedHeaders) {
				c.header('Access-Control-Allow-Headers', requestedHeaders);
			}
			c.header('Vary', 'Access-Control-Request-Headers', { append: true });

			// Without this, Chrome caches a preflight for only 5 seconds. 2 hours is its maximum.
			c.header('Access-Control-Max-Age', '7200');
		}
	}

	c.header('Content-Security-Policy', csp);
	c.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	c.header('Pragma', 'no-cache');
	c.header('Expires', '-1');
};
