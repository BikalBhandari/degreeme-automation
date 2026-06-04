/**
 * Discovery test — early warning if quiz content changes.
 * If this test fails, update src/ui-testing/tests/data/quiz-paths.js to match.
 */
const { test, expect } = require('@playwright/test');
const { startQuiz, navigateToEducationStatus, navigateToInterestAreas, navigateToInterestDrilldown } = require('./helpers/quiz-navigation');
const { DEGREE_TYPES, EDUCATION_STATUS_OPTIONS, INTEREST_AREAS, SUB_INTERESTS } = require('./data/quiz-paths');

test.describe('Quiz Discovery — Verify quiz options match config', () => {
  test('degree type options match expected list', async ({ page }) => {
    await startQuiz(page);
    for (const type of DEGREE_TYPES) {
      await expect(page.getByText(type, { exact: true })).toBeVisible();
    }
  });

  test('interest area options match expected list', async ({ page }) => {
    await navigateToInterestAreas(page);
    for (const field of INTEREST_AREAS) {
      await expect(page.locator(`p.m-0:text-is("${field}")`)).toBeVisible();
    }
  });

  test('education status options match expected list', async ({ page }) => {
    await navigateToEducationStatus(page);
    for (const option of EDUCATION_STATUS_OPTIONS) {
      await expect(page.getByText(option, { exact: true })).toBeVisible();
    }
  });

  for (const interest of INTEREST_AREAS) {
    test(`sub-interests for "${interest}" match expected list`, async ({ page }) => {
      await navigateToInterestDrilldown(page, [interest]);
      const expected = SUB_INTERESTS[interest];
      for (const sub of expected) {
        await expect(page.locator(`p.m-0:text-is("${sub}")`)).toBeVisible();
      }
    });
  }
});
