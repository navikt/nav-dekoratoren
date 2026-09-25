import { HonoRequest } from 'hono';
import { env } from '../env/server';
import { logger } from '../lib/logger';

const SERVER_VERSION_ID = env.VERSION_ID;

const LOG_INTERVAL_MS = 10 * 60 * 1000;
const WARN_AFTER_MS = 10 * 60 * 1000;
const MAX_TRACKED_KEYS = 500;

const PROBLEM_RESULTS = ['error_response', 'not_found', 'unreachable'] as const;
type ProblemResult = (typeof PROBLEM_RESULTS)[number];

type ProxyRequestMetadata = {
	path: string;
	origin?: string;
	pageType?: string;
	decoratorModulerVersion?: string;
	decoratorModulerEntryPoint?: string;
};

const getBoundedQueryValue = (url: URL, key: string) => url.searchParams.get(key)?.trim().slice(0, 100) || undefined;

const getProxyRequestMetadata = (request: HonoRequest): ProxyRequestMetadata => {
	const url = new URL(request.url);
	const origin = getBoundedQueryValue(url, 'origin');

	return {
		path: url.pathname.slice(0, 100),
		origin: origin && /^[a-z0-9][a-z0-9._-]*$/i.test(origin) ? origin : undefined,
		pageType: getBoundedQueryValue(url, 'pageType'),
		decoratorModulerVersion: getBoundedQueryValue(url, 'decoratorModulerVersion'),
		decoratorModulerEntryPoint: getBoundedQueryValue(url, 'decoratorModulerEntryPoint'),
	};
};

type ProblemLogState = {
	firstSeenAt?: number;
	lastSeenAt: number;
	lastLoggedAt?: number;
	warned: boolean;
};

const problemLogStates = new Map<string, ProblemLogState>();

// Without an origin, moduler version and entry point are used to tell requesters apart
const getProblemLogKey = (result: ProblemResult, requestedVersion: string, requestMetadata: ProxyRequestMetadata) => {
	const { origin, decoratorModulerVersion, decoratorModulerEntryPoint } = requestMetadata;
	const requesterKey = origin ? [origin] : [null, decoratorModulerVersion, decoratorModulerEntryPoint];
	return JSON.stringify([result, requestedVersion, ...requesterKey]);
};

// Keeps lastLoggedAt, so problems alternating with successes can't bypass the rate limit
export const resetProblemPersistence = (requestedVersion: string, request: HonoRequest) => {
	const requestMetadata = getProxyRequestMetadata(request);
	const recoveredResults: ProblemResult[] = [];
	PROBLEM_RESULTS.forEach((result) => {
		const state = problemLogStates.get(getProblemLogKey(result, requestedVersion, requestMetadata));
		if (state) {
			if (state.warned && result !== 'not_found') {
				recoveredResults.push(result);
			}
			state.firstSeenAt = undefined;
			state.warned = false;
		}
	});

	if (recoveredResults.length > 0) {
		logger.info(
			`Version proxy: proxying succeeded after persistent ${recoveredResults.join(', ')} - requested version ${requestedVersion} (origin: ${requestMetadata.origin ?? 'unknown'})`,
			{
				metaData: {
					result: 'recovered',
					previousResults: recoveredResults,
					requestedVersion,
					...requestMetadata,
				},
			}
		);
	}
};

const setProblemLogState = (key: string, state: ProblemLogState) => {
	problemLogStates.delete(key);
	if (problemLogStates.size >= MAX_TRACKED_KEYS) {
		const oldestKey = problemLogStates.keys().next().value;
		if (oldestKey !== undefined) {
			problemLogStates.delete(oldestKey);
		}
	}
	problemLogStates.set(key, state);
};

const describeResult = (result: ProblemResult, errorCode?: string, status?: number) => {
	switch (result) {
		case 'error_response':
			return `internal app responded with status ${status}`;
		case 'not_found':
			return 'no internal app exists for this version';
		default:
			return `internal app could not be reached (${errorCode ?? 'unknown error'})`;
	}
};

// Rate limited per pod, so log volume says nothing about request volume (use the metric).
// Info at first, warn once it has persisted for WARN_AFTER_MS without a longer gap or a success.
export const logProxyProblem = (
	result: ProblemResult,
	requestedVersion: string,
	request: HonoRequest,
	details: { errorCode?: string; status?: number; error?: string } = {}
) => {
	const { error, ...detailsMetaData } = details;
	const requestMetadata = getProxyRequestMetadata(request);
	const key = getProblemLogKey(result, requestedVersion, requestMetadata);
	const now = Date.now();
	const previous = problemLogStates.get(key);

	const previousFirstSeenAt = previous?.firstSeenAt;
	const continued =
		previous !== undefined && previousFirstSeenAt !== undefined && now - previous.lastSeenAt <= LOG_INTERVAL_MS;
	const firstSeenAt = continued ? previousFirstSeenAt : now;
	const shouldLog = previous?.lastLoggedAt === undefined || now - previous.lastLoggedAt >= LOG_INTERVAL_MS;
	const isPersistent = now - firstSeenAt >= WARN_AFTER_MS;

	setProblemLogState(key, {
		firstSeenAt,
		lastSeenAt: now,
		lastLoggedAt: shouldLog ? now : previous?.lastLoggedAt,
		warned: (continued && (previous?.warned ?? false)) || (shouldLog && isPersistent),
	});

	if (!shouldLog) {
		return;
	}

	const outcome =
		result === 'error_response'
			? 'passed the error response on'
			: `served this pod's own version ${SERVER_VERSION_ID} instead, which may not match the requester's cached assets`;
	const persistence = isPersistent
		? ` - still occurring after ${Math.floor((now - firstSeenAt) / 60000)} minutes on this pod`
		: '';
	const message = `Version proxy: ${describeResult(result, details.errorCode, details.status)} - requested version ${requestedVersion}, ${outcome} (origin: ${requestMetadata.origin ?? 'unknown'})${persistence}`;

	const log = isPersistent ? logger.warn : logger.info;
	log(message, {
		error,
		metaData: {
			result,
			requestedVersion,
			servingVersion: SERVER_VERSION_ID,
			persistent: isPersistent,
			...detailsMetaData,
			...requestMetadata,
		},
	});
};
