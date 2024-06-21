import AxeBuilder from "@axe-core/playwright";
import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("should not have any automatically detectable accessibility issues", async ({
    page,
}) => {
    await page.goto("http://localhost:8089");
    await page.waitForSelector("button");

    const accessibilityScanResults = await new AxeBuilder({
        page,
    }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
});
