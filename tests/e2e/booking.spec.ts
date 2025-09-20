import { test, expect } from '@playwright/test';

test.describe('booking flow', () => {
  test('visit home and view packages', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('text=Ghaya Travel');
    await page.goto('http://localhost:3000/en/packages');
    await expect(page.locator('article').first()).toBeVisible();
  });
});
