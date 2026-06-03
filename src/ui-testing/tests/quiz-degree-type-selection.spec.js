// Spec: src/ui-testing/specs/quiz-degree-type-selection.md
const { test, expect } = require('@playwright/test');

test.describe('Quiz - Degree Type Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('button:has-text("Take the quiz")').click();
    await page.waitForTimeout(2000);
  });

  test('displays degree type selection screen', async ({ page }) => {
    await expect(page.getByText('Online programs')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'What are you interested in pursuing?' })).toBeVisible();
    await expect(page.getByText('Must select one:')).toBeVisible();
  });

  test('shows three degree type cards', async ({ page }) => {
    await expect(page.getByText('Undergraduate degree')).toBeVisible();
    await expect(page.getByText('Graduate degree', { exact: true })).toBeVisible();
    await expect(page.getByText('Graduate certificate', { exact: true })).toBeVisible();
  });

  test('shows navigation controls', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Back' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue/ })).toBeVisible();
  });

  test('can select Undergraduate degree and continue', async ({ page }) => {
    await page.getByText('Undergraduate degree').click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: 'What are you interested in pursuing?' })).not.toBeVisible();
  });

  test('can select Graduate degree and continue', async ({ page }) => {
    await page.getByText('Graduate degree', { exact: true }).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: 'What are you interested in pursuing?' })).not.toBeVisible();
  });

  test('can select Graduate certificate and continue', async ({ page }) => {
    await page.getByText('Graduate certificate', { exact: true }).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: 'What are you interested in pursuing?' })).not.toBeVisible();
  });

  test('Back link returns to homepage', async ({ page }) => {
    await page.getByRole('link', { name: 'Back' }).click();
    await page.waitForTimeout(1000);
    await expect(page.locator('button:has-text("Take the quiz")')).toBeVisible();
  });
});
