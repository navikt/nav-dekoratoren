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

// Check if we're in development mode in a way that works in both environments
const isDevelopment =
    (typeof process !== "undefined" &&
        (process as any).env?.NODE_ENV !== "production") ||
    (typeof window !== "undefined" &&
        window.location?.hostname === "localhost");

export const logger = {
    info: (message: string, context?: LogContext) => {
        const logEntry = formatLog("info", message, context);
        if (isDevelopment) {
            console.log(`[INFO] ${message}`, context || "");
        } else {
            console.log(JSON.stringify(logEntry));
        }
    },
    error: (message: string, context?: LogContext) => {
        const logEntry = formatLog("error", message, context);
        if (isDevelopment) {
            console.error(`[ERROR] ${message}`, context || "");
        } else {
            console.error(JSON.stringify(logEntry));
        }
    },
    warn: (message: string, context?: LogContext) => {
        const logEntry = formatLog("warn", message, context);
        if (isDevelopment) {
            console.warn(`[WARN] ${message}`, context || "");
        } else {
            console.warn(JSON.stringify(logEntry));
        }
    },
    debug: (message: string, context?: LogContext) => {
        const logEntry = formatLog("debug", message, context);
        if (isDevelopment) {
            console.debug(`[DEBUG] ${message}`, context || "");
        } else {
            console.log(JSON.stringify(logEntry));
        }
    },
};
