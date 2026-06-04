// Spec: src/ui-testing/specs/quiz-full-flow.md
const { test, expect } = require('@playwright/test');
const { startQuiz, TRANSITION_TIMEOUT } = require('./helpers/quiz-navigation');
const { FULL_PATHS } = require('./data/quiz-paths');

const ANIMATION_MESSAGES = [
  'Analyzing your answers',
  'Searching degrees and certificates',
];

for (const path of FULL_PATHS) {
  test(`Full flow — ${path.degreeType} — ${path.interest}`, async ({ page }) => {
    test.setTimeout(210000);

    // Step 1: Start quiz
    await startQuiz(page);

    // Step 2: Select degree type
    await page.getByText(path.degreeType, { exact: true }).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.getByText('Education status').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

    // Step 3: Select education status
    await page.getByText(path.educationStatus).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.getByText('Interest areas').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

    // Step 4: Select interest area
    await page.locator(`p.m-0:text-is("${path.interest}")`).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.locator(`p.m-0:text-is("${path.subInterests[0]}")`).waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

    // Step 5: Select sub-interests (2 options)
    for (const sub of path.subInterests) {
      await page.locator(`p.m-0:text-is("${sub}")`).click();
    }
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.getByText('Environments').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

    // Step 6: Select environments (2 options)
    for (const env of path.environments) {
      await page.getByText(env, { exact: true }).click();
    }
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.getByText('Preferences').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

    // Step 7: Select preferences (2 options)
    for (const pref of path.preferences) {
      await page.getByText(pref, { exact: true }).click();
    }
    await page.getByRole('button', { name: /Generate results/i }).click();

    // Step 8: Assert animation message appears
    const animationLocator = page.getByText(new RegExp(ANIMATION_MESSAGES.join('|')));
    await animationLocator.first().waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });

    // Step 9: Wait for results to load
    await page.getByText('Read more').first().waitFor({ state: 'visible', timeout: 180000 });

    // Assertions
    // A: 5 degree cards displayed
    const readMoreLinks = page.getByText('Read more');
    await expect(readMoreLinks).toHaveCount(5);

    // B: Cards are correct degree level
    const cards = page.locator('text=/Online .+/').filter({ hasNotText: 'ASU Online' });
    const count = await cards.count();
    const graduateKeywords = ['master', 'doctor', 'ms ', 'ms\n', 'ma ', 'mba', 'med', 'juris', 'llm'];
    for (let i = 0; i < count && i < 5; i++) {
      const name = (await cards.nth(i).innerText()).toLowerCase();
      if (path.degreeLevelKeyword === 'master') {
        const isGraduate = graduateKeywords.some(kw => name.includes(kw));
        expect(isGraduate, `Expected graduate program, got: ${name}`).toBeTruthy();
      } else {
        expect(name).toContain(path.degreeLevelKeyword);
      }
    }

    // C: Request Info button visible
    await expect(page.getByText('Request Info')).toBeVisible();

    // D: Restart button visible
    await expect(page.getByText('Restart')).toBeVisible();
  });
}
