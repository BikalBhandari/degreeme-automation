// Spec: src/ui-testing/specs/quiz-education-status.md
const { test, expect } = require('@playwright/test');
const { navigateToEducationStatus, TRANSITION_TIMEOUT } = require('./helpers/quiz-navigation');

test.describe('Quiz - Education Status', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToEducationStatus(page);
  });

  test('displays education status screen', async ({ page }) => {
    await expect(page.getByText('Education status')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Do you currently have any of the following/ })).toBeVisible();
    await expect(page.getByText('Select all that apply:')).toBeVisible();
  });

  test('shows all credential options', async ({ page }) => {
    const options = [
      'High school diploma or GED',
      'Associate of Arts (AA) or Science (AS)',
      'Associate of Applied Science (AAS)',
      'Bachelor of Arts (BA)',
      'Bachelor of Science (BS)',
      'Master of Arts (MA)',
      'Master of Science (MS)',
      'Master of Business Administration (MBA)',
      'Registered Nurse (RN) license',
      'Teaching certification or licensure',
      'Paralegal certificate or law-related training',
      'Military or veteran',
    ];
    for (const option of options) {
      await expect(page.getByText(option, { exact: true })).toBeVisible();
    }
  });

  test('allows selecting multiple options', async ({ page }) => {
    await page.getByText('High school diploma or GED').click();
    await page.getByText('Bachelor of Arts (BA)').click();
    // Both should be selected — Continue button should be available
    await expect(page.getByRole('button', { name: /Continue/ })).toBeVisible();
  });

  test('skip advances to interest areas', async ({ page }) => {
    await page.getByRole('button', { name: 'Skip to next question' }).first().click();
    await page.getByText('Interest areas').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  });

  test('back returns to degree type selection', async ({ page }) => {
    await page.getByRole('button', { name: 'Back' }).click();
    await page.getByRole('heading', { name: 'What are you interested in pursuing?' }).waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  });
});
