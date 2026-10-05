import { expect, test } from "@playwright/test";

// CONSENT_COOKIE_NAME in decorator-shared/constants
const CONSENT_COOKIE_NAME = "navno-consent";

// The pre-paint script shows the banner straight from the server-rendered HTML,
// before the client script has attached any click handlers. Consumers' tests
// click the banner buttons as soon as they are visible, without waiting for the
// decorator to be ready, so a click in that window must not be lost.
//
// Deliberately not using the fixtures in ./fixtures, since they wait for the
// decorator to be ready, which hides exactly this race.
test.describe("samtykkebanner før klientskriptet har lastet", () => {
    for (const testId of [
        "consent-banner-all",
        "consent-banner-refuse-optional",
    ]) {
        test(`klikk på ${testId} går ikke tapt`, async ({ page }) => {
            await page.route(
                /localhost:8089\/public\/.*main-.*\.js$/,
                async (route) => {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    await route.continue();
                },
            );

            await page.goto("http://localhost:8089", { waitUntil: "commit" });

            const button = page.getByTestId(testId);
            await expect(button).toBeVisible();
            expect(
                await page.evaluate(
                    () => !!customElements.get("consent-banner"),
                ),
            ).toBe(false);

            await button.click();

            await expect(button).toBeHidden({ timeout: 1000 });
            const cookies = await page.context().cookies();
            expect(
                cookies.some((cookie) => cookie.name === CONSENT_COOKIE_NAME),
            ).toBe(true);
        });
    }
});
