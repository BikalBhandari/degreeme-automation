// Spec: src/ui-testing/specs/quiz-program-card-rfi.md
const { test, expect } = require('@playwright/test');
const { startQuiz, TRANSITION_TIMEOUT } = require('./helpers/quiz-navigation');
const { generateRfiData } = require('./data/rfi-data');
const { FULL_PATHS } = require('./data/quiz-paths');
const fs = require('fs');
const nodePath = require('path');

const ANIMATION_MESSAGES = ['Analyzing your answers', 'Searching degrees and certificates'];
const quizPath = FULL_PATHS.find(p => p.degreeType === 'Undergraduate degree');
const RESULTS_FILE = nodePath.join(__dirname, '..', '..', '..', 'program-card-rfi-test-results.json');

if (!fs.existsSync(RESULTS_FILE)) {
  fs.writeFileSync(RESULTS_FILE, JSON.stringify({ timestamp: new Date().toISOString(), results: [] }));
}

function appendResult(result) {
  try {
    const existing = fs.existsSync(RESULTS_FILE)
      ? JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'))
      : { timestamp: new Date().toISOString(), results: [] };
    existing.results.push(result);
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(existing, null, 2));
  } catch (e) {
    fs.writeFileSync(RESULTS_FILE, JSON.stringify({ timestamp: new Date().toISOString(), results: [result] }, null, 2));
  }
}

async function completeQuizToResults(page) {
  await startQuiz(page);
  await page.getByText(quizPath.degreeType, { exact: true }).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByText('Education status').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

  await page.getByText(quizPath.educationStatus).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByText('Interest areas').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

  await page.locator(`p.m-0:text-is("${quizPath.interest}")`).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.locator(`p.m-0:text-is("${quizPath.subInterests[0]}")`).waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

  for (const sub of quizPath.subInterests) await page.locator(`p.m-0:text-is("${sub}")`).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByText('Environments').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

  for (const env of quizPath.environments) await page.getByText(env, { exact: true }).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByText('Preferences').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

  for (const pref of quizPath.preferences) await page.getByText(pref, { exact: true }).click();
  await page.getByRole('button', { name: /Generate results/i }).click();

  const anim = page.getByText(new RegExp(ANIMATION_MESSAGES.join('|')));
  await anim.first().waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.getByText('Read more').first().waitFor({ state: 'visible', timeout: 180000 });
  await expect(page.getByText('Read more')).toHaveCount(5);
}

async function submitPageLevelRfi(page, index) {
  const rfi = generateRfiData(index);
  await page.getByRole('button', { name: 'Request Info' }).first().click();
  await page.getByText('Connect with us').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

  await page.locator('#first-name').fill(rfi.firstName);
  await page.locator('#last-name').fill(rfi.lastName);
  await page.locator('#email').fill(rfi.email);
  await page.locator('#asuonline_phone_number_id').fill(rfi.phone);
  await page.locator(rfi.military === 'Yes' ? '#military-true' : '#military-false').click();

  const submitBtn = page.getByRole('button', { name: /submit/i });
  await expect(submitBtn).toBeEnabled();
  await submitBtn.click();

  await page.locator('text=/be in touch/i').first().waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.locator('[aria-label="Close modal"]').click();
  await page.getByText('Read more').first().waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
}

async function submitProgramCardRfi(page, cardIndex) {
  const rfi = generateRfiData(cardIndex + 10); // offset to avoid same timestamp

  // Expand the card
  const expandButtons = page.locator('button:has-text("Expand card"), button:has-text("Read more")');
  await expandButtons.nth(cardIndex).click();

  // Wait for program details modal with "Connect with us" button
  await page.getByRole('button', { name: 'Connect with us' }).waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.getByRole('button', { name: 'Connect with us' }).click();

  // Wait for RFI form to appear (first-name field indicates form is loaded)
  await page.locator('#first-name').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

  await page.locator('#first-name').fill(rfi.firstName);
  await page.locator('#last-name').fill(rfi.lastName);
  await page.locator('#email').fill(rfi.email);
  await page.locator('#asuonline_phone_number_id').fill(rfi.phone);
  await page.locator(rfi.military === 'Yes' ? '#military-true' : '#military-false').click();

  const submitBtn = page.getByRole('button', { name: /submit/i });
  await expect(submitBtn).toBeEnabled();
  await submitBtn.click();

  // Confirmation
  await page.locator('text=/be in touch/i').first().waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

  // Close with the resize/collapse button (↗ icon at top-right of modal)
  const closeBtn = page.locator('button:has(svg), [class*="close"], [class*="collapse"]').filter({ has: page.locator('svg') }).first();
  await closeBtn.click();

  // Wait for results page to be visible again
  await page.getByText('Read more').first().waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
}

test.describe('Program Card RFI', () => {
  test.setTimeout(300000);

  test('Page-level + first card RFI submission', async ({ page }) => {
    const start = Date.now();
    const steps = [];
    const rfiSubmissions = [];
    try {
      await completeQuizToResults(page);
      steps.push({ name: 'Quiz Completed', status: 'pass' });

      const pageRfi = generateRfiData(0);
      await submitPageLevelRfi(page, 0);
      steps.push({ name: 'Page-level RFI', status: 'pass' });
      rfiSubmissions.push({ type: 'UNDECIDED', ...pageRfi });

      await submitProgramCardRfi(page, 0);
      const cardRfi = generateRfiData(10);
      steps.push({ name: 'Card 1 RFI', status: 'pass' });
      rfiSubmissions.push({ type: 'Program-specific', card: 1, ...cardRfi });

      appendResult({ test: 'first-card', steps, rfiSubmissions, pass: true, error: '', duration: ((Date.now() - start) / 1000).toFixed(1) });
    } catch (e) {
      steps.push({ name: 'ERROR', status: 'fail', detail: e.message.split('\n')[0] });
      appendResult({ test: 'first-card', steps, rfiSubmissions, pass: false, error: e.message.split('\n')[0], duration: ((Date.now() - start) / 1000).toFixed(1) });
      throw e;
    }
  });

  test('Page-level + all 5 cards RFI submission', async ({ page }) => {
    const start = Date.now();
    const steps = [];
    const rfiSubmissions = [];
    try {
      await completeQuizToResults(page);
      steps.push({ name: 'Quiz Completed', status: 'pass' });

      const pageRfi = generateRfiData(0);
      await submitPageLevelRfi(page, 0);
      steps.push({ name: 'Page-level RFI', status: 'pass' });
      rfiSubmissions.push({ type: 'UNDECIDED', ...pageRfi });

      for (let i = 0; i < 5; i++) {
        await submitProgramCardRfi(page, i);
        const cardRfi = generateRfiData(i + 10);
        steps.push({ name: `Card ${i + 1} RFI`, status: 'pass' });
        rfiSubmissions.push({ type: 'Program-specific', card: i + 1, ...cardRfi });
      }

      appendResult({ test: 'all-cards', steps, rfiSubmissions, pass: true, error: '', duration: ((Date.now() - start) / 1000).toFixed(1) });
    } catch (e) {
      steps.push({ name: 'ERROR', status: 'fail', detail: e.message.split('\n')[0] });
      appendResult({ test: 'all-cards', steps, rfiSubmissions, pass: false, error: e.message.split('\n')[0], duration: ((Date.now() - start) / 1000).toFixed(1) });
      throw e;
    }
  });
});
