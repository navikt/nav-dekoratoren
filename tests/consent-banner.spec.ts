import { expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { test } from "./fixtures";

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
    // Absent attribute and "pending" are equivalent; the CSS default is the
    // in-flow banner so the server markup is correct before any script runs.
    expect(await consentState(page)).not.toBe("decided");
    await expect(banner(page)).toBeVisible();

    // In flow, not docked: it must scroll away under the sticky header.
    expect(await bannerPosition(page)).toBe("static");
});

test("svar på samtykke skjuler banneret", async ({ page }) => {
    await page.getByTestId("consent-banner-all").click();

    await expect(banner(page)).toBeHidden();
    expect(await consentState(page)).toBe("decided");
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
