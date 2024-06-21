import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("language selector", async ({ page }) => {
    await page.evaluate(() => {
        window.postMessage({
            source: "decoratorClient",
            event: "params",
            payload: {
                availableLanguages: [
                    { locale: "nb", handleInApp: true },
                    { locale: "en", handleInApp: true },
                ],
            },
        });
    });
    await page.getByRole("button", { name: "Språk/Language" }).click();
    await expect(page.getByRole("button", { name: "Meny" })).toBeVisible();
    await page.getByRole("button", { name: "English" }).click();
    await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
    page.evaluate(() => {
        window.postMessage({
            source: "decoratorClient",
            event: "params",
            payload: { language: "nb" },
        });
    });
    await expect(page.getByRole("button", { name: "Meny" })).toBeVisible();
});
