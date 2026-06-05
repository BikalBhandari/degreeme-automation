// Spec: src/ui-testing/specs/quiz-negative-scenarios.md
const { test, expect } = require('@playwright/test');
const { navigateToInterestAreas, TRANSITION_TIMEOUT } = require('./helpers/quiz-navigation');

const QUIZ_SERVICE_URL = '**/nonprod-degree-me-service*';

// Navigate to Preferences screen (no skips — app won't prefetch results)
async function navigateToPreferences(page) {
  await navigateToInterestAreas(page, { degreeType: 'Undergraduate degree' });
  await page.locator('p.m-0:text-is("Technology")').click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.locator('p.m-0:text-is("General technology")').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.locator('p.m-0:text-is("General technology")').click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByText('Environments').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.getByText('Fast-paced', { exact: true }).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByText('Preferences').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.getByText('Solving complex problems with data', { exact: true }).click();
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
    await navigateToPreferences(page);

    // Intercept the service URL — block all responses after this point
    await page.route(QUIZ_SERVICE_URL, route => {
      // Never respond — simulates timeout
    });

    await page.getByRole('button', { name: /Generate results/i }).click();

    // Should show animation initially
    const animation = page.getByText(/Analyzing your answers|Searching degrees/);
    await animation.first().waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

    // Wait for timeout message to appear (the app should show something after its internal timeout)
    const errorMessage = page.locator('text=/try again|timed out|error|something went wrong/i');
    await errorMessage.first().waitFor({ state: 'visible', timeout: 120000 });
    await expect(errorMessage.first()).toBeVisible();
  });

  test('Network failure shows error/retry message', async ({ page }) => {
    await navigateToPreferences(page);

    // Intercept the service URL and abort
    await page.route(QUIZ_SERVICE_URL, route => {
      route.abort('failed');
    });

    await page.getByRole('button', { name: /Generate results/i }).click();

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
    await page.locator('#email').fill('fakeinvalid-notreal');
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

test.describe('Negative Scenarios — RFI Form Validation', () => {
  test.setTimeout(120000);

  const submitBtn = (page) => page.getByRole('button', { name: /submit/i });

  test('Submit disabled on initial load', async ({ page }) => {
    await navigateToRfiModal(page);
    await expect(submitBtn(page)).toBeDisabled();
  });

  test('Submit disabled: First Name empty', async ({ page }) => {
    await navigateToRfiModal(page);
    await page.locator('#last-name').fill('embtestScenario');
    await page.locator('#email').fill('edplusqatest+neg@gmail.com');
    await page.locator('#asuonline_phone_number_id').fill('6025551234');
    await page.locator('#military-false').click();
    await expect(submitBtn(page)).toBeDisabled();
  });

  test('Submit disabled: Last Name empty', async ({ page }) => {
    await navigateToRfiModal(page);
    await page.locator('#first-name').fill('embtestNegative');
    await page.locator('#email').fill('edplusqatest+neg@gmail.com');
    await page.locator('#asuonline_phone_number_id').fill('6025551234');
    await page.locator('#military-false').click();
    await expect(submitBtn(page)).toBeDisabled();
  });

  test('Submit disabled: Email empty', async ({ page }) => {
    await navigateToRfiModal(page);
    await page.locator('#first-name').fill('embtestNegative');
    await page.locator('#last-name').fill('embtestScenario');
    await page.locator('#asuonline_phone_number_id').fill('6025551234');
    await page.locator('#military-false').click();
    await expect(submitBtn(page)).toBeDisabled();
  });

  test('Submit disabled: Phone Number empty', async ({ page }) => {
    await navigateToRfiModal(page);
    await page.locator('#first-name').fill('embtestNegative');
    await page.locator('#last-name').fill('embtestScenario');
    await page.locator('#email').fill('edplusqatest+neg@gmail.com');
    await page.locator('#military-false').click();
    await expect(submitBtn(page)).toBeDisabled();
  });

  test('Submit rejected: Invalid email format', async ({ page }) => {
    await navigateToRfiModal(page);
    await page.locator('#first-name').fill('embtestNegative');
    await page.locator('#last-name').fill('embtestScenario');
    await page.locator('#email').fill('fakeinvalid-notreal');
    await page.locator('#asuonline_phone_number_id').fill('6025551234');
    await page.locator('#military-false').click();
    await submitBtn(page).click();
    const error = page.locator('text=/valid email|invalid email|enter a valid/i');
    await expect(error.first()).toBeVisible({ timeout: 15000 });
  });

  test('Submit rejected: Invalid phone format', async ({ page }) => {
    await navigateToRfiModal(page);
    await page.locator('#first-name').fill('embtestNegative');
    await page.locator('#last-name').fill('embtestScenario');
    await page.locator('#email').fill('edplusqatest+neg@gmail.com');
    await page.locator('#asuonline_phone_number_id').fill('123');
    await page.locator('#military-false').click();
    await submitBtn(page).click();
    const error = page.locator('text=/valid phone|invalid phone|enter a valid/i');
    await expect(error.first()).toBeVisible({ timeout: 15000 });
  });

  test('Submit disabled: Military not selected', async ({ page }) => {
    await navigateToRfiModal(page);
    await page.locator('#first-name').fill('embtestNegative');
    await page.locator('#last-name').fill('embtestScenario');
    await page.locator('#email').fill('edplusqatest+neg@gmail.com');
    await page.locator('#asuonline_phone_number_id').fill('6025551234');
    await expect(submitBtn(page)).toBeDisabled();
  });
});
