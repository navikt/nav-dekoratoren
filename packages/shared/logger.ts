// Shared logger that works in both browser and Node.js environments

interface LogContext {
    error?: any;
    metaData?: any;
}

type LogLevel = "info" | "error" | "warn" | "debug";

const formatLog = (level: LogLevel, message: string, context?: LogContext) => {
    const error =
        typeof context?.error === "string"
            ? context.error
            : JSON.stringify(context?.error);

    const metaData =
        typeof context?.metaData === "string"
            ? context?.metaData
            : JSON.stringify(context?.metaData);

    const logEntry = {
        level,
        message,
        error,
        metaData,
    };
    return logEntry;
};

// Detect if we're running in a browser (client-side) vs Node.js (server-side)
const isBrowser = "window" in globalThis;

export const logger = {
    info: (message: string, context?: LogContext) => {
        const logEntry = formatLog("info", message, context);
        // In browser: human-readable format for console
        // In server: structured JSON for OpenSearch parsing
        if (isBrowser) {
            console.log(`[INFO] ${message}`, context || "");
        } else {
            console.log(JSON.stringify(logEntry));
        }
    },
    error: (message: string, context?: LogContext) => {
        const logEntry = formatLog("error", message, context);
        if (isBrowser) {
            console.error(`[ERROR] ${message}`, context || "");
        } else {
            console.error(JSON.stringify(logEntry));
        }
    },
    warn: (message: string, context?: LogContext) => {
        const logEntry = formatLog("warn", message, context);
        if (isBrowser) {
            console.warn(`[WARN] ${message}`, context || "");
        } else {
            console.warn(JSON.stringify(logEntry));
        }
    },
    debug: (message: string, context?: LogContext) => {
        const logEntry = formatLog("debug", message, context);
        if (isBrowser) {
            console.debug(`[DEBUG] ${message}`, context || "");
        } else {
            console.log(JSON.stringify(logEntry));
        }
    },
};
