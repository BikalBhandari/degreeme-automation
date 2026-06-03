const { test, expect } = require('@playwright/test');
const { navigateToInterestAreas } = require('./helpers/quiz-navigation');
const { PATHS } = require('./data/quiz-paths');

const certificatePaths = PATHS.filter((p) => p.degreeType === 'Graduate certificate');

async function navigateToResults(page, path) {
  await navigateToInterestAreas(page, { degreeType: path.degreeType });
  await page.locator(`p.m-0:text-is("${path.interest}")`).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.locator('text=/What area of/').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator(`p.m-0:text-is("${path.subInterest}")`).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByText('Environments').waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('button', { name: 'Skip to next question' }).first().click();
  await page.getByText('Preferences').waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('button', { name: 'Skip to results' }).first().click();
  await page.getByText('Read more').first().waitFor({ state: 'visible', timeout: 60000 });
  await page.waitForTimeout(1000);
}

for (const path of certificatePaths) {
  test.describe(`Certificate Results — ${path.interest}`, () => {
    test.setTimeout(90000);

    test(`displays 5 degree cards`, async ({ page }) => {
      await navigateToResults(page, path);
      const readMoreLinks = page.getByText('Read more');
      await expect(readMoreLinks).toHaveCount(5);
    });

    test(`results show Graduate certificate label`, async ({ page }) => {
      await navigateToResults(page, path);
      const labels = page.getByText(/Graduate certificate/i);
      const count = await labels.count();
      expect(count).toBeGreaterThanOrEqual(5);
    });

    test(`results are certificate programs`, async ({ page }) => {
      await navigateToResults(page, path);
      const cards = page.locator('text=/Online .+/');
      const count = await cards.count();
      let certCount = 0;
      for (let i = 0; i < count; i++) {
        const name = (await cards.nth(i).innerText()).toLowerCase();
        if (name.includes('certificate')) certCount++;
      }
      expect(certCount).toBeGreaterThanOrEqual(3);
    });

    test(`results are relevant to ${path.interest}`, async ({ page }) => {
      await navigateToResults(page, path);
      const cards = page.locator('text=/Online .+/');
      const count = await cards.count();
      const irrelevant = [];
      for (let i = 0; i < count; i++) {
        const name = (await cards.nth(i).innerText()).toLowerCase();
        if (name.includes('online') && !path.keywords.some((kw) => name.includes(kw))) {
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
      await page.waitForTimeout(2000);
      const readMoreLinks = page.getByText('Read more');
      await expect(readMoreLinks).toHaveCount(10);
    });
  });
}
