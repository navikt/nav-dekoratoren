import { Page, test as base } from "@playwright/test";

base.beforeEach(async ({ context }) => {
    await context.route("https://amplitude.nav.no/collect", (route) => {
        route.fulfill({ status: 200 });
    });
});

const decoratorReady = () =>
    new Promise<void>((resolve) => {
        window.addEventListener("message", (e) => {
            if (e.data.source === "decorator" && e.data.event === "ready") {
                interval && clearInterval(interval);
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
