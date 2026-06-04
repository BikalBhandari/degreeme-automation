// Spec: src/ui-testing/specs/quiz-accessibility.md
const { test, expect } = require('@playwright/test');
const { navigateToInterestAreas, TRANSITION_TIMEOUT } = require('./helpers/quiz-navigation');

// Navigate to RFI modal
async function openRfiModal(page) {
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

test.describe('Accessibility — RFI Modal', () => {
  test.setTimeout(120000);

  test('Keyboard Focus Trap in RFI Modal', async ({ page }) => {
    await openRfiModal(page);

    // Tab through all focusable elements in the modal
    const modalFocusableSelector = '.modal-container input, .modal-container button, .modal-container [tabindex="0"]';
    const focusableCount = await page.locator(modalFocusableSelector).count();
    expect(focusableCount).toBeGreaterThan(0);

    // Press Tab multiple times (more than focusable elements) and verify focus stays in modal
    for (let i = 0; i < focusableCount + 3; i++) {
      await page.keyboard.press('Tab');
    }

    // After tabbing past all elements, focus should wrap back into the modal
    const activeElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.closest('.modal-container') !== null : false;
    });
    expect(activeElement).toBeTruthy();
  });

  test('Screen Reader Labeling (Aria-labels)', async ({ page }) => {
    await openRfiModal(page);

    // First name has associated label
    const firstName = page.locator('#first-name');
    const firstNameLabel = await firstName.evaluate(el => {
      const label = document.querySelector(`label[for="${el.id}"]`);
      return label ? label.textContent.trim() : el.getAttribute('aria-label');
    });
    expect(firstNameLabel).toContain('First name');

    // Last name has associated label
    const lastName = page.locator('#last-name');
    const lastNameLabel = await lastName.evaluate(el => {
      const label = document.querySelector(`label[for="${el.id}"]`);
      return label ? label.textContent.trim() : el.getAttribute('aria-label');
    });
    expect(lastNameLabel).toContain('Last name');

    // Email has associated label
    const email = page.locator('#email');
    const emailLabel = await email.evaluate(el => {
      const label = document.querySelector(`label[for="${el.id}"]`);
      return label ? label.textContent.trim() : el.getAttribute('aria-label');
    });
    expect(emailLabel).toContain('Email');

    // Phone has a label
    const phoneLabel = page.locator('.phone-field-label');
    await expect(phoneLabel).toBeVisible();
    const phoneLabelText = await phoneLabel.textContent();
    expect(phoneLabelText).toContain('Phone');

    // Military radio group has aria-labelledby
    const radioGroup = page.locator('[role="radiogroup"]');
    const labelledBy = await radioGroup.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
  });

  test('Color Contrast Ratio', async ({ page }) => {
    await openRfiModal(page);

    // Check submit button contrast (text on background)
    const contrast = await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (!btn) return 0;
      const style = window.getComputedStyle(btn);
      const bg = style.backgroundColor;
      const color = style.color;
      // Parse RGB values
      const parseRgb = (str) => str.match(/\d+/g)?.map(Number) || [0, 0, 0];
      const luminance = (rgb) => {
        const [r, g, b] = rgb.map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const l1 = luminance(parseRgb(color));
      const l2 = luminance(parseRgb(bg));
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      return ratio;
    });
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });

  test('Visual Focus Indicators', async ({ page }) => {
    await openRfiModal(page);

    // Tab to first input
    await page.keyboard.press('Tab');

    // Check that focused element has a visible outline or box-shadow
    const hasFocusIndicator = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const style = window.getComputedStyle(el);
      const outline = style.outline;
      const boxShadow = style.boxShadow;
      // Has non-zero outline or box-shadow
      return (outline && !outline.includes('0px') && outline !== 'none') ||
             (boxShadow && boxShadow !== 'none');
    });
    expect(hasFocusIndicator).toBeTruthy();
  });

  test('Modal Closure via Esc Key', async ({ page }) => {
    await openRfiModal(page);

    // Verify modal is open
    await expect(page.getByText('Connect with us')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Modal should close
    await page.getByText('Connect with us').waitFor({ state: 'hidden', timeout: 5000 });

    // Results page should be visible again
    await expect(page.getByText('Read more').first()).toBeVisible();
  });

  test('Alt Text for Form Icons', async ({ page }) => {
    await openRfiModal(page);

    // Close button must have aria-label
    const closeBtn = page.locator('[aria-label="Close modal"]');
    await expect(closeBtn).toBeVisible();
    const ariaLabel = await closeBtn.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });
});
