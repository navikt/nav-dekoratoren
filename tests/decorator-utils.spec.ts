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
                        handleInApp: true,
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
    const payload = page.evaluate(
        () =>
            new Promise((resolve) => {
                window.addEventListener("message", (event: MessageEvent) => {
                    if (
                        event.data.source === "decorator" &&
                        event.data.event === "breadcrumbClick"
                    ) {
                        resolve(event.data.payload);
                    }
                });
            }),
    );

    await page.getByText("Ditt sykefravær").click();
    expect(await payload).toEqual({
        url: "https://www.nav.no/syk/sykefravaer",
        title: "Ditt sykefravær",
        handleInApp: true,
    });
});
//TODO: Lage tester for Umami tilsvarende tester for Amplitude, som nå er fjernet
// Se opprinnelig Amplitude-test her: https://github.com/navikt/nav-dekoratoren/blob/144a33f376f41ac67c0b0ca6eb70106712298fe8/tests/decorator-utils.spec.ts#L68
