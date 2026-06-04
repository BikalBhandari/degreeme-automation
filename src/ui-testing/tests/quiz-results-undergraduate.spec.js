const { test, expect } = require('@playwright/test');
const { navigateToInterestAreas, TRANSITION_TIMEOUT } = require('./helpers/quiz-navigation');
const { PATHS } = require('./data/quiz-paths');

const undergraduatePaths = PATHS.filter((p) => p.degreeType === 'Undergraduate degree');

async function navigateToResults(page, path) {
  await navigateToInterestAreas(page, { degreeType: path.degreeType });
  await page.locator(`p.m-0:text-is("${path.interest}")`).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.locator(`p.m-0:text-is("${path.subInterest}")`).waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.locator(`p.m-0:text-is("${path.subInterest}")`).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByText('Environments').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.getByRole('button', { name: 'Skip to next question' }).first().click();
  await page.getByText('Preferences').waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
  await page.getByRole('button', { name: 'Skip to results' }).first().click();
  await page.getByText('Read more').first().waitFor({ state: 'visible', timeout: 90000 });
}

for (const path of undergraduatePaths) {
  test.describe(`Undergraduate Results — ${path.interest}`, () => {
    test.setTimeout(120000);

    test(`displays 5 degree cards`, async ({ page }) => {
      await navigateToResults(page, path);
      const readMoreLinks = page.getByText('Read more');
      await expect(readMoreLinks).toHaveCount(5);
    });

    test(`results show Undergraduate label`, async ({ page }) => {
      await navigateToResults(page, path);
      const labels = page.getByText('Undergraduate', { exact: true });
      const count = await labels.count();
      expect(count).toBeGreaterThanOrEqual(5);
    });

    test(`results are Bachelor programs`, async ({ page }) => {
      await navigateToResults(page, path);
      const cards = page.locator('text=/Online .+ of .+/');
      const count = await cards.count();
      for (let i = 0; i < count; i++) {
        const name = await cards.nth(i).innerText();
        expect(name.toLowerCase()).toContain('bachelor');
      }
    });

    test(`results are relevant to ${path.interest}`, async ({ page }) => {
      await navigateToResults(page, path);
      const cards = page.locator('text=/Online .+ of .+/');
      const count = await cards.count();
      const irrelevant = [];
      for (let i = 0; i < count; i++) {
        const name = (await cards.nth(i).innerText()).toLowerCase();
        if (!path.keywords.some((kw) => name.includes(kw))) {
          irrelevant.push(name);
        }
      }
      if (irrelevant.length > 0) console.log(`Potentially irrelevant for ${path.interest}:`, irrelevant);
      expect(irrelevant.length).toBeLessThanOrEqual(1);
    });

    test(`+ button reveals 5 more cards`, async ({ page }) => {
      await navigateToResults(page, path);
      const plusButton = page.locator('button:has-text("+"), [class*="plus"], [class*="expand"]').first();
      await plusButton.click();
      await page.getByText('Read more').nth(9).waitFor({ state: 'visible', timeout: TRANSITION_TIMEOUT });
      const readMoreLinks = page.getByText('Read more');
      await expect(readMoreLinks).toHaveCount(10);
    });
  });
}
