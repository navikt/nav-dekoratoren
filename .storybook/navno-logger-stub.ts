// Storybook runs in the browser; the real @navikt/navno-logger is Node-only (pino, node:url).
const noop = () => {};
export const logger = { info: noop, warn: noop, error: noop, debug: noop };
export type Logger = typeof logger;
