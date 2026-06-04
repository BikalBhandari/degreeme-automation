// Spec: src/ui-testing/specs/quiz-full-flow-withRFI.md
const { test, expect } = require('@playwright/test');
const { startQuiz, TRANSITION_TIMEOUT } = require('./helpers/quiz-navigation');
const { FULL_PATHS } = require('./data/quiz-paths');
const { generateRfiData } = require('./data/rfi-data');
const fs = require('fs');
const nodePath = require('path');

const ANIMATION_MESSAGES = [
  'Analyzing your answers',
  'Searching degrees and certificates',
];

const RESULTS_FILE = nodePath.join(__dirname, '..', '..', '..', 'rfi-test-results.json');

// One path per degree type (first entry of each)
const RFI_PATHS = [
  FULL_PATHS.find(p => p.degreeType === 'Undergraduate degree'),
  FULL_PATHS.find(p => p.degreeType === 'Graduate degree'),
  FULL_PATHS.find(p => p.degreeType === 'Graduate certificate'),
];

// Initialize results file at start
test.beforeAll(() => {
  fs.writeFileSync(RESULTS_FILE, JSON.stringify({ timestamp: new Date().toISOString(), results: [] }));
});

function appendResult(result) {
  try {
    const existing = fs.existsSync(RESULTS_FILE)
      ? JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'))
      : { timestamp: new Date().toISOString(), results: [] };
    existing.results.push(result);
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(existing, null, 2));
  } catch (e) {
    // Last resort: write just this result
    fs.writeFileSync(RESULTS_FILE, JSON.stringify({ timestamp: new Date().toISOString(), results: [result] }, null, 2));
  }
}

for (let i = 0; i < RFI_PATHS.length; i++) {
  const quizPath = RFI_PATHS[i];
  test(`Full flow with RFI — ${quizPath.degreeType}`, async ({ page }, testInfo) => {
    test.setTimeout(210000);
    const steps = [];
    const start = Date.now();
    const rfi = generateRfiData(i);

    try {
      // === QUIZ FLOW ===
      await startQuiz(page);
      steps.push({ name: 'Start Quiz', status: 'pass' });

      await page.getByText(quizPath.degreeType, { exact: true }).click();
      await page.getByRole('button', { name: /Continue/ }).click();
      await page.getByText('Education status').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
      steps.push({ name: 'Degree Type', status: 'pass', detail: quizPath.degreeType });

      await page.getByText(quizPath.educationStatus).click();
      await page.getByRole('button', { name: /Continue/ }).click();
      await page.getByText('Interest areas').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
      steps.push({ name: 'Education Status', status: 'pass', detail: quizPath.educationStatus });

      await page.locator(`p.m-0:text-is("${quizPath.interest}")`).click();
      await page.getByRole('button', { name: /Continue/ }).click();
      await page.locator(`p.m-0:text-is("${quizPath.subInterests[0]}")`).waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
      steps.push({ name: 'Interest Area', status: 'pass', detail: quizPath.interest });

      for (const sub of quizPath.subInterests) {
        await page.locator(`p.m-0:text-is("${sub}")`).click();
      }
      await page.getByRole('button', { name: /Continue/ }).click();
      await page.getByText('Environments').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
      steps.push({ name: 'Sub-Interests', status: 'pass', detail: quizPath.subInterests.join(', ') });

      for (const env of quizPath.environments) {
        await page.getByText(env, { exact: true }).click();
      }
      await page.getByRole('button', { name: /Continue/ }).click();
      await page.getByText('Preferences').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
      steps.push({ name: 'Environments', status: 'pass', detail: quizPath.environments.join(', ') });

      for (const pref of quizPath.preferences) {
        await page.getByText(pref, { exact: true }).click();
      }
      await page.getByRole('button', { name: /Generate results/i }).click();
      steps.push({ name: 'Preferences', status: 'pass', detail: quizPath.preferences.join(', ') });

      const animationLocator = page.getByText(new RegExp(ANIMATION_MESSAGES.join('|')));
      await animationLocator.first().waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
      await page.getByText('Read more').first().waitFor({ state: 'visible', timeout: 180000 });
      await expect(page.getByText('Read more')).toHaveCount(5);
      steps.push({ name: 'Results Loaded', status: 'pass' });

      // === RFI SUBMISSION ===
      await page.getByRole('button', { name: 'Request Info' }).first().click();
      await page.getByText('Connect with us').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
      steps.push({ name: 'Modal Opened', status: 'pass' });

      await page.locator('#first-name').fill(rfi.firstName);
      await page.locator('#last-name').fill(rfi.lastName);
      await page.locator('#email').fill(rfi.email);
      await page.locator('#asuonline_phone_number_id').fill(rfi.phone);
      await page.locator(rfi.military === 'Yes' ? '#military-true' : '#military-false').click();
      steps.push({ name: 'Form Filled', status: 'pass' });

      const submitBtn = page.getByRole('button', { name: /submit/i });
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();
      steps.push({ name: 'Submitted', status: 'pass' });

      await page.getByText("We'll be in touch").waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
      steps.push({ name: 'Confirmation', status: 'pass' });

      await page.locator('[aria-label="Close modal"]').click();
      steps.push({ name: 'Modal Closed', status: 'pass' });

      appendResult({
        degreeType: quizPath.degreeType,
        interest: quizPath.interest,
        rfi,
        steps,
        pass: true,
        error: '',
        duration: ((Date.now() - start) / 1000).toFixed(1),
      });
    } catch (e) {
      steps.push({ name: 'ERROR', status: 'fail', detail: e.message.split('\n')[0] });
      appendResult({
        degreeType: quizPath.degreeType,
        interest: quizPath.interest,
        rfi,
        steps,
        pass: false,
        error: e.message.split('\n')[0],
        duration: ((Date.now() - start) / 1000).toFixed(1),
      });
      throw e;
    }
  });
}
