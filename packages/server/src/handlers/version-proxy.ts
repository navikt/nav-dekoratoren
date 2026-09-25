import { HonoRequest, MiddlewareHandler } from 'hono';
import { Counter } from 'prom-client';
import { VERSION_ID_PARAM } from 'decorator-shared/constants';
import { getLogSafeUrl } from 'decorator-shared/urls';
import { env } from '../env/server';
import { INGRESS_PATH_PREFIXES } from '../ingress-path-prefixes';
import { logger } from '../lib/logger';
import { logProxyProblem, resetProblemPersistence } from './version-proxy-logging';

const SERVER_VERSION_ID = env.VERSION_ID;
const APP_NAME = env.APP_NAME;
const LOOPBACK_HEADER = 'is-dekoratoren-proxy-req';
const METRIC_ROUTES = [
	{ path: '/auth', label: 'auth' },
	{ path: '/header', label: 'header' },
	{ path: '/footer', label: 'footer' },
	{ path: '/ssr', label: 'ssr' },
	{ path: '/api/consentping', label: 'consentping' },
] as const;

const getMetricLabels = (request: HonoRequest) => {
	const url = new URL(request.url);
	const origin = url.searchParams.get('origin');
	const path = url.pathname.replace(/\/$/, '');
	const route =
		METRIC_ROUTES.find(({ path: routePath }) =>
			INGRESS_PATH_PREFIXES.some((prefix) => path === `${prefix === '/' ? '' : prefix}${routePath}`)
		)?.label ?? 'other';
	return {
		origin: origin === 'navno-frontend' ? 'navno-frontend' : origin ? 'other' : 'unknown',
		route,
	};
};

// Version id should be a commit hash (7 chars short or 40 chars full)
const validVersionIdPattern = new RegExp(/^([a-f0-9]{7}|[a-f0-9]{40})$/);

const isValidVersionId = (versionId?: string): versionId is string =>
	!!(versionId && validVersionIdPattern.test(versionId));

// - proxied: the internal app responded with a non-5xx
// - error_response: the internal app responded with a 5xx, which is passed on as-is
// - not_found: no internal app for the version (ENOTFOUND), expected once it has expired (ttlInternal)
// - unreachable: the internal app exists, but the request failed (ECONNREFUSED etc.)
const proxyRequestsCounter = new Counter({
	name: 'version_proxy_requests_total',
	help: "Requests for a different version than this pod's, by proxy result, origin and route",
	labelNames: ['result', 'origin', 'route'] as const,
});

type FetchOutcome =
	| { response: Response; errorCode?: never; error?: never }
	| { response: null; errorCode?: string; error: string };

const getErrorCode = (err: Error) =>
	(err as NodeJS.ErrnoException).code ??
	(err.cause instanceof Error ? (err.cause as NodeJS.ErrnoException).code : undefined);

const fetchFromInternalVersionApp = async (request: HonoRequest, targetVersionId: string): Promise<FetchOutcome> => {
	const urlObj = new URL(request.url);
	urlObj.protocol = 'http:';
	urlObj.host = `${APP_NAME}-${targetVersionId}`;

	const url = urlObj.toString();
	const logSafeUrl = getLogSafeUrl(url);

	try {
		const headers = new Headers(request.raw.headers);
		headers.set(LOOPBACK_HEADER, 'true');

		const body = request.raw.body ? request.raw.clone().body : null;
		const response = await fetch(url, {
			method: request.method,
			headers,
			body,
			...(body ? { duplex: 'half' as const } : {}),
		});

		// Clone response headers since they're immutable in Node 24
		const responseHeaders = new Headers(response.headers);
		responseHeaders.delete('content-encoding');

		return {
			response: new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers: responseHeaders,
			}),
		};
	} catch (e: unknown) {
		const err = e instanceof Error ? e : new Error(String(e));
		const error = JSON.stringify({
			message: err.message,
			name: err.name,
			code: (err as NodeJS.ErrnoException).code,
			cause:
				err.cause instanceof Error
					? {
							message: err.cause.message,
							code: (err.cause as NodeJS.ErrnoException).code,
						}
					: String(err.cause),
			stack: err.stack?.split('\n').slice(0, 3).join(' | '),
		}).replaceAll(url, logSafeUrl);

		return { response: null, errorCode: getErrorCode(err), error };
	}
};

export const versionProxyHandler: MiddlewareHandler = async (c, next) => {
	const reqVersionId = c.req.query(VERSION_ID_PARAM);

	// Prevent request loops. Shouldn't happen, but it does! :thinking:
	const isLoopback = c.req.header(LOOPBACK_HEADER);
	if (isLoopback) {
		logger.error(`Loopback for request to version id ${reqVersionId}!`);
	}

	if (reqVersionId === SERVER_VERSION_ID || isLoopback || !isValidVersionId(reqVersionId)) {
		return next();
	}

	const metricLabels = getMetricLabels(c.req);
	const { response, errorCode, error } = await fetchFromInternalVersionApp(c.req, reqVersionId);

	if (response) {
		if (response.status >= 500) {
			proxyRequestsCounter.inc({ result: 'error_response', ...metricLabels });
			logProxyProblem('error_response', reqVersionId, c.req, { status: response.status });
		} else {
			proxyRequestsCounter.inc({ result: 'proxied', ...metricLabels });
			resetProblemPersistence(reqVersionId, c.req);
		}
		return response;
	}

	const result = errorCode === 'ENOTFOUND' ? 'not_found' : 'unreachable';
	proxyRequestsCounter.inc({ result, ...metricLabels });
	logProxyProblem(result, reqVersionId, c.req, { errorCode, error });
	return next();
};
