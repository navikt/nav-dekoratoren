import {
    Page,
    PlaywrightTestArgs,
    PlaywrightTestOptions,
    PlaywrightWorkerArgs,
    PlaywrightWorkerOptions,
    TestType,
    test as base,
} from "@playwright/test";

const ssr = base.extend({
    page: async ({ page }, use) => {
        await page.goto("http://localhost:8089");
        await use(page);
    },
});

const nextPagesRouter = base.extend({
    page: async ({ page }, use) => {
        await page.goto("http://localhost:3000");
        await use(page);
    },
});

const csr = base.extend({
    page: async ({ page }, use) => {
        await page.goto("http://localhost:8080/csr.html");
        await page.getAttribute("html", "data-hj-suppress");
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
