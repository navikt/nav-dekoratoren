import AxeBuilder from "@axe-core/playwright";
import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("should not have any automatically detectable accessibility issues", async ({
    page,
}) => {
    const accessibilityScanResults = await new AxeBuilder({
        page: page as any,
    }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
});
