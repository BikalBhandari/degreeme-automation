// Spec: src/ui-testing/specs/homepage.md
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('loads correctly with expected title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/DegreeMe/i);
  });

  test('loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(Date.now() - start).toBeLessThan(5000);
  });

  test('has no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    expect(errors).toHaveLength(0);
  });
});
