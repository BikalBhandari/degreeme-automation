// Spec: src/ui-testing/specs/quiz-negative-scenarios.md
const { test, expect } = require('@playwright/test');
const { startQuiz, navigateToInterestAreas, TRANSITION_TIMEOUT } = require('./helpers/quiz-navigation');

const QUIZ_SESSION_URL = '**/quiz-session';

// Navigate to the point just before results are generated
async function navigateToGenerateResults(page) {
  await navigateToInterestAreas(page, { degreeType: 'Undergraduate degree' });
  await page.locator('p.m-0:text-is("Technology")').click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.locator('p.m-0:text-is("General technology")').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.locator('p.m-0:text-is("General technology")').click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByText('Environments').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.getByRole('button', { name: 'Skip to next question' }).first().click();
  await page.getByText('Preferences').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
}

// Navigate to RFI modal
async function navigateToRfiModal(page) {
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
  await page.getByRole('button', { name: 'Request Info' }).first().click();
  await page.getByText('Connect with us').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
}

test.describe('Negative Scenarios — AI & Network Failures', () => {
  test.setTimeout(180000);

  test('AI timeout shows error/retry message', async ({ page }) => {
    await navigateToGenerateResults(page);

    // Intercept only POST to quiz-session (the results generation call)
    await page.route(QUIZ_SESSION_URL, route => {
      if (route.request().method() === 'POST') {
        // Never respond — simulates timeout
        return;
      }
      route.continue();
    });

    await page.getByRole('button', { name: 'Skip to results' }).first().click();

    // Should show animation initially
    const animation = page.getByText(/Analyzing your answers|Searching degrees/);
    await animation.first().waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

    // Wait for timeout message to appear (the app should show something after its internal timeout)
    const errorMessage = page.locator('text=/try again|timed out|error|something went wrong/i');
    await errorMessage.first().waitFor({ state: 'visible', timeout: 120000 });
    await expect(errorMessage.first()).toBeVisible();
  });

  test('Network failure shows error/retry message', async ({ page }) => {
    await navigateToGenerateResults(page);

    // Intercept only POST to quiz-session and abort
    await page.route(QUIZ_SESSION_URL, route => {
      if (route.request().method() === 'POST') {
        route.abort('failed');
        return;
      }
      route.continue();
    });

    await page.getByRole('button', { name: 'Skip to results' }).first().click();

    // Should show an error message
    const errorMessage = page.locator('text=/try again|error|something went wrong|unable/i');
    await errorMessage.first().waitFor({ state: 'visible', timeout: 30000 });
    await expect(errorMessage.first()).toBeVisible();
  });
});

test.describe('Negative Scenarios — BritVerify Rejection', () => {
  test.setTimeout(120000);

  test('invalid email shows inline error', async ({ page }) => {
    await navigateToRfiModal(page);

    await page.locator('#first-name').fill('embtestNegative');
    await page.locator('#last-name').fill('embtestScenario');
    await page.locator('#email').fill('fakeinvalid@notreal.xyz');
    await page.locator('#asuonline_phone_number_id').fill('6025551234');
    await page.locator('#military-false').click();

    // Tab away from email to trigger validation
    await page.locator('#asuonline_phone_number_id').click();

    // Wait for inline error
    const emailError = page.locator('text=/valid email|invalid email|enter a valid/i');
    await emailError.first().waitFor({ state: 'visible', timeout: 15000 });
    await expect(emailError.first()).toBeVisible();
  });

  test('invalid phone shows inline error', async ({ page }) => {
    await navigateToRfiModal(page);

    await page.locator('#first-name').fill('embtestNegative');
    await page.locator('#last-name').fill('embtestScenario');
    await page.locator('#email').fill('edplusqatest+negative@gmail.com');
    await page.locator('#asuonline_phone_number_id').fill('0000000000');
    await page.locator('#military-false').click();

    // Tab away from phone to trigger validation
    await page.locator('#first-name').click();

    // Wait for inline error
    const phoneError = page.locator('text=/valid phone|invalid phone|enter a valid/i');
    await phoneError.first().waitFor({ state: 'visible', timeout: 15000 });
    await expect(phoneError.first()).toBeVisible();
  });
});
