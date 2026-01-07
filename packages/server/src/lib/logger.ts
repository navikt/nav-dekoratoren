import pino from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";

export const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    formatters: {
        level: (label) => {
            return { level: label };
        },
    },
    ...(isDevelopment
        ? {
              transport: {
                  target: "pino-pretty",
                  options: {
                      colorize: true,
                      ignore: "pid,hostname",
                      translateTime: "HH:MM:ss",
                  },
              },
          }
        : {}),
});
