/**
 * Tests for common results page UI elements (shared across all degree types).
 * Runs once with Undergraduate + Technology as a representative path.
 */
const { test, expect } = require('@playwright/test');
const { navigateToInterestAreas, TRANSITION_TIMEOUT } = require('./helpers/quiz-navigation');

async function navigateToResults(page) {
  await navigateToInterestAreas(page, { degreeType: 'Undergraduate degree' });
  await page.locator('p.m-0:text-is("Technology")').click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.locator('p.m-0:text-is("General technology")').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.locator('p.m-0:text-is("General technology")').click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByText('Environments').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.getByRole('button', { name: 'Skip to next question' }).first().click();
  await page.getByText('Preferences').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.getByRole('button', { name: 'Skip to results' }).first().click();
  await page.getByText('Read more').first().waitFor({ state: 'visible', timeout: 90000 });
}

test.describe('Results Page — Common UI Elements', () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    await navigateToResults(page);
  });

  test('displays ASU logo', async ({ page }) => {
    await expect(page.locator('button[aria-label*="Arizona State University"]')).toBeVisible();
  });

  test('displays Restart button', async ({ page }) => {
    await expect(page.getByText('Restart')).toBeVisible();
  });

  test('displays Request Info button', async ({ page }) => {
    await expect(page.getByText('Request Info')).toBeVisible();
  });

  test('displays instructional text', async ({ page }) => {
    await expect(page.getByText(/Expand the cards to see why each program/)).toBeVisible();
  });

  test('displays 5 initial degree cards', async ({ page }) => {
    const readMoreLinks = page.getByText('Read more');
    await expect(readMoreLinks).toHaveCount(5);
  });

  test('displays + button', async ({ page }) => {
    const plusButton = page.locator('button:has-text("+"), [class*="plus"], [class*="expand"]').first();
    await expect(plusButton).toBeVisible();
  });

  test('+ button reveals 5 additional cards (10 total)', async ({ page }) => {
    const plusButton = page.locator('button:has-text("+"), [class*="plus"], [class*="expand"]').first();
    await plusButton.click();
    await page.getByText('Read more').nth(9).waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
    const readMoreLinks = page.getByText('Read more');
    await expect(readMoreLinks).toHaveCount(10);
  });
});
