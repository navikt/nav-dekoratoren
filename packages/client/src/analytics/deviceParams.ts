type NavigatorUAData = {
    mobile: boolean;
    platform: string;
    brands: { brand: string; version: string }[];
};

type NavigatorWithUAData = Navigator & {
    userAgentData?: NavigatorUAData;
};

type NavigatorWithConnection = Navigator & {
    connection?: { effectiveType?: string };
};

type Brand = {
    brand: string;
    version: string;
};

type BrowserInfo = {
    name: string;
    version: string;
};

const UNKNOWN = "unknown";

const browserNameDictionary: { name: string; keywords: string[] }[] = [
    { name: "Edge", keywords: ["Edg/", "EdgA/", "EdgiOS/", "Edge/"] },
    { name: "Opera", keywords: ["OPR/", "OPT/", "Opera/"] },
    { name: "Samsung Browser", keywords: ["SamsungBrowser/"] },
    { name: "Chrome", keywords: ["Chrome/", "CriOS/"] },
    { name: "Firefox", keywords: ["Firefox/", "FxiOS/"] },
];

// On iOS every app renders with the same WebKit engine, so in-app browsers are
// only identifiable via vendor tokens appended to the UA string. These UAs
// usually carry neither a `Version/` nor a `Safari/` token, which is why they
// used to fall through to "unknown".
//
// Matched before browserNameDictionary so that the Android variants (which do
// carry a `Chrome/` token) are labelled the same way as their iOS counterparts.
const inAppBrowserDictionary: {
    name: string;
    pattern: RegExp;
    version?: RegExp;
}[] = [
    {
        name: "Facebook",
        pattern: /FBAN\/|FBAV\/|FB_IAB/,
        version: /FBAV\/([\d.]+)/,
    },
    {
        name: "Instagram",
        pattern: /\bInstagram\b/,
        version: /\bInstagram[\s/]([\d.]+)/,
    },
    {
        name: "LinkedIn",
        pattern: /\[LinkedInApp\]/,
        version: /\[LinkedInApp\]\/([\d.]+)/,
    },
    {
        name: "Snapchat",
        pattern: /\bSnapchat\//,
        version: /\bSnapchat\/([\d.]+)/,
    },
    { name: "Google App", pattern: /\bGSA\//, version: /\bGSA\/([\d.]+)/ },
];

const SAFARI_VERSION_PATTERN = /Version\/(\d[\d.]*)/;
const ANDROID_WEBVIEW_PATTERN = /;\s?wv\)/;
const APPLE_DEVICE_PATTERN = /iPhone|iPad|iPod|Macintosh/;
const IOS_VERSION_PATTERN =
    /(?:iPhone|iPad|iPod|CPU)\s(?:iPhone\s)?OS\s([\d_]+)/;
const MAC_VERSION_PATTERN = /Mac OS X\s([\d_.]+)/;

// Version granularity differs by source: userAgentData.brands reports a bare
// major ("151") while UA parsing reports the full build ("151.0.7922.112"), so
// the same browser lands in two different buckets. Normalise to at most
// major.minor and drop a redundant ".0" — Chromium's minor is always 0, while
// Safari/Firefox/Samsung use the minor as their real release axis.
//
// This is deliberately lossy: it also lowers the fingerprinting surface
// compared to storing full build numbers.
export const normalizeVersion = (version: string): string => {
    const [major, minor] = version.split(".");

    if (!major || !/^\d+$/.test(major)) return UNKNOWN;
    if (!minor || !/^\d+$/.test(minor) || minor === "0") return major;

    return `${major}.${minor}`;
};

const getVersionFromLegacyUA = (userAgent: string, keyword: string): string => {
    const index = userAgent.indexOf(keyword);
    if (index === -1) return UNKNOWN;
    const versionStart = index + keyword.length;
    const match = /^[\d.]+/.exec(userAgent.substring(versionStart));
    return match?.[0] ?? UNKNOWN;
};

// A bare `Safari/` substring is not enough: WKWebView embeds often append
// `Safari/604.1` without a `Version/` token, and Snapchat reports
// "(like Safari/8620.2.4.10.7, panda)". Requiring a `Version/` token keeps
// those out of the Safari bucket.
const isSafariLegacyUA = (userAgent: string): boolean =>
    userAgent.includes("Safari/") &&
    SAFARI_VERSION_PATTERN.test(userAgent) &&
    !userAgent.includes("Chrome/") &&
    !userAgent.includes("CriOS/");

const hasKnownBrowserToken = (userAgent: string): boolean =>
    browserNameDictionary.some(({ keywords }) =>
        keywords.some((keyword) => userAgent.includes(keyword)),
    );

export const getInAppBrowser = (userAgent: string): BrowserInfo | null => {
    const inApp = inAppBrowserDictionary.find(({ pattern }) =>
        pattern.test(userAgent),
    );
    if (!inApp) return null;

    return {
        name: inApp.name,
        version: inApp.version?.exec(userAgent)?.[1] ?? UNKNOWN,
    };
};

// Android WebViews keep their `Chrome/` token and are reported as Chrome, since
// that version number is real and useful. This flag is what separates them from
// standalone Chrome. On Apple platforms the engine version is not exposed at
// all, so the flag is the only available signal.
export const isWebviewUA = (userAgent: string): boolean => {
    if (ANDROID_WEBVIEW_PATTERN.test(userAgent)) return true;
    if (getInAppBrowser(userAgent)) return true;

    return (
        APPLE_DEVICE_PATTERN.test(userAgent) &&
        userAgent.includes("AppleWebKit") &&
        !hasKnownBrowserToken(userAgent) &&
        !SAFARI_VERSION_PATTERN.test(userAgent)
    );
};

// Safari freezes the OS version in its UA string (macOS always reports 10.15.7,
// iOS/iPadOS 26+ reports 18.6). Since Safari's major version tracks the OS major
// version, we use the Version/ token as a proxy when it's higher than the frozen
// OS version. This means deviceOSVersion may reflect the Safari version rather
// than the literal OS version, but it's more useful for analytics than a
// permanently stale value.
export const getSafariVersionIfFrozenUA = (
    userAgent: string,
    parsedVersion: string,
): string => {
    if (!isSafariLegacyUA(userAgent)) return parsedVersion;

    const safariVersion = SAFARI_VERSION_PATTERN.exec(userAgent)?.[1];
    if (!safariVersion) return parsedVersion;

    const parsedMajor = parseInt(parsedVersion, 10);
    const safariMajor = parseInt(safariVersion, 10);

    return safariMajor > parsedMajor ? safariVersion : parsedVersion;
};

// iPadOS 13+ requests desktop sites by default, so an iPad's UA normally carries
// the `Macintosh; Intel Mac OS X 10_15_7` token instead of `iPad ... OS x_y`.
// Both patterns must be tried, otherwise every default-configured iPad reports
// an unknown OS version.
const getAppleOSVersion = (userAgent: string): string => {
    const raw =
        IOS_VERSION_PATTERN.exec(userAgent)?.[1] ??
        MAC_VERSION_PATTERN.exec(userAgent)?.[1];

    if (!raw) return UNKNOWN;

    return getSafariVersionIfFrozenUA(userAgent, raw.replaceAll("_", "."));
};

export const getOSVersionFromLegacyUA = (
    userAgent: string,
    os: string,
): string => {
    switch (os) {
        case "Android": {
            // Frozen at "10" by Chrome's UA reduction on most devices.
            return /Android\s([\d.]+)/.exec(userAgent)?.[1] ?? UNKNOWN;
        }
        case "iOS":
        case "iPadOS":
        case "macOS": {
            return getAppleOSVersion(userAgent);
        }
        case "Windows": {
            // Frozen at NT 10.0, so Windows 10 and 11 are indistinguishable.
            return /Windows NT\s([\d.]+)/.exec(userAgent)?.[1] ?? UNKNOWN;
        }
        case "ChromeOS": {
            return /CrOS\s\S+\s([\d.]+)/.exec(userAgent)?.[1] ?? UNKNOWN;
        }
        default:
            // Linux exposes no version in the UA, and neither does the
            // platformVersion client hint.
            return UNKNOWN;
    }
};

export const getOSNameFromLegacyUA = (userAgent: string): string => {
    if (userAgent.includes("Android")) return "Android";
    if (/iPhone|iPod/.test(userAgent)) return "iOS";
    if (/iPad/.test(userAgent)) return "iPadOS";
    if (userAgent.includes("CrOS")) return "ChromeOS";
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac OS")) {
        // iPadOS 13+ in desktop mode reports Mac OS, so we check for touch support to differentiate
        return navigator.maxTouchPoints > 0 ? "iPadOS" : "macOS";
    }
    if (userAgent.includes("Linux")) return "Linux";
    return UNKNOWN;
};

export const getBrowserFromLegacyUA = (userAgent: string): BrowserInfo => {
    const inApp = getInAppBrowser(userAgent);
    if (inApp) return inApp;

    for (const browser of browserNameDictionary) {
        const matched = browser.keywords.find((keyword) =>
            userAgent.includes(keyword),
        );
        if (matched) {
            return {
                name: browser.name,
                version: getVersionFromLegacyUA(userAgent, matched),
            };
        }
    }

    if (isSafariLegacyUA(userAgent)) {
        return {
            name: "Safari",
            version: SAFARI_VERSION_PATTERN.exec(userAgent)?.[1] ?? UNKNOWN,
        };
    }

    // WKWebView embeds without a vendor token. The engine is Safari's, but its
    // version is not exposed anywhere in the UA — pair with deviceOS to tell
    // iOS and macOS embeds apart.
    if (
        APPLE_DEVICE_PATTERN.test(userAgent) &&
        userAgent.includes("AppleWebKit")
    ) {
        return { name: "WebView", version: UNKNOWN };
    }

    return { name: UNKNOWN, version: UNKNOWN };
};

// Chromium injects a randomised "GREASE" brand so sites cannot hard-code brand
// lists. Current Chromium always emits `Not<sep>A<sep>Brand`, but the spec
// allows any shape and Chrome 99-100 used a leading space (" Not A;Brand"), so
// strip everything but letters before comparing.
const isGenericBrand = (brand: string): boolean => {
    const normalized = brand.replace(/[^a-z]/gi, "").toLowerCase();
    return normalized === "chromium" || normalized === "notabrand";
};

// Chromium browsers report multiple brands via userAgentData.brands, e.g.:
// Chrome:  ["Chromium", "Not:A-Brand", "Google Chrome"]
//
// Skip the generic brands to find the specific one (e.g. "Microsoft Edge").
export const getBrowserFromBrands = (brands: Brand[]): BrowserInfo => {
    const brandNameMap: Record<string, string> = {
        "Microsoft Edge": "Edge",
        "Google Chrome": "Chrome",
        "Samsung Internet": "Samsung Browser",
    };

    const specific = brands.find(({ brand }) => !isGenericBrand(brand));

    if (specific) {
        const name = brandNameMap[specific.brand] ?? specific.brand;
        return { name, version: specific.version };
    }

    const chromium = brands.find((b) => b.brand === "Chromium");
    return chromium
        ? { name: "Chrome", version: chromium.version }
        : { name: UNKNOWN, version: UNKNOWN };
};

export const getBrowser = (
    userAgent: string,
    uaData?: NavigatorUAData,
): BrowserInfo => {
    // In-app browsers win over brands: an Android in-app WebView reports itself
    // as Chrome via userAgentData, which would make it impossible to compare
    // against the same app on iOS.
    const inApp = getInAppBrowser(userAgent);
    if (inApp) return inApp;

    if (uaData?.brands?.length) {
        const fromBrands = getBrowserFromBrands(uaData.brands);
        if (fromBrands.name !== UNKNOWN) return fromBrands;
    }

    return getBrowserFromLegacyUA(userAgent);
};

const getCommonParams = () => {
    const nav = navigator as NavigatorWithConnection;
    const dpr = Math.round((window.devicePixelRatio ?? 1) * 100) / 100;

    return {
        deviceTouch: navigator.maxTouchPoints > 0,
        deviceDPR: dpr,
        deviceViewportWidth: window.innerWidth,
        deviceViewportHeight: window.innerHeight,
        deviceConnection: nav.connection?.effectiveType ?? UNKNOWN,
    };
};

export const getDeviceParams = () => {
    const nav = navigator as NavigatorWithUAData;
    // Safari and Firefox (as at April 2026) do not support userAgentData, and it
    // is unavailable outside secure contexts.
    const uaData = nav.userAgentData;
    const userAgent = navigator.userAgent;

    const deviceOS = getOSNameFromLegacyUA(userAgent);
    const browser = getBrowser(userAgent, uaData);

    return {
        deviceOS,
        // userAgentData does not expose the OS version, so this is always parsed
        // from the UA string.
        deviceOSVersion: normalizeVersion(
            getOSVersionFromLegacyUA(userAgent, deviceOS),
        ),
        deviceMobile: uaData?.mobile ?? /Mobi/i.test(userAgent),
        deviceBrowser: browser.name,
        deviceBrowserVersion: normalizeVersion(browser.version),
        deviceWebview: isWebviewUA(userAgent),
        ...getCommonParams(),
    };
};
