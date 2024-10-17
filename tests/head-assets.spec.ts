import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("Should include favicons", async ({ page }) => {
    const faviconIco = page.locator(
        "head > link[rel='icon'][href$='/public/favicon.ico']",
    );
    const faviconSvg = page.locator(
        "head > link[rel='icon'][href$='/public/favicon.svg']",
    );

    await expect(faviconIco).toBeAttached();
    await expect(faviconSvg).toBeAttached();
});
