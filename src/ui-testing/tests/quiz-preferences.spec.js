// Spec: src/ui-testing/specs/quiz-preferences.md
const { test, expect } = require('@playwright/test');
const { navigateToInterestDrilldown, TRANSITION_TIMEOUT } = require('./helpers/quiz-navigation');

// Helper to navigate to Preferences
async function navigateToPreferences(page) {
  await navigateToInterestDrilldown(page, ['Technology']);
  await page.getByText('General technology').click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByText('Environments').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  // Skip Environments
  await page.getByRole('button', { name: 'Skip to next question' }).first().click();
  await page.getByText('Preferences').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
}

test.describe('Quiz - Preferences', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToPreferences(page);
  });

  test('displays preferences screen', async ({ page }) => {
    await expect(page.getByText('Preferences')).toBeVisible();
    await expect(page.getByRole('heading', { name: /What do you think you'd enjoy/ })).toBeVisible();
    await expect(page.locator('.select-all-text:visible').first()).toBeVisible();
  });

  test('shows all 12 preference options', async ({ page }) => {
    const options = [
      'Designing or managing projects',
      'Solving complex problems with data',
      'Collaborating with others',
      'Working with diverse communities',
      'Teaching or mentoring others',
      'Working at the intersection of tech and people',
      'Exploring global or political systems',
      'Helping others in crisis or recovery situations',
      'Improving education through new technology',
      'Designing sustainable or nature-inspired solutions',
      'Managing nonprofit or mission-driven organizations',
      'Communicating complex ideas across diverse audiences',
    ];
    for (const option of options) {
      await expect(page.getByText(option, { exact: true })).toBeVisible();
    }
  });

  test('allows selecting multiple options', async ({ page }) => {
    await page.getByText('Solving complex problems with data').click();
    await page.getByText('Collaborating with others').click();
    await page.getByText('Teaching or mentoring others').click();
  });

  test('skip to results advances to results page', async ({ page }) => {
    test.setTimeout(120000);
    await page.getByRole('button', { name: 'Skip to results' }).first().click();
    await page.getByText('Read more').first().waitFor({ state: 'visible', timeout: 90000 });
  });

  test('back returns to environments', async ({ page }) => {
    await page.getByRole('button', { name: 'Back' }).last().click();
    await page.getByText('Environments').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  });
});
