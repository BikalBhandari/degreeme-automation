// Spec: src/ui-testing/specs/quiz-interest-drilldown.md
const { test, expect } = require('@playwright/test');
const { navigateToInterestDrilldown } = require('./helpers/quiz-navigation');

test.describe('Quiz - Interest Drilldown (Business)', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToInterestDrilldown(page, ['Business']);
  });

  test('displays Business drilldown screen', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /What area of.*Business/ })).toBeVisible();
    await expect(page.getByText('Select all that apply:')).toBeVisible();
  });

  test('shows Business sub-options', async ({ page }) => {
    const options = [
      'General business',
      'Business studies',
      'Corporate accounting or financial planning',
      'Economics and finance',
      'Leadership and management',
      'Marketing and communication',
      'Project management',
    ];
    for (const option of options) {
      await expect(page.getByText(option, { exact: true })).toBeVisible();
    }
  });

  test('continue is disabled without selection', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Continue/ })).toBeDisabled();
  });

  test('continue becomes enabled after selection', async ({ page }) => {
    await page.getByText('General business').click();
    await expect(page.getByRole('button', { name: /Continue/ })).toBeEnabled();
  });

  test('advances to Environments after completing drilldown', async ({ page }) => {
    await page.getByText('General business').click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Environments')).toBeVisible();
  });

  test('back returns to interest areas', async ({ page }) => {
    await page.getByRole('link', { name: 'Back' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: /What fields excite you the most/ })).toBeVisible();
  });
});

test.describe('Quiz - Interest Drilldown (multiple fields)', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToInterestDrilldown(page, ['Business', 'Technology']);
  });

  test('shows tab header with both fields', async ({ page }) => {
    await expect(page.getByText('Business | Technology')).toBeVisible();
  });

  test('completing first drilldown advances to second', async ({ page }) => {
    await page.getByText('General business').click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: /What area of.*Technology/ })).toBeVisible();
  });

  test('completing all drilldowns advances to Environments', async ({ page }) => {
    // Complete Business
    await page.getByText('General business').click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.waitForTimeout(1000);
    // Complete Technology
    await page.getByText('General technology').click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Environments')).toBeVisible();
  });
});
