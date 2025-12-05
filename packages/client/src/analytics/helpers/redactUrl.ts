import { knownRedactPaths } from "./knownRedactPaths";

export type RedactUrlResult = {
    originalUrl: string;
    redactedUrl: string;
    shouldRedactTitle: boolean;
};

type PatternMatchResult = {
    matches: boolean;
    segmentIndicesToRedact: number[];
};

const REDACT_PLACEHOLDER = ":redact:";
const REDACTED_OUTPUT = "[redacted]";

const splitPathIntoSegments = (path: string): string[] => {
    const trimmed = path.replace(/^\/+|\/+$/g, "");
    return trimmed === "" ? [] : trimmed.split("/");
};

// Sort patterns by segment count (most segments first) so more specific
// patterns are matched before shorter/more general ones.
// E.g. "/syk/sykepenger/vedtak/arkivering/:redact:" should be checked
// before "/syk/sykepenger/vedtak/:redact:" to avoid incorrect matches.
const getPatternsSortedBySpecificity = (): string[] => {
    return [...knownRedactPaths.keys()].sort(
        (a, b) =>
            splitPathIntoSegments(b).length - splitPathIntoSegments(a).length,
    );
};

// Pattern must be a prefix of the path (or exact match)
// E.g. "/foobar/mypage/:redact:" matches both "/foobar/mypage/123"
// and "/foobar/mypage/123/extra/segments"
const matchPatternToPath = (
    patternSegments: string[],
    urlPathSegments: string[],
): PatternMatchResult => {
    const segmentIndicesToRedact: number[] = [];

    if (patternSegments.length > urlPathSegments.length) {
        return { matches: false, segmentIndicesToRedact: [] };
    }

    for (let i = 0; i < patternSegments.length; i++) {
        const patternSegment = patternSegments[i];
        const urlSegment = urlPathSegments[i];

        if (patternSegment === REDACT_PLACEHOLDER) {
            segmentIndicesToRedact.push(i);
            continue;
        }

        // Case-insensitive comparison for literal segments
        if (patternSegment.toLowerCase() !== urlSegment.toLowerCase()) {
            return { matches: false, segmentIndicesToRedact: [] };
        }
    }

    return { matches: true, segmentIndicesToRedact };
};

const buildRedactedPath = (
    pathSegments: string[],
    indicesToRedact: Set<number>,
    hasTrailingSlash: boolean,
): string => {
    if (pathSegments.length === 0) {
        return "/";
    }

    const redactedSegments = pathSegments.map((segment, index) =>
        indicesToRedact.has(index) ? REDACTED_OUTPUT : segment,
    );

    let redactedPath = `/${redactedSegments.join("/")}`;

    if (hasTrailingSlash && !redactedPath.endsWith("/")) {
        redactedPath += "/";
    }

    return redactedPath;
};

// Sometimes we don't want to redact anything, so we return the original URL
const createSkippedRedactionResult = (
    url: string,
    shouldRedactTitle = false,
): RedactUrlResult => ({
    originalUrl: url,
    redactedUrl: url,
    shouldRedactTitle,
});

export const redactFromUrl = (url: string): RedactUrlResult => {
    // Guard for SSR / non-browser environments
    if (typeof window === "undefined") {
        return createSkippedRedactionResult(url);
    }

    const isAbsoluteUrl = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(url);

    let urlObj: URL;
    try {
        urlObj = isAbsoluteUrl
            ? new URL(url)
            : new URL(url, window.location.origin);
    } catch {
        return createSkippedRedactionResult(url);
    }

    const originalPathname = urlObj.pathname;
    const urlPathSegments = splitPathIntoSegments(originalPathname);
    const sortedPatterns = getPatternsSortedBySpecificity();

    const indicesToRedact = new Set<number>();
    let shouldRedactTitle = false;

    for (const patternPath of sortedPatterns) {
        if (!patternPath) continue;

        const patternSegments = splitPathIntoSegments(patternPath);
        const matchResult = matchPatternToPath(
            patternSegments,
            urlPathSegments,
        );

        if (matchResult.matches) {
            const config = knownRedactPaths.get(patternPath);

            if (config?.redactTitle) {
                shouldRedactTitle = true;
            }

            if (config?.redactPath) {
                for (const index of matchResult.segmentIndicesToRedact) {
                    indicesToRedact.add(index);
                }
            }
        }
    }

    if (indicesToRedact.size === 0) {
        return createSkippedRedactionResult(url, shouldRedactTitle);
    }

    const hasTrailingSlash =
        originalPathname.length > 1 && originalPathname.endsWith("/");

    urlObj.pathname = buildRedactedPath(
        urlPathSegments,
        indicesToRedact,
        hasTrailingSlash,
    );

    const redactedUrl = isAbsoluteUrl
        ? urlObj.toString()
        : `${urlObj.pathname}${urlObj.search}${urlObj.hash}`;

    return { originalUrl: url, redactedUrl, shouldRedactTitle };
};
