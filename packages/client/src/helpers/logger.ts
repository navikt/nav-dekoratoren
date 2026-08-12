import type { Logger } from "decorator-shared/logger-contract";

export const logger: Logger = {
    info: (msg, ctx) => console.log(`[INFO] ${msg}`, ctx || ""),
    error: (msg, ctx) => console.error(`[ERROR] ${msg}`, ctx || ""),
    warn: (msg, ctx) => console.warn(`[WARN] ${msg}`, ctx || ""),
    debug: (msg, ctx) => console.debug(`[DEBUG] ${msg}`, ctx || ""),
};
