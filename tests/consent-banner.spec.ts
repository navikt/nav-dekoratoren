import { expect, Page, test as playwrightTest } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { test } from "./fixtures";
import {
    CONSENT_COOKIE_NAME,
    CURRENT_CONSENT_VERSION,
} from "../packages/shared/constants";

const consentState = (page: Page) =>
    page.evaluate(() => document.documentElement.dataset.decoratorConsent);

const banner = (page: Page) => page.locator("consent-banner section");

const bannerPosition = (page: Page) =>
    page.evaluate(() => {
        const el = document.querySelector("consent-banner > div");
        return el ? getComputedStyle(el).position : null;
    });

// The whole point of docking is long pages. The csr fixture in particular is short
// enough to fit in the viewport, which would make "did not scroll" vacuous.
const makePageLong = (page: Page) =>
    page.evaluate(() => {
        const spacer = document.createElement("div");
        spacer.style.height = "3000px";
        const footer = document.querySelector(
            "#decorator-footer, #footer-withmenu",
        );
        footer?.parentNode?.insertBefore(spacer, footer);
    });

// Consent, then activate the "change consent" link the way a user would.
const consentThenReshow = async (page: Page) => {
    await page.getByTestId("consent-banner-all").click();
    await expect(banner(page)).toBeHidden();

    await makePageLong(page);

    const trigger = page.locator("[data-consent-banner-trigger]").first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();

    expect(await consentState(page)).toBe("reshow");
};

test("banneret vises i normalflyt øverst ved manglende samtykke", async ({
    page,
}) => {
    // The banner is hidden by default in CSS. Without a valid consent cookie
    // the pre-paint script sets "pending", which is what reveals it.
    expect(await consentState(page)).toBe("pending");
    await expect(banner(page)).toBeVisible();

    // In flow, not docked: it must scroll away under the sticky header.
    expect(await bannerPosition(page)).toBe("static");
});

test("svar på samtykke skjuler banneret", async ({ page }) => {
    await page.getByTestId("consent-banner-all").click();

    await expect(banner(page)).toBeHidden();
    expect(await consentState(page)).toBe("decided");
});

// This is the CLS guarantee. Hidden has to be the CSS default, not something a
// script switches on. Otherwise every consented user whose browser drops the
// pre-paint script -- nonce-based CSP at the consuming app, inline script
// error, JS off -- gets the banner painted and then yanked away.
test("banneret er skjult når ingen tilstand er satt", async ({ page }) => {
    await expect(banner(page)).toBeVisible();

    await page.evaluate(() => {
        delete document.documentElement.dataset.decoratorConsent;
    });

    await expect(banner(page)).toBeHidden();
});

test("endring av samtykke dokker banneret uten å scrolle brukeren", async ({
    page,
}) => {
    await page.getByTestId("consent-banner-all").click();
    await expect(banner(page)).toBeHidden();

    await makePageLong(page);

    const trigger = page.locator("[data-consent-banner-trigger]").first();
    await trigger.scrollIntoViewIfNeeded();

    const scrollBefore = await page.evaluate(() => window.scrollY);
    expect(scrollBefore).toBeGreaterThan(0);

    await trigger.click();

    expect(await consentState(page)).toBe("reshow");
    await expect(banner(page)).toBeVisible();
    expect(await bannerPosition(page)).toBe("fixed");

    // The whole point: the user stays exactly where they were.
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
});

test("dokket banner klippes ikke av overflow-x: clip på body", async ({
    page,
}) => {
    await consentThenReshow(page);

    // Viewport-relative on purpose: the page is scrolled, and this is precisely
    // the claim under test -- that a fixed descendant of a body with
    // overflow-x: clip is still positioned against the viewport and painted.
    const rect = await page.evaluate(async () => {
        const el = document.querySelector("consent-banner > div")!;
        // The dock-in animation starts at translateY(100%); measure the end state.
        await Promise.all(el.getAnimations().map((a) => a.finished));

        const { y, width, height } = el.getBoundingClientRect();
        return {
            y,
            width,
            height,
            viewportHeight: window.innerHeight,
            // Excludes the scrollbar gutter, which the fixed banner does not span.
            contentWidth: document.documentElement.clientWidth,
        };
    });

    expect(rect.height).toBeGreaterThan(0);
    // Flush with the bottom edge of the viewport, full width, actually painted.
    expect(Math.round(rect.y + rect.height)).toBe(rect.viewportHeight);
    expect(Math.round(rect.width)).toBe(rect.contentWidth);
});

test("banneret overlever refreshHeader uten å duplisere seg", async ({
    page,
}) => {
    await consentThenReshow(page);

    // Tag the current instance so we can wait for the real replacement rather
    // than racing the fetch that refreshHeader kicks off.
    await page.evaluate(() =>
        document
            .querySelector("consent-banner")!
            .setAttribute("data-test-generation", "1"),
    );

    // Language changes replace the entire innerHTML of <decorator-header>,
    // which destroys and re-creates the banner.
    await page.evaluate(() => {
        window.postMessage({
            source: "decoratorClient",
            event: "params",
            payload: { language: "en" },
        });
    });

    await page.waitForFunction(() => {
        const el = document.querySelector("consent-banner");
        return !!el && !el.hasAttribute("data-test-generation");
    });

    await expect(page.locator("consent-banner")).toHaveCount(1);
    await expect(page.getByTestId("consent-banner-all")).toHaveCount(1);

    // Re-injected markup picks the docked presentation back up from CSS alone.
    expect(await consentState(page)).toBe("reshow");
    await expect(banner(page)).toBeVisible();
    expect(await bannerPosition(page)).toBe("fixed");

    // ...and the buttons on the new instance are still wired up.
    await page.getByTestId("consent-banner-all").click();
    await expect(banner(page)).toBeHidden();
    expect(await consentState(page)).toBe("decided");
});

test("fokus flyttes til banneret ved endring av samtykke", async ({ page }) => {
    await consentThenReshow(page);

    // The banner docks far from the link that was activated, so focus has to
    // follow it or keyboard and screen reader users are left behind.
    await expect(page.locator("#consent_banner_title")).toBeFocused();
});

test("dokket banner har ingen maskinelt detekterbare uu-feil", async ({
    page,
}) => {
    await consentThenReshow(page);

    const results = await new AxeBuilder({ page: page as any }).analyze();

    expect(
        results.violations,
        JSON.stringify(results.violations, null, 2),
    ).toEqual([]);
});

/* ---------------------------------------------------------------------------
 * Pre-paint behaviour
 *
 * Needs a consent cookie in place before the first navigation, so it cannot use
 * the shared fixtures (those navigate for you). CSR is excluded on purpose: the
 * pre-paint script is inserted via outerHTML there and therefore never
 * executes, which is one of the reasons CSR is discouraged.
 * ------------------------------------------------------------------------- */

const currentConsentCookie = () =>
    encodeURIComponent(
        JSON.stringify({
            consent: { analytics: true, surveys: true },
            userActionTaken: true,
            meta: {
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
                version: CURRENT_CONSENT_VERSION,
                analyticsId: null,
            },
        }),
    );

const serverRenderedFixtures = [
    { name: "ssr", url: "http://localhost:8089" },
    { name: "next pages router", url: "http://localhost:3000" },
];

for (const { name, url } of serverRenderedFixtures) {
    playwrightTest(
        `${name}: gyldig samtykke skjuler banneret før første paint`,
        async ({ page, context }) => {
            await context.addCookies([
                {
                    name: CONSENT_COOKIE_NAME,
                    value: currentConsentCookie(),
                    domain: "localhost",
                    path: "/",
                },
            ]);

            await page.goto(url, { waitUntil: "commit" });

            // The client controller never writes "decided" for a user whose
            // consent is already current -- it returns without touching the
            // attribute. So seeing "decided" proves the pre-paint script ran.
            await page.waitForFunction(
                () =>
                    document.documentElement.dataset.decoratorConsent ===
                    "decided",
            );

            await page.waitForLoadState("networkidle");
            expect(await consentState(page)).toBe("decided");
            await expect(banner(page)).toBeHidden();
        },
    );
}
