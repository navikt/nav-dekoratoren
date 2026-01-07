// Shared logger that works in both browser and Node.js environments

interface LogContext {
    [key: string]: any;
}

type LogLevel = "info" | "error" | "warn" | "debug";

const formatLog = (level: LogLevel, message: string, context?: LogContext) => {
    const logEntry = {
        level,
        message,
        timestamp: new Date().toISOString(),
        ...context,
    };
    return logEntry;
};

// Detect if we're running in a browser (client-side) vs Node.js (server-side)
const isBrowser = typeof window !== "undefined";

// Check if we're in development mode
const isDevelopment =
    (typeof process !== "undefined" &&
        (process as any).env?.NODE_ENV !== "production") ||
    (isBrowser && window.location?.hostname === "localhost");

export const logger = {
    info: (message: string, context?: LogContext) => {
        const logEntry = formatLog("info", message, context);
        // In browser, always use human-readable format
        // In server, use JSON in production, human-readable in development
        if (isBrowser || isDevelopment) {
            console.log(`[INFO] ${message}`, context || "");
        } else {
            console.log(JSON.stringify(logEntry));
        }
    },
    error: (message: string, context?: LogContext) => {
        const logEntry = formatLog("error", message, context);
        if (isBrowser || isDevelopment) {
            console.error(`[ERROR] ${message}`, context || "");
        } else {
            console.error(JSON.stringify(logEntry));
        }
    },
    warn: (message: string, context?: LogContext) => {
        const logEntry = formatLog("warn", message, context);
        if (isBrowser || isDevelopment) {
            console.warn(`[WARN] ${message}`, context || "");
        } else {
            console.warn(JSON.stringify(logEntry));
        }
    },
    debug: (message: string, context?: LogContext) => {
        const logEntry = formatLog("debug", message, context);
        if (isBrowser || isDevelopment) {
            console.debug(`[DEBUG] ${message}`, context || "");
        } else {
            console.log(JSON.stringify(logEntry));
        }
    },
};
