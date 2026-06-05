/**
 * Shared navigation helpers for quiz test suite.
 * Each function navigates to a specific quiz screen and waits for it to render.
 */

const TRANSITION_TIMEOUT = 30000;

async function startQuiz(page) {
  await page.goto('/');
  await page.locator('button:has-text("Take the quiz")').click();
  // Wait for degree type screen to appear
  await page.getByRole('heading', { name: 'What are you interested in pursuing?' }).waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
}

async function navigateToEducationStatus(page, degreeType = 'Undergraduate degree') {
  await startQuiz(page);
  await page.getByText(degreeType).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  // Wait for education status screen
  await page.getByText('Education status').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
}

async function navigateToInterestAreas(page, { degreeType = 'Undergraduate degree', skipEducation = true } = {}) {
  await navigateToEducationStatus(page, degreeType);
  if (skipEducation) {
    await page.getByRole('button', { name: 'Skip to next question' }).first().click();
  } else {
    await page.getByRole('button', { name: /Continue/ }).click();
  }
  // Wait for interest areas screen
  await page.getByText('Interest areas').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
}

async function navigateToInterestDrilldown(page, fields = ['Business'], options = {}) {
  await navigateToInterestAreas(page, options);
  for (const field of fields) {
    await page.locator(`p.m-0:text-is("${field}")`).click();
  }
  await page.getByRole('button', { name: /Continue/ }).click();
  // Wait for drilldown to render
  await page.getByText('Select all that apply:').nth(1).waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT }).catch(() => {});
}

module.exports = {
  TRANSITION_TIMEOUT,
  startQuiz,
  navigateToEducationStatus,
  navigateToInterestAreas,
  navigateToInterestDrilldown,
};
