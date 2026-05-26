import type { Auth } from "decorator-shared/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { initAnalytics } from "./analytics";
import { logUmamiEvent } from "./umami";

vi.mock("./amplitude", () => ({
    initMockAmplitude: vi.fn(),
}));

vi.mock("./task-analytics/ta", () => ({
    initTaskAnalyticsScript: vi.fn(),
    stopTaskAnalytics: vi.fn(),
}));

vi.mock("./umami", () => ({
    createUmamiEvent: vi.fn(),
    initUmami: vi.fn(),
    logUmamiEvent: vi.fn(),
    stopUmami: vi.fn(),
}));

const auth: Auth = {
    authenticated: true,
    name: "Test Testesen",
    userId: "123",
    securityLevel: "4",
};

const setupDecoratorData = () => {
    window.__DECORATOR_DATA__ = {
        params: {
            simple: false,
            simpleHeader: false,
            simpleFooter: false,
            redirectToApp: false,
            level: "Level4",
            context: "privatperson",
            language: "nb",
            pageType: "article",
            pageTitle: "Page title",
            pageTheme: "theme",
            breadcrumbs: [],
            availableLanguages: [],
            utilsBackground: "transparent",
            chatbot: true,
            chatbotVisible: false,
            shareScreen: true,
            logoutWarning: true,
            feedback: false,
            ssrMainMenu: false,
            redirectOnUserChange: false,
            analyticsQueryParams: [],
            analyticsRedactFilter: [],
            decoratorModulerVersion: "4.1.1",
            decoratorModulerEntryPoint: "ssr",
        },
        features: {
            "dekoratoren.skjermdeling": false,
            "dekoratoren.chatbotscript": false,
            "dekoratoren.umami": false,
            "dekoratoren.puzzel-script": false,
        },
        env: {} as any,
        texts: {} as any,
        allowedStorage: [],
    };
    (
        window.__DECORATOR_DATA__.params as Record<string, unknown>
    ).decoratorModulerAnalyticsEntryPoint = "typed";
};

describe("analytics", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        setupDecoratorData();
    });

    it("logs pageviews with moduler metadata outside parametre", () => {
        initAnalytics(auth);

        vi.advanceTimersByTime(100);

        expect(logUmamiEvent).toHaveBeenCalledWith(
            "besøk",
            expect.objectContaining({
                målgruppe: "privatperson",
                innholdstype: "article",
                sidetittel: "Page title",
                tema: "theme",
                innlogging: "4",
                parametre: expect.not.objectContaining({
                    decoratorModulerVersion: expect.anything(),
                    decoratorModulerEntryPoint: expect.anything(),
                    decoratorModulerAnalyticsEntryPoint: expect.anything(),
                }),
            }),
            "nav-dekoratoren",
            {
                decoratorModulerVersion: "4.1.1",
                decoratorModulerEntryPoint: "ssr",
            },
        );
    });

    it.each(["typed", "custom", "legacy"] as const)(
        "forwards valid analytics entry point %s from app events",
        async (analyticsEntryPoint) => {
            initAnalytics(auth);

            await window.dekoratorenAnalytics({
                origin: "test-app",
                eventName: "test-event",
                decoratorModulerAnalyticsEntryPoint: analyticsEntryPoint,
            });

            expect(logUmamiEvent).toHaveBeenCalledWith(
                "test-event",
                {},
                "test-app",
                {
                    decoratorModulerAnalyticsEntryPoint: analyticsEntryPoint,
                },
            );
        },
    );

    it("ignores invalid analytics entry point without dropping the app event", async () => {
        initAnalytics(auth);

        await window.dekoratorenAnalytics({
            origin: "test-app",
            eventName: "test-event",
            decoratorModulerAnalyticsEntryPoint: "invalid",
        } as any);

        expect(logUmamiEvent).toHaveBeenCalledWith(
            "test-event",
            {},
            "test-app",
            undefined,
        );
    });
});
