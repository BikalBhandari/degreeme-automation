// Spec: src/ui-testing/specs/quiz-degree-type-selection.md
const { test, expect } = require('@playwright/test');
const { startQuiz, TRANSITION_TIMEOUT } = require('./helpers/quiz-navigation');

test.describe('Quiz - Degree Type Selection', () => {
  test.beforeEach(async ({ page }) => {
    await startQuiz(page);
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
    await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue/ })).toBeVisible();
  });

  test('can select Undergraduate degree and continue', async ({ page }) => {
    await page.getByText('Undergraduate degree').click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.getByText('Education status').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  });

  test('can select Graduate degree and continue', async ({ page }) => {
    await page.getByText('Graduate degree', { exact: true }).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.getByText('Education status').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  });

  test('can select Graduate certificate and continue', async ({ page }) => {
    await page.getByText('Graduate certificate', { exact: true }).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.getByText('Education status').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  });

  test('Back link returns to homepage', async ({ page }) => {
    await page.getByRole('button', { name: 'Back' }).click();
    await page.locator('button:has-text("Take the quiz")').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  });
});
