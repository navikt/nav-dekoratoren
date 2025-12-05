import { redactFromUrl } from "./redactUrl";

const UUID_REGEX =
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const LOCAL_PATH_REGEX = /\/users\//i;
const EXEMPT_KEYS = new Set(["website"]);
const URL_KEYS = new Set(["url", "referrer", "destinasjon"]);

const redactString = (value: string, key?: string): string => {
    let result =
        key && URL_KEYS.has(key) ? redactFromUrl(value).redactedUrl : value;

    // Redact URLs containing local file paths (e.g., /users/ or /Users/)
    if (key && URL_KEYS.has(key) && LOCAL_PATH_REGEX.test(result)) {
        result = "[redacted: local path]";
    }

    return result.replaceAll(UUID_REGEX, "[redacted: uuid]");
};

const redactObject = (
    value: Record<string, any>,
    parentUrl?: string,
): Record<string, any> => {
    const entries = Object.entries(value).map(([k, val]) => {
        if (EXEMPT_KEYS.has(k)) {
            return [k, val];
        }
        return [k, redactValue(val, k, parentUrl)];
    });

    const result = Object.fromEntries(entries);

    // Determine if title should be redacted based on url in this object
    const url = typeof result.url === "string" ? result.url : parentUrl;
    const { shouldRedactTitle } = url
        ? redactFromUrl(url)
        : { shouldRedactTitle: false };

    if (shouldRedactTitle) {
        if ("title" in result) {
            result.title = "[redacted]";
        }
        if (result.data?.sidetittel) {
            result.data.sidetittel = "[redacted]";
        }
    }

    return result;
};

const redactValue = (value: any, key?: string, parentUrl?: string): any => {
    if (value === null || value === undefined) {
        return value;
    }

    if (typeof value === "string") {
        return redactString(value, key);
    }

    if (Array.isArray(value)) {
        return value.map((item) => redactValue(item, undefined, parentUrl));
    }

    if (typeof value === "object") {
        return redactObject(value, parentUrl);
    }

    return value;
};

export const redactData = (data: any, key?: string): any => {
    return redactValue(data, key);
};
