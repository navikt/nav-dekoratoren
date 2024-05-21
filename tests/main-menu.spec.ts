// eslint-disable-next-line @typescript-eslint/no-var-requires
const { test, expect } = require("@playwright/test");

test("main menu", async ({ page }) => {
    await page.goto("http://localhost:8089");
    await page.getByRole("button", { name: "Meny" }).click();
    await expect(page.getByText("Hva kan vi hjelpe deg med?")).toBeVisible();
});
