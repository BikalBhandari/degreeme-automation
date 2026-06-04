const { test, expect } = require('@playwright/test');
const { navigateToInterestAreas, TRANSITION_TIMEOUT } = require('./helpers/quiz-navigation');
const { PATHS } = require('./data/quiz-paths');
const fs = require('fs');
const path = require('path');

const RESULTS_FILE = path.join(__dirname, '..', '..', '..', 'results-certificate-test-results.json');
const certificatePaths = PATHS.filter((p) => p.degreeType === 'Graduate certificate');

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

async function navigateToResults(page, pathConfig) {
  await navigateToInterestAreas(page, { degreeType: pathConfig.degreeType });
  await page.locator(`p.m-0:text-is("${pathConfig.interest}")`).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.locator(`p.m-0:text-is("${pathConfig.subInterest}")`).waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.locator(`p.m-0:text-is("${pathConfig.subInterest}")`).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByText('Environments').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.getByRole('button', { name: 'Skip to next question' }).first().click();
  await page.getByText('Preferences').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.getByRole('button', { name: 'Skip to results' }).first().click();
  await page.getByText('Read more').first().waitFor({ state: 'visible', timeout: 90000 });
}

for (const quizPath of certificatePaths) {
  test.describe(`Certificate Results — ${quizPath.interest}`, () => {
    test.setTimeout(120000);

    test(`displays 5 degree cards`, async ({ page }) => {
      const start = Date.now();
      let degreeCards = [];
      let relevanceResults = [];
      try {
        await navigateToResults(page, quizPath);
        const readMoreLinks = page.getByText('Read more');
        await expect(readMoreLinks).toHaveCount(5);

        const cards = page.locator('text=/Online .+ of .+/');
        const count = await cards.count();
        for (let i = 0; i < count; i++) {
          const name = await cards.nth(i).innerText();
          const relevant = quizPath.keywords.some(kw => name.toLowerCase().includes(kw));
          degreeCards.push(name);
          relevanceResults.push({ card: name, relevant });
        }

        appendResult({
          degreeType: 'Graduate certificate',
          interest: quizPath.interest,
          subInterest: quizPath.subInterest,
          degreeCards,
          relevanceResults,
          pass: true,
          error: '',
          duration: ((Date.now() - start) / 1000).toFixed(1),
        });
      } catch (e) {
        appendResult({
          degreeType: 'Graduate certificate',
          interest: quizPath.interest,
          subInterest: quizPath.subInterest,
          degreeCards,
          relevanceResults,
          pass: false,
          error: e.message.split('\n')[0],
          duration: ((Date.now() - start) / 1000).toFixed(1),
        });
        throw e;
      }
    });

    test(`results show Graduate certificate label`, async ({ page }) => {
      await navigateToResults(page, quizPath);
      const labels = page.getByText('Graduate certificate', { exact: true });
      const count = await labels.count();
      expect(count).toBeGreaterThanOrEqual(5);
    });

    test(`results are Certificate programs`, async ({ page }) => {
      await navigateToResults(page, quizPath);
      const cards = page.locator('text=/Online .+/').filter({ hasNotText: 'ASU Online' });
      const count = await cards.count();
      for (let i = 0; i < count && i < 5; i++) {
        const name = await cards.nth(i).innerText();
        expect(name.toLowerCase()).toContain('certificate');
      }
    });

    test(`results are relevant to ${quizPath.interest}`, async ({ page }) => {
      await navigateToResults(page, quizPath);
      const cards = page.locator('text=/Online .+/').filter({ hasNotText: 'ASU Online' });
      const count = await cards.count();
      const irrelevant = [];
      for (let i = 0; i < count && i < 5; i++) {
        const name = (await cards.nth(i).innerText()).toLowerCase();
        if (!quizPath.keywords.some((kw) => name.includes(kw))) {
          irrelevant.push(name);
        }
      }
      if (irrelevant.length > 0) console.log(`Potentially irrelevant for ${quizPath.interest}:`, irrelevant);
      expect(irrelevant.length).toBeLessThanOrEqual(1);
    });

    test(`+ button reveals 5 more cards`, async ({ page }) => {
      await navigateToResults(page, quizPath);
      const plusButton = page.locator('button:has-text("+"), [class*="plus"], [class*="expand"]').first();
      await plusButton.click();
      await page.getByText('Read more').nth(9).waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
      const readMoreLinks = page.getByText('Read more');
      await expect(readMoreLinks).toHaveCount(10);
    });
  });
}
