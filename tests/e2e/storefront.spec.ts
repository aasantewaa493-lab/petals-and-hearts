import { test, expect } from "@playwright/test";

test("homepage and shop are reachable", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: /shop bouquets/i }).first().click();
  await expect(page).toHaveURL(/shop/);
});
