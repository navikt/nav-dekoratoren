import { HonoRequest, MiddlewareHandler } from 'hono';
import { VERSION_ID_PARAM } from 'decorator-shared/constants';
import { getLogSafeUrl } from 'decorator-shared/urls';
import { env } from '../env/server';
import { logger } from '../lib/logger';

const SERVER_VERSION_ID = env.VERSION_ID;
const APP_NAME = env.APP_NAME;
const LOOPBACK_HEADER = 'is-dekoratoren-proxy-req';

// Version id should be a commit hash (7 chars short or 40 chars full)
const validVersionIdPattern = new RegExp(/^([a-f0-9]{7}|[a-f0-9]{40})$/);

const isValidVersionId = (versionId?: string): versionId is string =>
	!!(versionId && validVersionIdPattern.test(versionId));

const STALE_VERSION_ERROR_THRESHOLD = 3;
const STALE_VERSION_ERROR_GRACE_PERIOD_MS = 5 * 60 * 1000;
const STALE_VERSION_ERROR_LOG_INTERVAL_MS = 60 * 1000;
const MAX_TRACKED_STALE_VERSIONS = 50;

type StaleVersionState = {
	failCount: number;
	firstFailedAt: number;
	lastErrorLoggedAt: number;
};

const staleVersionFailures = new Map<string, StaleVersionState>();

const recordStaleVersionFallback = (targetVersionId: string, ownVersionId: string) => {
	if (!staleVersionFailures.has(targetVersionId) && staleVersionFailures.size >= MAX_TRACKED_STALE_VERSIONS) {
		const oldestKey = staleVersionFailures.keys().next().value;
		if (oldestKey !== undefined) {
			staleVersionFailures.delete(oldestKey);
		}
	}

	const now = Date.now();
	const state = staleVersionFailures.get(targetVersionId) ?? {
		failCount: 0,
		firstFailedAt: now,
		lastErrorLoggedAt: 0,
	};
	state.failCount += 1;
	staleVersionFailures.set(targetVersionId, state);

	const message = `Falling back to this pod's own (version ${ownVersionId}) response for requested version ${targetVersionId} - content may not match the requester's cached assets (${state.failCount} consecutive failed proxy attempts for this version, first failure at ${new Date(state.firstFailedAt).toISOString()})`;

	if (
		state.failCount < STALE_VERSION_ERROR_THRESHOLD ||
		now - state.firstFailedAt < STALE_VERSION_ERROR_GRACE_PERIOD_MS
	) {
		logger.warn(message);
		return;
	}

	if (now - state.lastErrorLoggedAt >= STALE_VERSION_ERROR_LOG_INTERVAL_MS) {
		state.lastErrorLoggedAt = now;
		logger.error(message);
	}
};

const clearStaleVersionFailures = (targetVersionId: string) => {
	staleVersionFailures.delete(targetVersionId);
};

const fetchFromInternalVersionApp = async (request: HonoRequest, targetVersionId: string) => {
	const urlObj = new URL(request.url);
	urlObj.protocol = 'http:';
	urlObj.host = `${APP_NAME}-${targetVersionId}`;

	const url = urlObj.toString();
	const logSafeUrl = getLogSafeUrl(url);
	const referer = request.header('referer');
	const logSafeReferer = referer ? getLogSafeUrl(referer) : undefined;

	logger.info(`Proxy request to: ${logSafeUrl} - Referer: ${logSafeReferer}`);

	try {
		const headers = new Headers(request.raw.headers);
		headers.set(LOOPBACK_HEADER, 'true');

		const response = await fetch(url, {
			method: request.method,
			headers,
			body: request.raw.body,
		});

		// Clone response headers since they're immutable in Node 24
		const responseHeaders = new Headers(response.headers);
		responseHeaders.delete('content-encoding');

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders,
		});
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

		logger.warn(`Proxy request failed for ${logSafeUrl}`, { error });
		return null;
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

	const response = await fetchFromInternalVersionApp(c.req, reqVersionId);

	if (response) {
		clearStaleVersionFailures(reqVersionId);
	} else {
		recordStaleVersionFallback(reqVersionId, SERVER_VERSION_ID);
	}

	return response || next();
};
