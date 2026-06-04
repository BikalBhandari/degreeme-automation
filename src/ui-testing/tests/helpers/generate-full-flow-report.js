/**
 * Generates a human-readable HTML report for all 27 full-flow quiz paths.
 * Usage: npm run report:full-flow
 * 
 * Runs each path sequentially, captures degree cards, and produces quiz-full-flow-report.html.
 * Also reminds to open the Playwright report for detailed traces.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { FULL_PATHS } = require('../tests/data/quiz-paths');

const ANIMATION_MESSAGES = ['Analyzing your answers', 'Searching degrees and certificates'];

async function runPath(pathConfig) {
  const steps = [];
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const start = Date.now();
  try {
    await page.goto(process.env.BASE_URL || 'https://nonprod-degree-me.edpl.us/');
    await page.locator('button:has-text("Take the quiz")').click();
    await page.getByRole('heading', { name: 'What are you interested in pursuing?' }).waitFor({ state: 'visible', timeout: 30000 });
    steps.push({ name: 'Start Quiz', status: 'pass' });

    await page.getByText(pathConfig.degreeType, { exact: true }).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.getByText('Education status').waitFor({ state: 'visible', timeout: 30000 });
    steps.push({ name: 'Degree Type', status: 'pass', detail: pathConfig.degreeType });

    await page.getByText(pathConfig.educationStatus).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.getByText('Interest areas').waitFor({ state: 'visible', timeout: 30000 });
    steps.push({ name: 'Education Status', status: 'pass', detail: pathConfig.educationStatus });

    await page.locator(`p.m-0:text-is("${pathConfig.interest}")`).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.locator(`p.m-0:text-is("${pathConfig.subInterests[0]}")`).waitFor({ state: 'visible', timeout: 30000 });
    steps.push({ name: 'Interest Area', status: 'pass', detail: pathConfig.interest });

    for (const sub of pathConfig.subInterests) await page.locator(`p.m-0:text-is("${sub}")`).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.getByText('Environments').waitFor({ state: 'visible', timeout: 30000 });
    steps.push({ name: 'Sub-Interests', status: 'pass', detail: pathConfig.subInterests.join(', ') });

    for (const env of pathConfig.environments) await page.getByText(env, { exact: true }).click();
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.getByText('Preferences').waitFor({ state: 'visible', timeout: 30000 });
    steps.push({ name: 'Environments', status: 'pass', detail: pathConfig.environments.join(', ') });

    for (const pref of pathConfig.preferences) await page.getByText(pref, { exact: true }).click();
    await page.getByRole('button', { name: /Generate results/i }).click();
    steps.push({ name: 'Preferences', status: 'pass', detail: pathConfig.preferences.join(', ') });

    const anim = page.getByText(new RegExp(ANIMATION_MESSAGES.join('|')));
    await anim.first().waitFor({ state: 'visible', timeout: 30000 });
    steps.push({ name: 'Animation', status: 'pass' });

    await page.getByText('Read more').first().waitFor({ state: 'visible', timeout: 180000 });
    steps.push({ name: 'Results', status: 'pass' });

    const cards = await page.locator('text=/Online .+/').filter({ hasNotText: 'ASU Online' }).allInnerTexts();
    const degreeCards = cards.slice(0, 5);
    await browser.close();
    return { path: pathConfig, steps, degreeCards, duration: ((Date.now() - start) / 1000).toFixed(1), pass: true };
  } catch (e) {
    steps.push({ name: 'ERROR', status: 'fail', detail: e.message.split('\n')[0] });
    await browser.close();
    return { path: pathConfig, steps, degreeCards: [], duration: ((Date.now() - start) / 1000).toFixed(1), pass: false };
  }
}

function generateHTML(results) {
  const passed = results.filter(r => r.pass).length;
  const failed = results.length - passed;
  const totalDuration = results.reduce((s, r) => s + parseFloat(r.duration), 0).toFixed(0);

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>DegreeMe Full Flow Report</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;padding:2rem;color:#333}
.container{max-width:1000px;margin:0 auto}
.header{background:#8c1d40;color:white;padding:2rem;border-radius:12px 12px 0 0}
.header h1{font-size:1.5rem;margin-bottom:0.5rem}
.header .meta{display:flex;gap:2rem;font-size:0.9rem;opacity:0.9;flex-wrap:wrap}
.stats{display:flex;gap:1rem;margin-top:1rem}
.stat{background:rgba(255,255,255,0.15);padding:0.5rem 1rem;border-radius:8px;text-align:center}
.stat-val{font-size:1.3rem;font-weight:700}
.stat-lbl{font-size:0.7rem;text-transform:uppercase;opacity:0.8}
.content{background:white;padding:2rem;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.1)}
.section-title{font-size:1.1rem;font-weight:600;margin:1.5rem 0 0.75rem;padding-bottom:0.5rem;border-bottom:2px solid #f0f0f0}
.section-title:first-child{margin-top:0}
.test-row{display:grid;grid-template-columns:auto 1fr auto auto;gap:0.75rem;align-items:center;padding:0.6rem 0.75rem;border-radius:6px;margin-bottom:0.4rem;background:#fafafa;list-style:none}
.test-row:hover{background:#f0f0f0}
.icon{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;flex-shrink:0}
.icon.pass{background:#dcfce7;color:#16a34a}
.icon.fail{background:#fee2e2;color:#dc2626}
.test-name{font-size:0.9rem;font-weight:500}
.test-dur{font-size:0.8rem;color:#888}
.test-cards{font-size:0.8rem;color:#666}
details{margin-bottom:0.3rem}
details summary{cursor:pointer;padding:0.5rem;border-radius:6px;display:grid;grid-template-columns:auto 1fr auto auto;gap:0.75rem;align-items:center}
details summary:hover{background:#f0f0f0}
.card-list{list-style:none;padding:0.5rem 0 0.5rem 2.5rem}
.card-list li{font-size:0.85rem;padding:0.3rem 0;border-bottom:1px solid #f5f5f5;color:#555}
.card-list li:last-child{border:none}
.error-msg{color:#dc2626;font-weight:500;font-size:0.85rem;padding:0.3rem 0}
.footer{text-align:center;margin-top:1.5rem;color:#999;font-size:0.8rem}
</style></head><body><div class="container">
<div class="header">
<h1>🎓 DegreeMe Full Flow Test Report</h1>
<div class="meta"><span>${new Date().toLocaleString()}</span><span>Environment: ${process.env.BASE_URL || 'nonprod'}</span><span>Browser: Chromium</span></div>
<div class="stats">
<div class="stat"><div class="stat-val">${results.length}</div><div class="stat-lbl">Total</div></div>
<div class="stat"><div class="stat-val" style="color:#86efac">${passed}</div><div class="stat-lbl">Passed</div></div>
<div class="stat"><div class="stat-val" style="color:#fca5a5">${failed}</div><div class="stat-lbl">Failed</div></div>
<div class="stat"><div class="stat-val">${totalDuration}s</div><div class="stat-lbl">Duration</div></div>
</div></div>
<div class="content">
${['Undergraduate degree', 'Graduate degree', 'Graduate certificate'].map(dt => {
    const group = results.filter(r => r.path.degreeType === dt);
    const gp = group.filter(r => r.pass).length;
    return `<div class="section-title">${dt} (${gp}/${group.length} passed)</div>
${group.map(r => `<details>
<summary>
<span class="icon ${r.pass ? 'pass' : 'fail'}">${r.pass ? '✓' : '✗'}</span>
<span class="test-name">${r.path.interest}</span>
<span class="test-dur">${r.duration}s</span>
<span class="test-cards">${r.degreeCards.length} cards</span>
</summary>
<ul class="card-list">${r.degreeCards.map((c, i) => `<li>${i + 1}. ${c}</li>`).join('')}
${r.pass ? '' : `<li class="error-msg">${r.steps[r.steps.length - 1].detail || 'Failed'}</li>`}</ul>
</details>`).join('')}`;
  }).join('')}
</div>
<div class="footer">DegreeMe Automation • ASU Online • 27 full-flow paths (3 degree types × 9 interest areas)<br>
For detailed traces and screenshots, run: <code>npx playwright show-report</code></div>
</div></body></html>`;
}

(async () => {
  console.log('Generating full-flow report for all 27 paths...');
  console.log('This takes ~10-15 minutes.\n');
  const results = [];
  for (let i = 0; i < FULL_PATHS.length; i++) {
    const p = FULL_PATHS[i];
    process.stdout.write(`  [${i + 1}/27] ${p.degreeType} — ${p.interest}... `);
    const r = await runPath(p);
    console.log(r.pass ? `✓ ${r.duration}s` : '✗ FAILED');
    results.push(r);
  }

  const reportPath = path.join(__dirname, '..', '..', '..', '..', 'quiz-full-flow-report.html');
  fs.writeFileSync(reportPath, generateHTML(results));

  const passed = results.filter(r => r.pass).length;
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Results: ${passed}/${results.length} passed`);
  console.log(`Custom report:     open ${reportPath}`);
  console.log(`Playwright report: npx playwright show-report`);
  console.log(`${'='.repeat(50)}`);
})();
