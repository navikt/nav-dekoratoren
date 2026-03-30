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

const browserNameDictionary: { name: string; keywords: string[] }[] = [
    { name: "Edge", keywords: ["Edg/", "EdgA/", "EdgiOS/", "Edge/"] },
    { name: "Opera", keywords: ["OPR/", "OPT/", "Opera/"] },
    { name: "Samsung Browser", keywords: ["SamsungBrowser/"] },
    { name: "Chrome", keywords: ["Chrome/", "CriOS/"] },
    { name: "Firefox", keywords: ["Firefox/", "FxiOS/"] },
];

const getVersionFromUA = (userAgent: string, keyword: string): string => {
    const index = userAgent.indexOf(keyword);
    if (index === -1) return "unknown";
    const versionStart = index + keyword.length;
    const match = /^[\d.]+/.exec(userAgent.substring(versionStart));
    return match?.[0] ?? "unknown";
};

const getBrowserFromUA = (
    userAgent: string,
): { name: string; version: string } => {
    for (const browser of browserNameDictionary) {
        const matched = browser.keywords.find((keyword) =>
            userAgent.includes(keyword),
        );
        if (matched) {
            return {
                name: browser.name,
                version: getVersionFromUA(userAgent, matched),
            };
        }
    }
    if (
        userAgent.includes("Safari/") &&
        !userAgent.includes("Chrome/") &&
        !userAgent.includes("CriOS/")
    ) {
        const version = /Version\/([\d.]+)/.exec(userAgent)?.[1] ?? "unknown";
        return { name: "Safari", version };
    }
    return { name: "unknown", version: "unknown" };
};

const getOSVersionFromUA = (userAgent: string, os: string): string => {
    switch (os) {
        case "Android": {
            return /Android\s([\d.]+)/.exec(userAgent)?.[1] ?? "unknown";
        }
        case "iOS":
        case "iPadOS": {
            const match =
                /(?:iPhone|iPad|iPod|CPU)\s(?:iPhone\s)?OS\s([\d_]+)/.exec(
                    userAgent,
                );
            return match?.[1]?.replaceAll("_", ".") ?? "unknown";
        }
        case "Windows": {
            return /Windows NT\s([\d.]+)/.exec(userAgent)?.[1] ?? "unknown";
        }
        case "macOS": {
            const match = /Mac OS X\s([\d_.]+)/.exec(userAgent);
            return match?.[1]?.replaceAll("_", ".") ?? "unknown";
        }
        default:
            return "unknown";
    }
};

const getOSFromUA = (userAgent: string): string => {
    if (userAgent.includes("Android")) return "Android";
    if (/iPhone|iPod/.test(userAgent)) return "iOS";
    if (/iPad/.test(userAgent)) return "iPadOS";
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac OS")) {
        // iPadOS 13+ in desktop mode reports Mac OS, so we check for touch support to differentiate
        return navigator.maxTouchPoints > 0 ? "iPadOS" : "macOS";
    }
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("CrOS")) return "ChromeOS";
    return "unknown";
};

// Chromium browsers report multiple brands via userAgentData.brands, e.g.:
// Chrome:  ["Chromium", "Not:A-Brand", "Google Chrome"]
//
// Skip the generic brands to find the specific one (e.g. "Microsoft Edge").
const getBrowserFromBrands = (
    brands: Brand[],
): { name: string; version: string } => {
    const genericBrands = ["Chromium", "Not", "Google Chrome"];

    const specific = brands.find(
        ({ brand }) => !genericBrands.some((g) => brand.startsWith(g)),
    );

    if (specific) {
        return { name: specific.brand, version: specific.version };
    }

    const chromium = brands.find((b) => b.brand === "Chromium");
    return chromium
        ? { name: "Chrome", version: chromium.version }
        : { name: "unknown", version: "unknown" };
};

const getCommonParams = () => {
    const nav = navigator as NavigatorWithConnection;
    const dpr = Math.round((window.devicePixelRatio ?? 1) * 100) / 100;

    return {
        deviceTouch: navigator.maxTouchPoints > 0,
        deviceDPR: dpr,
        deviceViewportWidth: window.innerWidth,
        deviceViewportHeight: window.innerHeight,
        deviceConnection: nav.connection?.effectiveType ?? "unknown",
    };
};

export const getDeviceParams = () => {
    const nav = navigator as NavigatorWithUAData;
    const uaData = nav.userAgentData;

    if (uaData) {
        const browser = getBrowserFromBrands(uaData.brands);
        const os = uaData.platform || "unknown";
        return {
            deviceOS: os,
            deviceOSVersion: getOSVersionFromUA(
                navigator.userAgent,
                getOSFromUA(navigator.userAgent),
            ),
            deviceMobile: uaData.mobile,
            deviceBrowser: browser.name,
            deviceBrowserVersion: browser.version,
            ...getCommonParams(),
        };
    }

    const ua = navigator.userAgent;
    const os = getOSFromUA(navigator.userAgent);
    const browser = getBrowserFromUA(ua);

    return {
        deviceOS: os,
        deviceOSVersion: getOSVersionFromUA(navigator.userAgent, os),
        deviceMobile: /Mobi/i.test(ua),
        deviceBrowser: browser.name,
        deviceBrowserVersion: browser.version,
        ...getCommonParams(),
    };
};
