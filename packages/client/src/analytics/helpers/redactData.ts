import { redactFromUrl } from "./redactUrl";

const UUID_REGEX =
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const EXEMPT_KEYS = ["website"];
const URL_KEYS = ["url", "referrer", "destinasjon"];

export const redactData = (value: any, key?: string): any => {
    if (value === null || value === undefined) {
        return value;
    }

    if (typeof value === "string") {
        // First apply URL redaction if this is a URL-related key
        const redactResult =
            key && URL_KEYS.includes(key)
                ? redactFromUrl(value).redactedUrl
                : value;
        // Then redact any UUIDs
        return redactResult.replaceAll(UUID_REGEX, "[redacted: uuid]");
    }

    if (Array.isArray(value)) {
        return value.map((item) => redactData(item));
    }

    if (typeof value === "object") {
        const entries = Object.entries(value).map(([k, val]) => {
            if (EXEMPT_KEYS.includes(k)) {
                return [k, val];
            }
            return [k, redactData(val, k)];
        });

        const result = Object.fromEntries(entries);

        // If object has both url and title, check if title should be redacted
        if (
            "url" in result &&
            "title" in result &&
            typeof result.url === "string"
        ) {
            const { shouldRedactTitle } = redactFromUrl(result.url);
            if (shouldRedactTitle) {
                result.title = "[redacted]";
            }
        }

        return result;
    }

    return value;
};
