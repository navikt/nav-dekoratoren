import { expect, Page } from "@playwright/test";
import { testWithUmamiMock } from "./fixtures";

const setBreadcrumbs = (
    page: Page,
    breadcrumbs: {
        title: string;
        analyticsTitle?: string;
        url: string;
        handleInApp: boolean;
    }[],
) =>
    page.evaluate((breadcrumbs) => {
        window.postMessage({
            source: "decoratorClient",
            event: "params",
            payload: { breadcrumbs },
        });
    }, breadcrumbs);

const clickBreadcrumbAndGetUmamiEvent = async (page: Page) => {
    // Start polling for the Breadcrumbs event before clicking
    const eventHandle = page.waitForFunction(() => {
        const events: any[] = (window as any).__umami_captured__ ?? [];
        return events.find((e: any) => e?.data?.komponent === "Breadcrumbs");
    });

    await page.getByText("Ola Nordmann").click();

    const handle = await eventHandle;
    return handle.jsonValue();
};

testWithUmamiMock(
    "Breadcrumbs without analyticsTitle should send [redacted] as lenketekst",
    async ({ page }) => {
        await setBreadcrumbs(page, [
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
        ]);

        await page.getByTestId("consent-banner-all").click();

        const event = await clickBreadcrumbAndGetUmamiEvent(page);

        expect(event.data.lenketekst).toBe("[redacted]");
        expect(event.data.lenketekst).not.toContain("Ola Nordmann");
    },
);

testWithUmamiMock(
    "Breadcrumbs with analyticsTitle should use analyticsTitle as lenketekst",
    async ({ page }) => {
        await setBreadcrumbs(page, [
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
        ]);

        await page.getByTestId("consent-banner-all").click();

        const event = await clickBreadcrumbAndGetUmamiEvent(page);

        expect(event.data.lenketekst).toBe("Min analytics title");
        expect(event.data.lenketekst).not.toContain("Ola Nordmann");
    },
);
