import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("decorator utils", async ({ page }) => {
    await page.evaluate(() => {
        window.postMessage({
            source: "decoratorClient",
            event: "params",
            payload: {
                availableLanguages: [
                    { locale: "nb", handleInApp: true },
                    { locale: "en", handleInApp: true },
                ],
                breadcrumbs: [
                    {
                        title: "Min side",
                        url: "https://www.nav.no/minside",
                        handleInApp: false,
                    },
                    {
                        title: "Ditt sykefravær",
                        url: "https://www.nav.no/syk/sykefravaer",
                        handleInApp: false,
                    },
                    {
                        title: "Sykmeldinger",
                        url: "/syk/sykmeldinger",
                        handleInApp: true,
                    },
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
