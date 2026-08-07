// Server-only logger. Same call contract as decorator-shared/logger-contract,
// minus the browser branch — not needed on the server. Structured JSON
// output for OpenSearch parsing.

import type { Logger } from "decorator-shared/logger-contract";

type LogLevel = "info" | "error" | "warn" | "debug";

const formatLog = (level: LogLevel, msg: string, ctx?: any) => ({
    level,
    message: msg,
    error:
        typeof ctx?.error === "string" ? ctx.error : JSON.stringify(ctx?.error),
    metaData:
        typeof ctx?.metaData === "string"
            ? ctx.metaData
            : JSON.stringify(ctx?.metaData),
});

export const logger: Logger = {
    info: (msg, ctx) =>
        console.log(JSON.stringify(formatLog("info", msg, ctx))),
    error: (msg, ctx) =>
        console.error(JSON.stringify(formatLog("error", msg, ctx))),
    warn: (msg, ctx) =>
        console.warn(JSON.stringify(formatLog("warn", msg, ctx))),
    debug: (msg, ctx) =>
        console.log(JSON.stringify(formatLog("debug", msg, ctx))),
};
