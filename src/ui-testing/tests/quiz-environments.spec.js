// Spec: src/ui-testing/specs/quiz-environments.md
const { test, expect } = require('@playwright/test');
const { navigateToInterestDrilldown } = require('./helpers/quiz-navigation');

// Helper to get past drilldowns to Environments
async function navigateToEnvironments(page) {
  await navigateToInterestDrilldown(page, ['Technology']);
  await page.getByText('General technology').click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.waitForTimeout(1000);
}

test.describe('Quiz - Environments', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToEnvironments(page);
  });

  test('displays environments screen', async ({ page }) => {
    await expect(page.getByText('Environments')).toBeVisible();
    await expect(page.getByRole('heading', { name: /What kind of work environment/ })).toBeVisible();
    await expect(page.getByText('Select all that apply:')).toBeVisible();
  });

  test('shows all 7 environment options', async ({ page }) => {
    const options = [
      'Fast-paced',
      'Team-oriented',
      'Independent and research-driven',
      'Creative and flexible',
      'Tech-focused and data-driven',
      'Hands-on',
      'Mission and community-driven',
    ];
    for (const option of options) {
      await expect(page.getByText(option, { exact: true })).toBeVisible();
    }
  });

  test('allows selecting multiple options', async ({ page }) => {
    await page.getByText('Fast-paced').click();
    await page.getByText('Tech-focused and data-driven').click();
    await expect(page.getByRole('button', { name: /Continue|Skip/ }).first()).toBeEnabled();
  });

  test('skip advances to preferences', async ({ page }) => {
    await page.getByRole('button', { name: 'Skip to next question' }).first().click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Preferences')).toBeVisible();
  });

  test('back returns to last drilldown', async ({ page }) => {
    await page.getByRole('link', { name: 'Back' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: /What area of.*Technology/ })).toBeVisible();
  });
});
