import { env } from "../params";
import { logger } from "./logger";

export const cdnUrl = (url: string) =>
    import.meta.env.DEV ? url : `${env("CDN_URL")}${url}`;

export const parseUrl = (url: string) => {
    try {
        return new URL(url);
    } catch (error) {
        logger.error(`Error parsing url ${url}`, { error });
        return null;
    }
};
