import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { httpError, networkError } from '@itsy/corgi/testing';
import { PAGE_LEAVE_GRACE_MS, formatContext, logger } from './logger';

describe('formatContext', () => {
	it('writes an error as name and message, also inside an object', () => {
		expect(formatContext({ error: new TypeError('Load failed') })).toBe('{"error":"TypeError: Load failed"}');
		expect(formatContext(new RangeError('Out of range'))).toBe('RangeError: Out of range');
	});

	it('writes DOMExceptions, such as aborted and timed out requests, the same way', () => {
		expect(formatContext({ error: new DOMException('Fetch is aborted', 'AbortError') })).toBe(
			'{"error":"AbortError: Fetch is aborted"}'
		);
	});

	it('writes HTTP errors with their status and URL', () => {
		const error = httpError(503, undefined, { url: 'https://www.nav.no/dekoratoren/auth' });

		expect(formatContext({ error })).toBe(
			'{"error":"HttpError: HTTP 503 Service Unavailable (https://www.nav.no/dekoratoren/auth)"}'
		);
	});

	it('writes a Response with its status', () => {
		const response = new Response(null, { status: 502, statusText: 'Bad Gateway' });

		expect(formatContext({ error: response, url: '/main-menu' })).toBe(
			'{"error":"HTTP 502 Bad Gateway ()","url":"/main-menu"}'
		);
	});

	it('survives circular objects', () => {
		const context: Record<string, unknown> = { name: 'loop' };
		context.self = context;

		expect(formatContext(context)).toBe('{"name":"loop","self":"[Circular]"}');
	});

	it('caps the length', () => {
		const text = formatContext({ text: 'x'.repeat(5000) });

		expect(text).toHaveLength(1001);
		expect(text.endsWith('…')).toBe(true);
	});
});

describe('logger', () => {
	let consoleError: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		vi.useFakeTimers();
		consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('logs one string, with the context written into it', () => {
		logger.error('Failed to fetch footer', { error: new SyntaxError('Unexpected token <') });

		expect(consoleError).toHaveBeenCalledWith(
			'[ERROR] Failed to fetch footer {"error":"SyntaxError: Unexpected token <"}'
		);
	});

	it('logs just the message without a context', () => {
		logger.error('Boost init function not found!');

		expect(consoleError).toHaveBeenCalledWith('[ERROR] Boost init function not found!');
	});

	it.each([
		['Safari', new TypeError('Load failed')],
		['Chrome', networkError('Failed to fetch')],
		['Firefox', new TypeError('NetworkError when attempting to fetch resource.')],
		['an aborted request', new DOMException('Fetch is aborted', 'AbortError')],
	])('waits before logging a failed fetch (%s), in case the page is being left', (_, error) => {
		logger.error('Failed to fetch auth data.', { error });

		expect(consoleError).not.toHaveBeenCalled();

		vi.advanceTimersByTime(PAGE_LEAVE_GRACE_MS);

		expect(consoleError).toHaveBeenCalledWith(
			`[ERROR] Failed to fetch auth data. {"error":"${error.name}: ${error.message}"}`
		);
	});

	it.each([
		['an HTTP error', httpError(503)],
		['a timeout', new DOMException('Request timed out after 60000ms', 'TimeoutError')],
		['an invalid URL', new TypeError('Invalid URL')],
	])('logs %s straight away', (_, error) => {
		logger.error('Failed', { error });

		expect(consoleError).toHaveBeenCalledOnce();
	});
});
