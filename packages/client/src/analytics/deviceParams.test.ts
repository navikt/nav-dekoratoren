import { afterEach, describe, expect, it, vi } from "vitest";
import {
    getBrowserFromBrands,
    getBrowserFromLegacyUA,
    getDeviceParams,
    getOSNameFromLegacyUA,
    getOSVersionFromLegacyUA,
    isWebviewUA,
    normalizeVersion,
} from "./deviceParams";

const stubNavigator = (
    userAgent: string,
    extra: Record<string, unknown> = {},
) => {
    vi.stubGlobal("navigator", {
        userAgent,
        maxTouchPoints: 0,
        ...extra,
    });
};

afterEach(() => {
    vi.unstubAllGlobals();
});

type Expectation = {
    os: string;
    osVersion: string;
    browser: string;
    browserVersion: string;
    webview: boolean;
};

// Real-world user agent strings. Anything reporting "unknown" here is either a
// parser gap or genuinely absent from the UA — see the assertions at the bottom.
const userAgents: [string, string, number, Expectation][] = [
    [
        "iOS Safari",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6 Mobile/15E148 Safari/604.1",
        0,
        {
            os: "iOS",
            osVersion: "26.6",
            browser: "Safari",
            browserVersion: "26.6",
            webview: false,
        },
    ],
    [
        "iOS Safari, patch release",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Mobile/15E148 Safari/604.1",
        0,
        {
            os: "iOS",
            osVersion: "26.5",
            browser: "Safari",
            browserVersion: "26.5",
            webview: false,
        },
    ],
    [
        "macOS Safari",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6 Safari/605.1.15",
        0,
        {
            os: "macOS",
            osVersion: "26.6",
            browser: "Safari",
            browserVersion: "26.6",
            webview: false,
        },
    ],
    [
        // iPadOS 13+ requests desktop sites by default: the UA is identical to
        // macOS Safari and only maxTouchPoints tells them apart.
        "iPadOS Safari, desktop mode",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6 Safari/605.1.15",
        5,
        {
            os: "iPadOS",
            osVersion: "26.6",
            browser: "Safari",
            browserVersion: "26.6",
            webview: false,
        },
    ],
    [
        "iPadOS Safari, mobile mode",
        "Mozilla/5.0 (iPad; CPU OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6 Mobile/15E148 Safari/604.1",
        5,
        {
            os: "iPadOS",
            osVersion: "26.6",
            browser: "Safari",
            browserVersion: "26.6",
            webview: false,
        },
    ],
    [
        "iOS WKWebView, no vendor token",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        0,
        {
            os: "iOS",
            osVersion: "18.6",
            browser: "WebView",
            browserVersion: "unknown",
            webview: true,
        },
    ],
    [
        "iOS WKWebView, Safari token but no Version token",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1",
        0,
        {
            os: "iOS",
            osVersion: "18.6",
            browser: "WebView",
            browserVersion: "unknown",
            webview: true,
        },
    ],
    [
        "Facebook iOS",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/500.0.0.42.108;FBDV/iPhone14,2;FBSV/18.6;FBLC/nb_NO;FBOP/5]",
        0,
        {
            os: "iOS",
            osVersion: "18.6",
            browser: "Facebook",
            browserVersion: "500",
            webview: true,
        },
    ],
    [
        "Facebook Android",
        "Mozilla/5.0 (Linux; Android 14; SM-S918B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/151.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/500.0.0.42.108;]",
        5,
        {
            os: "Android",
            osVersion: "14",
            browser: "Facebook",
            browserVersion: "500",
            webview: true,
        },
    ],
    [
        "Instagram iOS",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 320.0.0.19.104 (iPhone14,2; iOS 18_6; nb_NO; nb; scale=3.00)",
        0,
        {
            os: "iOS",
            osVersion: "18.6",
            browser: "Instagram",
            browserVersion: "320",
            webview: true,
        },
    ],
    [
        "LinkedIn iOS",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.30.1234",
        0,
        {
            os: "iOS",
            osVersion: "18.6",
            browser: "LinkedIn",
            browserVersion: "9.30",
            webview: true,
        },
    ],
    [
        // Contains "like Safari/8620.2.4.10.7" but no Version token, which used
        // to make this land in the Safari bucket with an unknown version.
        "Snapchat iOS",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21F79 Snapchat/13.14.0.44 (like Safari/8620.2.4.10.7, panda)",
        0,
        {
            os: "iOS",
            osVersion: "18.5",
            browser: "Snapchat",
            browserVersion: "13.14",
            webview: true,
        },
    ],
    [
        "Google app iOS",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/348.0.712900558 Mobile/15E148 Safari/604.1",
        0,
        {
            os: "iOS",
            osVersion: "18.6",
            browser: "Google App",
            browserVersion: "348",
            webview: true,
        },
    ],
    [
        "Chrome iOS",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/151.0.7922.112 Mobile/15E148 Safari/604.1",
        0,
        {
            os: "iOS",
            osVersion: "18.6",
            browser: "Chrome",
            browserVersion: "151",
            webview: false,
        },
    ],
    [
        "Firefox iOS",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/141.0 Mobile/15E148 Safari/605.1.15",
        0,
        {
            os: "iOS",
            osVersion: "18.6",
            browser: "Firefox",
            browserVersion: "141",
            webview: false,
        },
    ],
    [
        "Edge iOS",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 EdgiOS/151.0.4129.96 Mobile/15E148 Safari/605.1.15",
        0,
        {
            os: "iOS",
            osVersion: "18.6",
            browser: "Edge",
            browserVersion: "151",
            webview: false,
        },
    ],
    [
        // Android OS version is frozen at 10 by Chrome's UA reduction.
        "Chrome Android",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36",
        5,
        {
            os: "Android",
            osVersion: "10",
            browser: "Chrome",
            browserVersion: "151",
            webview: false,
        },
    ],
    [
        "Android WebView",
        "Mozilla/5.0 (Linux; Android 10; K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/151.0.0.0 Mobile Safari/537.36",
        5,
        {
            os: "Android",
            osVersion: "10",
            browser: "Chrome",
            browserVersion: "151",
            webview: true,
        },
    ],
    [
        "Samsung Internet",
        "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/145.0.0.0 Mobile Safari/537.36",
        5,
        {
            os: "Android",
            osVersion: "14",
            browser: "Samsung Browser",
            browserVersion: "30",
            webview: false,
        },
    ],
    [
        "Chrome Windows",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
        0,
        {
            os: "Windows",
            osVersion: "10",
            browser: "Chrome",
            browserVersion: "151",
            webview: false,
        },
    ],
    [
        "Edge Windows",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.4129.96",
        0,
        {
            os: "Windows",
            osVersion: "10",
            browser: "Edge",
            browserVersion: "151",
            webview: false,
        },
    ],
    [
        "Opera Windows",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 OPR/137.0.0.0",
        0,
        {
            os: "Windows",
            osVersion: "10",
            browser: "Opera",
            browserVersion: "137",
            webview: false,
        },
    ],
    [
        "Firefox Windows",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:154.0) Gecko/20100101 Firefox/154.0",
        0,
        {
            os: "Windows",
            osVersion: "10",
            browser: "Firefox",
            browserVersion: "154",
            webview: false,
        },
    ],
    [
        // macOS is frozen at 10.15.7 for every non-Safari browser.
        "Chrome macOS",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
        0,
        {
            os: "macOS",
            osVersion: "10.15",
            browser: "Chrome",
            browserVersion: "151",
            webview: false,
        },
    ],
    [
        "ChromeOS",
        "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
        0,
        {
            os: "ChromeOS",
            osVersion: "14541",
            browser: "Chrome",
            browserVersion: "151",
            webview: false,
        },
    ],
    [
        // Linux exposes no OS version in the UA, and the platformVersion client
        // hint is an empty string on Linux, so this can never be resolved.
        "Chrome Linux",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
        0,
        {
            os: "Linux",
            osVersion: "unknown",
            browser: "Chrome",
            browserVersion: "151",
            webview: false,
        },
    ],
    [
        "Internet Explorer 11",
        "Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko",
        0,
        {
            os: "Windows",
            osVersion: "10",
            browser: "unknown",
            browserVersion: "unknown",
            webview: false,
        },
    ],
];

describe("normalizeVersion", () => {
    it.each([
        ["151", "151"],
        ["151.0.7922.112", "151"],
        ["151.0.4129.96", "151"],
        ["154.0", "154"],
        ["30.0", "30"],
        ["26.6", "26.6"],
        ["26.5.2", "26.5"],
        ["18.7.5", "18.7"],
        ["10.15.7", "10.15"],
        ["9.30.1234", "9.30"],
        ["unknown", "unknown"],
        ["", "unknown"],
        ["4.0", "4"],
    ])("normalizes %s to %s", (input, expected) => {
        expect(normalizeVersion(input)).toBe(expected);
    });

    it("collapses the two Chrome reporting paths into one bucket", () => {
        // userAgentData.brands reports a bare major, UA parsing reports the
        // full build. Both must aggregate to the same value.
        expect(normalizeVersion("151")).toBe(
            normalizeVersion("151.0.7922.112"),
        );
    });

    it("keeps the minor version for Safari and Firefox", () => {
        expect(normalizeVersion("26.5.2")).not.toBe(normalizeVersion("26.6"));
    });
});

describe("legacy user agent parsing", () => {
    it.each(userAgents)(
        "parses %s",
        (_label, userAgent, maxTouchPoints, expected) => {
            stubNavigator(userAgent, { maxTouchPoints });

            const os = getOSNameFromLegacyUA(userAgent);
            const browser = getBrowserFromLegacyUA(userAgent);

            expect({
                os,
                osVersion: normalizeVersion(
                    getOSVersionFromLegacyUA(userAgent, os),
                ),
                browser: browser.name,
                browserVersion: normalizeVersion(browser.version),
                webview: isWebviewUA(userAgent),
            }).toEqual(expected);
        },
    );

    it("only reports unknown where the UA genuinely has no answer", () => {
        const unresolved = userAgents.filter(
            ([, , , expected]) =>
                expected.os === "unknown" ||
                expected.osVersion === "unknown" ||
                expected.browser === "unknown" ||
                expected.browserVersion === "unknown",
        );

        expect(unresolved.map(([label]) => label)).toEqual([
            // WKWebView does not expose its engine version anywhere.
            "iOS WKWebView, no vendor token",
            "iOS WKWebView, Safari token but no Version token",
            // Linux has no OS version in the UA.
            "Chrome Linux",
            // Genuinely unsupported, kept as a regression guard.
            "Internet Explorer 11",
        ]);
    });
});

describe("getBrowserFromBrands", () => {
    const chromium = { brand: "Chromium", version: "151" };
    const chrome = { brand: "Google Chrome", version: "151" };

    it.each([
        ["Not:A-Brand", "24"],
        [" Not A;Brand", "99"],
        ["(Not(A:Brand", "8"],
        [";Not A Brand", "99"],
        ["Not_A Brand", "8"],
        ["Not/A)Brand", "8"],
    ])("ignores the GREASE brand %s", (brand, version) => {
        expect(
            getBrowserFromBrands([{ brand, version }, chromium, chrome]),
        ).toEqual({ name: "Chrome", version: "151" });
    });

    it.each([
        ["Microsoft Edge", "Edge"],
        ["Google Chrome", "Chrome"],
        ["Samsung Internet", "Samsung Browser"],
    ])("maps the brand %s to %s", (brand, expected) => {
        expect(
            getBrowserFromBrands([
                { brand: "Not:A-Brand", version: "24" },
                chromium,
                { brand, version: "151" },
            ]),
        ).toEqual({ name: expected, version: "151" });
    });

    it("falls back to Chromium when no specific brand is present", () => {
        expect(
            getBrowserFromBrands([
                { brand: "Not:A-Brand", version: "24" },
                chromium,
            ]),
        ).toEqual({ name: "Chrome", version: "151" });
    });

    it.each([
        ["an empty brand list", []],
        ["a GREASE-only brand list", [{ brand: "Not:A-Brand", version: "24" }]],
    ])("returns unknown for %s", (_label, brands) => {
        expect(getBrowserFromBrands(brands)).toEqual({
            name: "unknown",
            version: "unknown",
        });
    });

    it("does not treat a real brand containing 'Not' as GREASE", () => {
        expect(
            getBrowserFromBrands([
                { brand: "Notion Browser", version: "3" },
                chromium,
            ]),
        ).toEqual({ name: "Notion Browser", version: "3" });
    });
});

describe("getDeviceParams", () => {
    it("prefers userAgentData brands over UA parsing", () => {
        stubNavigator(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
            {
                userAgentData: {
                    mobile: false,
                    platform: "Windows",
                    brands: [
                        { brand: "Not:A-Brand", version: "24" },
                        { brand: "Chromium", version: "151" },
                        { brand: "Google Chrome", version: "151" },
                    ],
                },
            },
        );

        expect(getDeviceParams()).toMatchObject({
            deviceOS: "Windows",
            deviceOSVersion: "10",
            deviceMobile: false,
            deviceBrowser: "Chrome",
            deviceBrowserVersion: "151",
            deviceWebview: false,
        });
    });

    it("falls back to UA parsing when userAgentData is unavailable", () => {
        stubNavigator(
            "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6 Mobile/15E148 Safari/604.1",
        );

        expect(getDeviceParams()).toMatchObject({
            deviceOS: "iOS",
            deviceOSVersion: "26.6",
            deviceMobile: true,
            deviceBrowser: "Safari",
            deviceBrowserVersion: "26.6",
            deviceWebview: false,
        });
    });

    it("falls back to UA parsing when brands resolve to nothing", () => {
        stubNavigator(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
            {
                userAgentData: {
                    mobile: false,
                    platform: "Windows",
                    brands: [],
                },
            },
        );

        expect(getDeviceParams()).toMatchObject({
            deviceBrowser: "Chrome",
            deviceBrowserVersion: "151",
        });
    });

    it("labels an in-app browser consistently across platforms", () => {
        // Android in-app WebViews report themselves as Chrome via
        // userAgentData, which would otherwise hide them.
        stubNavigator(
            "Mozilla/5.0 (Linux; Android 14; SM-S918B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/151.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/500.0.0.42.108;]",
            {
                maxTouchPoints: 5,
                userAgentData: {
                    mobile: true,
                    platform: "Android",
                    brands: [
                        { brand: "Chromium", version: "151" },
                        { brand: "Google Chrome", version: "151" },
                    ],
                },
            },
        );

        expect(getDeviceParams()).toMatchObject({
            deviceOS: "Android",
            deviceBrowser: "Facebook",
            deviceBrowserVersion: "500",
            deviceWebview: true,
        });
    });
});
