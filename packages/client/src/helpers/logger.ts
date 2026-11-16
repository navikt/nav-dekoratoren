import type { Logger } from 'decorator-shared/logger-contract';

const serializeContext = (context: unknown) => {
	const seen = new WeakSet<object>();
	return JSON.stringify(context, (_key, value: unknown) => {
		if (typeof value === 'bigint') return value.toString();
		if (typeof value === 'object' && value !== null) {
			if (seen.has(value)) return '[Circular]';
			seen.add(value);
		}
		if (value instanceof Error) {
			return { name: value.name, message: value.message, stack: value.stack };
		}
		return value;
	});
};

export const logger: Logger = {
	info: (msg, ctx) => console.log(`[INFO] ${msg}`, serializeContext(ctx) ?? ''),
	error: (msg, ctx) => console.error(`[ERROR] ${msg}`, serializeContext(ctx) ?? ''),
	warn: (msg, ctx) => console.warn(`[WARN] ${msg}`, serializeContext(ctx) ?? ''),
	debug: (msg, ctx) => console.debug(`[DEBUG] ${msg}`, serializeContext(ctx) ?? ''),
};
