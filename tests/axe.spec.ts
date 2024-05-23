import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("a11y", () => {
    test("should not have any automatically detectable accessibility issues", async ({
        page,
    }) => {
        await page.goto("http://localhost:8089");

        const accessibilityScanResults = await new AxeBuilder({
            page,
        }).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
