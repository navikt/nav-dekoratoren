import { test, expect } from "@playwright/test";

const ssr = test.extend({
    page: async ({ page }, use) => {
        await page.goto("http://localhost:8089");
        await use(page);
    },
});

const csr = test.extend({
    page: async ({ page }, use) => {
        await page.goto("http://localhost:8080/csr.html");
        await page.getAttribute("html", "data-hj-suppress");
        await use(page);
    },
});

[
    { test: csr, name: "csr" },
    { test: ssr, name: "ssr" },
].forEach(({ test, name }) =>
    test(name, async ({ page }) => {
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
    }),
);
