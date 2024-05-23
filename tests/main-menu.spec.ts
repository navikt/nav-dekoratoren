import { test, expect } from "@playwright/test";

test("main menu", async ({ page }) => {
    await page.goto("http://localhost:8089");
    await page.getByRole("button", { name: "Meny" }).click();
    await expect(page.getByText("Hva kan vi hjelpe deg med?")).toBeVisible();
});
