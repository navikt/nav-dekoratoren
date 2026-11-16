import type { Logger } from 'decorator-shared/logger-contract';

const MAX_CONTEXT_LENGTH = 1000;

/**
 * How long a fetch failure that may come from the page being left waits before it's logged.
 *
 * When a page is left (a navigation, a reload, a prerendered page being thrown away), browsers
 * cancel its in-flight fetches and reject them with the same TypeError or AbortError a real
 * network failure gives ("Load failed", "Failed to fetch"), and the consuming app's Faro still
 * reports the console.error. If the page is gone within this time the timer never runs, so only
 * failures on a page that's still open get logged.
 */
export const PAGE_LEAVE_GRACE_MS = 1000;

// The messages browsers give a rejected fetch: Chrome, Safari and Firefox
const FETCH_FAILURE_MESSAGE = /failed to fetch|load failed|networkerror/i;

type ErrorLike = { name: string; message: string };

const isErrorLike = (value: unknown): value is ErrorLike =>
	value instanceof Error || (typeof DOMException !== 'undefined' && value instanceof DOMException);

const isResponse = (value: unknown): value is Response => typeof Response !== 'undefined' && value instanceof Response;

const describeError = ({ name, message }: ErrorLike) => `${name}: ${message}`;

const describeResponse = ({ status, statusText, url }: Response) => `HTTP ${status} ${statusText} (${url})`;

const truncate = (text: string) => (text.length > MAX_CONTEXT_LENGTH ? `${text.slice(0, MAX_CONTEXT_LENGTH)}…` : text);

/**
 * The context as text, to go in the log line itself.
 *
 * Apps on Faro's default console instrumentation turn every console argument into text with
 * String(), so an object arrives as "[object Object]". JSON.stringify isn't enough either: an
 * Error's name and message aren't enumerable, so { error } becomes {"error":{}}.
 */
export const formatContext = (context: unknown): string => {
	if (typeof context === 'string') return truncate(context);
	if (isErrorLike(context)) return truncate(describeError(context));
	if (isResponse(context)) return truncate(describeResponse(context));
	if (typeof context !== 'object' || context === null) return truncate(String(context));

	const seen = new WeakSet<object>();
	try {
		const text = JSON.stringify(context, (_key, value: unknown) => {
			if (isErrorLike(value)) return describeError(value);
			if (isResponse(value)) return describeResponse(value);
			if (typeof value === 'object' && value !== null) {
				if (seen.has(value)) return '[Circular]';
				seen.add(value);
			}
			return value;
		});
		return truncate(text ?? String(context));
	} catch {
		return truncate(String(context));
	}
};

/**
 * Whether the context's error is what a fetch rejects with, both when the network fails and when
 * the page is being left. HTTP errors, timeouts and anything else are logged straight away.
 */
export const mayBeFromLeavingPage = (context: unknown) => {
	const error = typeof context === 'object' && context !== null ? (context as { error?: unknown }).error : undefined;
	if (!isErrorLike(error)) return false;
	return error.name === 'AbortError' || (error.name === 'TypeError' && FETCH_FAILURE_MESSAGE.test(error.message));
};

// One string argument, so the line reads the same whatever Faro setup the consuming app has
const line = (level: string, message: string, context: unknown) =>
	context === undefined || context === '' ? `[${level}] ${message}` : `[${level}] ${message} ${formatContext(context)}`;

export const logger: Logger = {
	info: (message, context) => console.log(line('INFO', message, context)),
	error: (message, context) => {
		const text = line('ERROR', message, context);
		if (mayBeFromLeavingPage(context)) {
			globalThis.setTimeout(() => console.error(text), PAGE_LEAVE_GRACE_MS);
		} else {
			console.error(text);
		}
	},
	warn: (message, context) => console.warn(line('WARN', message, context)),
	debug: (message, context) => console.debug(line('DEBUG', message, context)),
};
