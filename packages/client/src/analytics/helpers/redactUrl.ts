const createSegmentsArray = (path: string): string[] => {
    const trimmed = path.replace(/^\/+|\/+$/g, "");
    return trimmed === "" ? [] : trimmed.split("/");
};

const knownRedactPaths = [
    "/testsider/minoversikt/:redact:/liste",
    "/syk/sykefravaer/sykmeldinger/:redact:",
    "/syk/sykepenger/vedtak/:redact:",
    "/syk/sykepenger/vedtak/arkivering/:redact:",
    "/syk/sykefravaer/sykmeldinger/:redact:",
    "/syk/sykefravaer/inntektsmeldinger/:redact:",
    "/syk/sykepengesoknad/avbrutt/:redact:",
    "/syk/sykepengesoknad/kvittering/:redact:",
    "/syk/sykepengesoknad/sendt/:redact:",
    "/syk/sykepengesoknad/soknader/:redact:",
];

export const redactFromUrl = (url: string): string => {
    // Guard for SSR / non-browser
    if (typeof window === "undefined") {
        return url;
    }

    const appRedactPaths: string[] =
        (window as any)?.__DECORATOR_DATA__?.params?.redactPaths || [];

    const redactPaths = [...knownRedactPaths, ...appRedactPaths];

    // Detect whether the input is an absolute URL (protocol present)
    const isAbsoluteUrl = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(url);

    // Using URL API to parse the URL because it handles oddities like
    // double slashes, query strings, hashes, out of the box.
    let urlObj: URL;
    try {
        urlObj = isAbsoluteUrl
            ? new URL(url)
            : new URL(url, window.location.origin);
    } catch {
        // If parsing fails, just bail out and return the original
        return url;
    }

    const originalPathToRedact = urlObj.pathname;

    const trimmedPath = originalPathToRedact.replace(/^\/+|\/+$/g, "");
    const pathSegmentsToRedact = createSegmentsArray(trimmedPath);

    // Collect indices that should be redacted across all matching patterns
    const redactIndices = new Set<number>();

    for (const rawRedactPattern of redactPaths) {
        if (!rawRedactPattern) continue;

        const redactPattern = rawRedactPattern.replace(/^\/+|\/+$/g, "");
        const patternSegments = createSegmentsArray(redactPattern);

        // Segments in redact pattern and the path to redact must match in length
        if (patternSegments.length !== pathSegmentsToRedact.length) {
            continue;
        }

        // Be optimistic!
        let matches = true;

        // Track the indices where :redact: appears in the current pattern
        // ie. person/:redact:/sak/:redact: -> [1, 3]
        const currentPatternRedactIndices: number[] = [];

        for (let i = 0; i < patternSegments.length; i++) {
            const singlePatternSegment = patternSegments[i];
            const singlePathSegment = pathSegmentsToRedact[i];

            if (singlePatternSegment === ":redact:") {
                currentPatternRedactIndices.push(i);
                continue;
            }

            // Literal case-insensitive comparison (we've already checked for :redact:).
            // E.g. the pattern "person" should match URL segment "Person" or "PERSON",
            // regardless of case. So we use toLowerCase() on both sides.
            // If they still don't match, this specific pattern cannot match the path,
            // so we break out and continue to the next pattern.
            if (
                singlePatternSegment.toLowerCase() !==
                singlePathSegment.toLowerCase()
            ) {
                matches = false;
                break;
            }
        }

        if (matches) {
            for (const idx of currentPatternRedactIndices) {
                redactIndices.add(idx);
            }
        }
    }

    // If nothing to redact, return original URL unchanged
    if (redactIndices.size === 0) {
        return url;
    }

    // Build redacted segments
    const redactedSegments = pathSegmentsToRedact.map((seg, idx) =>
        redactIndices.has(idx) ? "[redacted]" : seg,
    );

    // Original path has traling slash. We want to not change anything but redact segments.
    const hasTrailingSlash =
        originalPathToRedact.length > 1 && originalPathToRedact.endsWith("/");

    // Reconstruct the path, preserving leading slash and original trailing slash
    let redactedPath: string;
    if (redactedSegments.length === 0) {
        redactedPath = "/";
    } else {
        redactedPath = `/${redactedSegments.join("/")}`;
        if (hasTrailingSlash && !redactedPath.endsWith("/")) {
            redactedPath += "/";
        }
    }

    urlObj.pathname = redactedPath;

    // Preserve query string and hash exactly as parsed
    const result = isAbsoluteUrl
        ? urlObj.toString()
        : `${urlObj.pathname}${urlObj.search}${urlObj.hash}`;

    return result;
};
