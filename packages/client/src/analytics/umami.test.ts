import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logUmamiEvent } from "./umami";

describe("logUmamiEvent", () => {
    beforeEach(() => {
        window.__DECORATOR_DATA__ = {
            params: {
                analyticsQueryParams: [],
                analyticsRedactFilter: [],
            },
            features: {
                "dekoratoren.umami": true,
            },
        } as unknown as typeof window.__DECORATOR_DATA__;
        window.webStorageController = {
            getAnalyticsId: () => "analytics-id",
        } as typeof window.webStorageController;
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("adds moduler metadata to the Umami payload", async () => {
        const track = vi.fn((createEvent) =>
            createEvent({
                referrer: "https://www.nav.no/referrer?fnr=12345678910",
            }),
        );
        vi.stubGlobal("umami", { track });

        const event = await logUmamiEvent(
            "besøk",
            { målgruppe: "privatperson" },
            "nav-dekoratoren",
            {
                decoratorModulerVersion: "4.1.1",
                decoratorModulerEntryPoint: "ssr",
            },
        );

        expect(track).toHaveBeenCalledOnce();
        expect(event).toMatchObject({
            id: "analytics-id",
            data: {
                målgruppe: "privatperson",
                origin: "nav-dekoratoren",
                viaDekoratoren: true,
                decoratorModulerVersion: "4.1.1",
                decoratorModulerEntryPoint: "ssr",
            },
        });
    });

    it.each(["typed", "custom", "legacy"] as const)(
        "adds analytics entry point %s to the Umami payload",
        async (analyticsEntryPoint) => {
            const track = vi.fn((createEvent) =>
                createEvent({
                    referrer: "https://www.nav.no/referrer",
                }),
            );
            vi.stubGlobal("umami", { track });

            const event = await logUmamiEvent(
                "test-event",
                { kategori: "test" },
                "test-app",
                {
                    decoratorModulerAnalyticsEntryPoint: analyticsEntryPoint,
                },
            );

            expect(track).toHaveBeenCalledOnce();
            expect(event).toMatchObject({
                name: "test-event",
                data: {
                    kategori: "test",
                    origin: "test-app",
                    viaDekoratoren: true,
                    decoratorModulerAnalyticsEntryPoint: analyticsEntryPoint,
                },
            });
        },
    );
});
