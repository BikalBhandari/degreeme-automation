// Spec: src/ui-testing/specs/quiz-full-flow.md
const { test, expect } = require('@playwright/test');
const { startQuiz, TRANSITION_TIMEOUT } = require('./helpers/quiz-navigation');
const { FULL_PATHS } = require('./data/quiz-paths');
const fs = require('fs');
const nodePath = require('path');

const ANIMATION_MESSAGES = [
  'Analyzing your answers',
  'Searching degrees and certificates',
];

const RESULTS_FILE = nodePath.join(__dirname, '..', '..', '..', 'full-flow-test-results.json');

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
    fs.writeFileSync(RESULTS_FILE, JSON.stringify({ timestamp: new Date().toISOString(), results: [result] }, null, 2));
  }
}

for (const quizPath of FULL_PATHS) {
  test(`Full flow — ${quizPath.degreeType} — ${quizPath.interest}`, async ({ page }) => {
    test.setTimeout(210000);
    const steps = [];
    const start = Date.now();
    let degreeCards = [];

    try {
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
      steps.push({ name: 'Animation', status: 'pass' });

      await page.getByText('Read more').first().waitFor({ state: 'visible', timeout: 180000 });
      await expect(page.getByText('Read more')).toHaveCount(5);
      steps.push({ name: 'Results', status: 'pass' });

      const cards = page.locator('text=/Online .+/').filter({ hasNotText: 'ASU Online' });
      degreeCards = (await cards.allInnerTexts()).slice(0, 5);

      const graduateKeywords = ['master', 'doctor', 'ms ', 'ms\n', 'ma ', 'mba', 'med', 'juris', 'llm'];
      const count = await cards.count();
      for (let i = 0; i < count && i < 5; i++) {
        const name = (await cards.nth(i).innerText()).toLowerCase();
        if (quizPath.degreeLevelKeyword === 'master') {
          const isGraduate = graduateKeywords.some(kw => name.includes(kw));
          expect(isGraduate, `Expected graduate program, got: ${name}`).toBeTruthy();
        } else {
          expect(name).toContain(quizPath.degreeLevelKeyword);
        }
      }

      await expect(page.getByText('Request Info')).toBeVisible();
      await expect(page.getByText('Restart')).toBeVisible();

      appendResult({
        degreeType: quizPath.degreeType,
        interest: quizPath.interest,
        degreeLevelKeyword: quizPath.degreeLevelKeyword,
        steps,
        degreeCards,
        pass: true,
        error: '',
        duration: ((Date.now() - start) / 1000).toFixed(1),
      });
    } catch (e) {
      steps.push({ name: 'ERROR', status: 'fail', detail: e.message.split('\n')[0] });
      appendResult({
        degreeType: quizPath.degreeType,
        interest: quizPath.interest,
        degreeLevelKeyword: quizPath.degreeLevelKeyword,
        steps,
        degreeCards,
        pass: false,
        error: e.message.split('\n')[0],
        duration: ((Date.now() - start) / 1000).toFixed(1),
      });
      throw e;
    }
  });
}
