import { Page, test as base } from "@playwright/test";

export const setupUmamiMock = async (page: Page) => {
    await page.addInitScript(() => {
        const captured: any[] = [];
        (window as any).__umami_captured__ = captured;

        // Prevent the real Umami script from overwriting the mock
        Object.defineProperty(window, "umami", {
            get: () => ({
                track: (fn: (props: any) => any) => {
                    const event = fn({
                        hostname: window.location.hostname,
                        title: document.title,
                        url: window.location.pathname,
                        referrer: document.referrer,
                        language: navigator.language,
                        screen: `${screen.width}x${screen.height}`,
                        website: "test",
                    });
                    captured.push(event);
                    return Promise.resolve(event);
                },
            }),
            set: () => {},
            configurable: true,
        });
    });
};

const decoratorReady = () =>
    new Promise<void>((resolve) => {
        window.addEventListener("message", (e) => {
            if (e.data.source === "decorator" && e.data.event === "ready") {
                if (interval) {
                    clearInterval(interval);
                }
                resolve();
            }
        });

        const interval = setInterval(
            () =>
                window.postMessage({
                    source: "decoratorClient",
                    event: "ready",
                }),
            100,
        );
    });

const ssr = base.extend({
    page: async ({ page }, use) => {
        await page.goto("http://localhost:8089");
        await page.evaluate(decoratorReady);
        await use(page);
    },
});

const nextPagesRouter = base.extend({
    page: async ({ page }, use) => {
        await page.goto("http://localhost:3000");
        await page.evaluate(decoratorReady);
        await use(page);
    },
});

const csr = base.extend({
    page: async ({ page }, use) => {
        await page.goto("http://localhost:8080/csr.html");
        await page.evaluate(decoratorReady);
        await use(page);
    },
});

export const test = (
    name: string,
    fn: (args: { page: Page }) => Promise<void>,
) => {
    [
        { test: csr, name: "csr" },
        { test: ssr, name: "ssr" },
        { test: nextPagesRouter, name: "next pages router" },
    ].forEach(({ test, name: fixtureName }) =>
        test(`${fixtureName}: ${name}`, fn),
    );
};

const ssrWithUmamiMock = base.extend({
    page: async ({ page }, use) => {
        await setupUmamiMock(page);
        await page.goto("http://localhost:8089");
        await page.evaluate(decoratorReady);
        await use(page);
    },
});

const csrWithUmamiMock = base.extend({
    page: async ({ page }, use) => {
        await setupUmamiMock(page);
        await page.goto("http://localhost:8080/csr.html");
        await page.evaluate(decoratorReady);
        await use(page);
    },
});

const nextPagesRouterWithUmamiMock = base.extend({
    page: async ({ page }, use) => {
        await setupUmamiMock(page);
        await page.goto("http://localhost:3000");
        await page.evaluate(decoratorReady);
        await use(page);
    },
});

export const testWithUmamiMock = (
    name: string,
    fn: (args: { page: Page }) => Promise<void>,
) => {
    [
        { test: csrWithUmamiMock, name: "csr" },
        { test: ssrWithUmamiMock, name: "ssr" },
        { test: nextPagesRouterWithUmamiMock, name: "next pages router" },
    ].forEach(({ test, name: fixtureName }) =>
        test(`${fixtureName}: ${name}`, fn),
    );
};

export const waitForDecoratorReady = (page: Page) =>
    page.evaluate(decoratorReady);

export const nextPagesRouterUrl = "http://localhost:3000";

export const testNextPagesRouter = nextPagesRouter;
