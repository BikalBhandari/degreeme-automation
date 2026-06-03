// Spec: src/ui-testing/specs/quiz-interest-areas.md
const { test, expect } = require('@playwright/test');
const { navigateToInterestAreas } = require('./helpers/quiz-navigation');

test.describe('Quiz - Interest Areas', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToInterestAreas(page);
  });

  test('displays interest areas screen', async ({ page }) => {
    await expect(page.getByText('Interest areas')).toBeVisible();
    await expect(page.getByRole('heading', { name: /What fields excite you the most/ })).toBeVisible();
    await expect(page.getByText('Select all that apply:')).toBeVisible();
  });

  test('shows all 9 interest fields', async ({ page }) => {
    const fields = [
      'Arts, culture and society',
      'Business',
      'Education',
      'Engineering',
      'Health and nursing',
      'Law, compliance and public service',
      'Science',
      'Social and behavioral sciences',
      'Technology',
    ];
    for (const field of fields) {
      await expect(page.getByRole('paragraph').filter({ hasText: field })).toBeVisible();
    }
  });

  test('continue is disabled without selection', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Continue/ })).toBeDisabled();
  });

  test('continue becomes enabled after selecting a field', async ({ page }) => {
    await page.getByRole('paragraph').filter({ hasText: 'Business' }).click();
    await expect(page.getByRole('button', { name: /Continue/ })).toBeEnabled();
  });

  test('allows selecting multiple fields', async ({ page }) => {
    await page.getByRole('paragraph').filter({ hasText: 'Business' }).click();
    await page.getByRole('paragraph').filter({ hasText: 'Engineering' }).click();
    await page.getByRole('paragraph').filter({ hasText: 'Technology' }).click();
    await expect(page.getByRole('button', { name: /Continue/ })).toBeEnabled();
  });

  test('continue advances to drilldown for selected field', async ({ page }) => {
    await page.getByRole('paragraph').filter({ hasText: 'Business' }).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: /What area of.*Business/ })).toBeVisible();
  });

  test('back returns to education status', async ({ page }) => {
    await page.getByRole('link', { name: 'Back' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: /Do you currently have any of the following/ })).toBeVisible();
  });
});
