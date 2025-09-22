import { expect, Page } from "@playwright/test";
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

const clickBreadcrumbAndGetAmplitudeEventData = async (page: Page) => {
    const amplitudeEventDataPromise = page
        .waitForRequest((request) => {
            return (
                request.url() === "https://amplitude.nav.no/collect" &&
                request
                    .postDataJSON()
                    .events.some(
                        (event: any) =>
                            event.event_properties?.komponent === "Breadcrumbs",
                    )
            );
        })
        .then((request) =>
            request
                .postDataJSON()
                .events.find(
                    (event: any) =>
                        event.event_properties?.komponent === "Breadcrumbs",
                ),
        );

    await page.getByText("Ola Nordmann").click();

    return amplitudeEventDataPromise;
};

test("Breadcrumbs without analyticsTitle should redact the title when logging", async ({
    page,
}) => {
    await page.evaluate(() => {
        window.postMessage({
            source: "decoratorClient",
            event: "params",
            payload: {
                breadcrumbs: [
                    {
                        title: "Ola Nordmann",
                        url: "/syk/sykmeldinger/foo",
                        handleInApp: true,
                    },
                    {
                        title: "Mine sykmeldinger",
                        url: "/syk/sykmeldinger/foo/bar",
                        handleInApp: true,
                    },
                ],
            },
        });
    });

    await page.getByTestId("consent-banner-all").click();

    const amplitudeEvent = await clickBreadcrumbAndGetAmplitudeEventData(page);

    expect(amplitudeEvent.event_properties.lenketekst).toContain("[redacted]");
    expect(amplitudeEvent.event_properties.lenketekst).not.toContain(
        "Ola Nordmann",
    );
});

test("Breadcrumbs with analyticsTitle should log this in place of the title", async ({
    page,
}) => {
    await page.evaluate(() => {
        window.postMessage({
            source: "decoratorClient",
            event: "params",
            payload: {
                breadcrumbs: [
                    {
                        title: "Ola Nordmann",
                        analyticsTitle: "Min analytics title",
                        url: "/syk/sykmeldinger/foo",
                        handleInApp: true,
                    },
                    {
                        title: "Mine sykmeldinger",
                        url: "/syk/sykmeldinger/foo/bar",
                        handleInApp: true,
                    },
                ],
            },
        });
    });

    await page.getByTestId("consent-banner-all").click();

    const amplitudeEvent = await clickBreadcrumbAndGetAmplitudeEventData(page);

    expect(amplitudeEvent.event_properties.lenketekst).toContain(
        "Min analytics title",
    );
    expect(amplitudeEvent.event_properties.lenketekst).not.toContain(
        "Ola Nordmann",
    );
});
