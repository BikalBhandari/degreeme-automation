/**
 * Custom HTML report generator for quiz path test runs.
 * Usage: node src/ui-testing/tests/helpers/generate-report.js
 * 
 * Runs a quiz path and generates a human-readable HTML report.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const degreeType = args[0] || 'Undergraduate degree';
const educationStatus = args[1] || 'skip';
const interestArea = args[2] || 'Arts, culture and society';
const subInterest = args[3] || 'General arts, culture and society';

async function runQuizPath() {
  const steps = [];
  const startTime = Date.now();

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(process.env.BASE_URL || 'https://nonprod-degree-me.edpl.us/');

    // Step 1: Take the quiz
    await page.locator('button:has-text("Take the quiz")').click();
    await page.getByRole('heading', { name: 'What are you interested in pursuing?' }).waitFor({ state: 'visible', timeout: 30000 });
    steps.push({ name: 'Take the Quiz', status: 'pass', detail: 'Degree type screen loaded' });

    // Step 2: Select degree type
    await page.getByText(degreeType).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.getByText('Education status').waitFor({ state: 'visible', timeout: 30000 });
    steps.push({ name: 'Select Degree Type', status: 'pass', detail: degreeType });

    // Step 3: Education status
    if (educationStatus !== 'skip') {
      await page.getByText(educationStatus).click();
      await page.getByRole('button', { name: /Continue/ }).click();
    } else {
      await page.getByRole('button', { name: 'Skip to next question' }).first().click();
    }
    await page.getByText('Interest areas').waitFor({ state: 'visible', timeout: 30000 });
    steps.push({ name: 'Education Status', status: 'pass', detail: educationStatus === 'skip' ? 'Skipped' : educationStatus });

    // Step 4: Interest area
    await page.locator(`p.m-0:text-is("${interestArea}")`).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.locator(`p.m-0:text-is("${subInterest}")`).waitFor({ state: 'visible', timeout: 30000 });
    steps.push({ name: 'Select Interest Area', status: 'pass', detail: interestArea });

    // Step 5: Sub-interest
    await page.locator(`p.m-0:text-is("${subInterest}")`).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.getByText('Environments').waitFor({ state: 'visible', timeout: 30000 });
    steps.push({ name: 'Select Sub-Interest', status: 'pass', detail: subInterest });

    // Step 6: Skip environments
    await page.getByRole('button', { name: 'Skip to next question' }).first().click();
    await page.getByText('Preferences').waitFor({ state: 'visible', timeout: 30000 });
    steps.push({ name: 'Environments', status: 'pass', detail: 'Skipped' });

    // Step 7: Skip to results
    await page.getByRole('button', { name: 'Skip to results' }).first().click();
    await page.getByText('Read more').first().waitFor({ state: 'visible', timeout: 90000 });
    steps.push({ name: 'Generate Results', status: 'pass', detail: 'AI recommendations loaded' });

    // Extract degree cards
    const cards = page.locator('text=/Online .+ of .+/');
    const count = await cards.count();
    const degreeCards = [];
    const keywords = subInterest.toLowerCase().split(/[\s,()\/]+/).filter(w => w.length >= 4);

    for (let i = 0; i < count && i < 5; i++) {
      const name = await cards.nth(i).innerText();
      const isRelevant = keywords.some(kw => name.toLowerCase().includes(kw));
      degreeCards.push({ name, relevant: isRelevant });
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    await browser.close();

    return { steps, degreeCards, duration, error: null };
  } catch (e) {
    steps.push({ name: 'Error', status: 'fail', detail: e.message });
    await browser.close();
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    return { steps, degreeCards: [], duration, error: e.message };
  }
}

function generateHTML(result) {
  const relevantCount = result.degreeCards.filter(c => c.relevant).length;
  const totalCards = result.degreeCards.length;
  const overallPass = result.error === null && relevantCount >= totalCards - 1;
  const timestamp = new Date().toLocaleString();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DegreeMe Quiz Test Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 2rem; color: #333; }
    .container { max-width: 800px; margin: 0 auto; }
    .header { background: #8c1d40; color: white; padding: 2rem; border-radius: 12px 12px 0 0; }
    .header h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .header p { opacity: 0.9; font-size: 0.9rem; }
    .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; margin-top: 0.5rem; }
    .badge-pass { background: #22c55e; color: white; }
    .badge-fail { background: #ef4444; color: white; }
    .content { background: white; padding: 2rem; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .section { margin-bottom: 2rem; }
    .section h2 { font-size: 1.1rem; margin-bottom: 1rem; color: #555; border-bottom: 2px solid #f0f0f0; padding-bottom: 0.5rem; }
    .config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .config-item { background: #f9f9f9; padding: 0.75rem; border-radius: 8px; }
    .config-item label { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .config-item p { font-size: 0.95rem; margin-top: 0.25rem; font-weight: 500; }
    .steps { list-style: none; }
    .step { display: flex; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f0f0f0; }
    .step:last-child { border-bottom: none; }
    .step-icon { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 1rem; font-size: 0.75rem; flex-shrink: 0; }
    .step-icon.pass { background: #dcfce7; color: #22c55e; }
    .step-icon.fail { background: #fee2e2; color: #ef4444; }
    .step-name { font-weight: 500; min-width: 160px; }
    .step-detail { color: #666; font-size: 0.9rem; }
    .cards { list-style: none; }
    .card { display: flex; align-items: center; padding: 0.75rem; margin-bottom: 0.5rem; background: #f9f9f9; border-radius: 8px; border-left: 4px solid; }
    .card.relevant { border-color: #22c55e; }
    .card.irrelevant { border-color: #f59e0b; }
    .card-icon { margin-right: 0.75rem; font-size: 1.1rem; }
    .card-name { font-size: 0.9rem; }
    .summary { display: flex; gap: 1.5rem; flex-wrap: wrap; }
    .stat { background: #f9f9f9; padding: 1rem; border-radius: 8px; text-align: center; flex: 1; min-width: 120px; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: #8c1d40; }
    .stat-label { font-size: 0.75rem; color: #888; text-transform: uppercase; margin-top: 0.25rem; }
    .footer { text-align: center; margin-top: 1.5rem; color: #999; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 DegreeMe Quiz Test Report</h1>
      <p>${timestamp} • Duration: ${result.duration}s</p>
      <span class="badge ${overallPass ? 'badge-pass' : 'badge-fail'}">${overallPass ? '✓ PASS' : '✗ FAIL'}</span>
    </div>
    <div class="content">
      <div class="section">
        <h2>Quiz Configuration</h2>
        <div class="config-grid">
          <div class="config-item"><label>Degree Type</label><p>${degreeType}</p></div>
          <div class="config-item"><label>Education Status</label><p>${educationStatus === 'skip' ? 'Skipped' : educationStatus}</p></div>
          <div class="config-item"><label>Interest Area</label><p>${interestArea}</p></div>
          <div class="config-item"><label>Sub-Interest</label><p>${subInterest}</p></div>
        </div>
      </div>

      <div class="section">
        <h2>Test Steps</h2>
        <ul class="steps">
          ${result.steps.map(s => `
          <li class="step">
            <div class="step-icon ${s.status}">${s.status === 'pass' ? '✓' : '✗'}</div>
            <span class="step-name">${s.name}</span>
            <span class="step-detail">${s.detail}</span>
          </li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <h2>Recommended Degrees (${totalCards} cards)</h2>
        <ul class="cards">
          ${result.degreeCards.map((c, i) => `
          <li class="card ${c.relevant ? 'relevant' : 'irrelevant'}">
            <span class="card-icon">${c.relevant ? '✓' : '⚠️'}</span>
            <span class="card-name">${i + 1}. ${c.name}</span>
          </li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <h2>Summary</h2>
        <div class="summary">
          <div class="stat"><div class="stat-value">${totalCards}</div><div class="stat-label">Cards Returned</div></div>
          <div class="stat"><div class="stat-value">${relevantCount}/${totalCards}</div><div class="stat-label">Relevant</div></div>
          <div class="stat"><div class="stat-value">${result.duration}s</div><div class="stat-label">Duration</div></div>
          <div class="stat"><div class="stat-value">${overallPass ? 'PASS' : 'FAIL'}</div><div class="stat-label">Result</div></div>
        </div>
      </div>
    </div>
    <div class="footer">DegreeMe Automation • ASU Online • Environment: ${process.env.BASE_URL || 'nonprod'}</div>
  </div>
</body>
</html>`;
}

(async () => {
  console.log(`Running: ${degreeType} → ${educationStatus} → ${interestArea} → ${subInterest}`);
  console.log('Please wait ~30-60s for AI results...\n');

  const result = await runQuizPath();

  const reportPath = path.join(__dirname, '..', '..', '..', '..', 'quiz-report.html');
  fs.writeFileSync(reportPath, generateHTML(result));
  console.log(`\nReport saved: ${reportPath}`);
  console.log(`Open with: open ${reportPath}`);
})();
