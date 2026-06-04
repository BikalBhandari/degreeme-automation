/**
 * Generates a human-readable HTML report from full-flow test results JSON.
 * Usage: npm run report:full-flow (after running npx playwright test quiz-full-flow)
 *
 * Reads full-flow-test-results.json and produces quiz-full-flow-report.html.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const RESULTS_FILE = path.join(__dirname, '..', '..', '..', '..', 'full-flow-test-results.json');
const REPORT_FILE = path.join(__dirname, '..', '..', '..', '..', 'quiz-full-flow-report.html');

if (!fs.existsSync(RESULTS_FILE)) {
  console.error('No full-flow-test-results.json found. Run the tests first:\n\n  npx playwright test quiz-full-flow --project=chromium\n');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
const results = data.results;

if (!results.length) {
  console.error('full-flow-test-results.json is empty. Run the tests first.\n');
  process.exit(1);
}

const passed = results.filter(r => r.pass).length;
const failed = results.length - passed;
const totalDuration = results.reduce((s, r) => s + parseFloat(r.duration), 0).toFixed(0);

const html = `<!DOCTYPE html>
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
details{margin-bottom:0.3rem}
details summary{cursor:pointer;padding:0.5rem;border-radius:6px;display:grid;grid-template-columns:auto 1fr auto auto;gap:0.75rem;align-items:center}
details summary:hover{background:#f0f0f0}
.icon{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;flex-shrink:0}
.icon.pass{background:#dcfce7;color:#16a34a}
.icon.fail{background:#fee2e2;color:#dc2626}
.test-name{font-size:0.9rem;font-weight:500}
.test-dur{font-size:0.8rem;color:#888}
.test-cards{font-size:0.8rem;color:#666}
.card-list{list-style:none;padding:0.5rem 0 0.5rem 2.5rem}
.card-list li{font-size:0.85rem;padding:0.3rem 0;border-bottom:1px solid #f5f5f5;color:#555}
.card-list li:last-child{border:none}
.error-msg{color:#dc2626;font-weight:500;font-size:0.85rem;padding:0.3rem 0}
.footer{text-align:center;margin-top:1.5rem;color:#999;font-size:0.8rem}
</style></head><body><div class="container">
<div class="header">
<h1>🎓 DegreeMe Full Flow Test Report</h1>
<div class="meta"><span>${new Date(data.timestamp).toLocaleString()}</span><span>Environment: nonprod</span><span>Browser: Chromium</span></div>
<div class="stats">
<div class="stat"><div class="stat-val">${results.length}</div><div class="stat-lbl">Total</div></div>
<div class="stat"><div class="stat-val" style="color:#86efac">${passed}</div><div class="stat-lbl">Passed</div></div>
<div class="stat"><div class="stat-val" style="color:#fca5a5">${failed}</div><div class="stat-lbl">Failed</div></div>
<div class="stat"><div class="stat-val">${totalDuration}s</div><div class="stat-lbl">Duration</div></div>
</div></div>
<div class="content">
${['Undergraduate degree', 'Graduate degree', 'Graduate certificate'].map(dt => {
    const group = results.filter(r => r.degreeType === dt);
    if (!group.length) return '';
    const gp = group.filter(r => r.pass).length;
    return `<div class="section-title">${dt} (${gp}/${group.length} passed)</div>
${group.map(r => `<details>
<summary>
<span class="icon ${r.pass ? 'pass' : 'fail'}">${r.pass ? '✓' : '✗'}</span>
<span class="test-name">${r.interest}</span>
<span class="test-dur">${r.duration}s</span>
<span class="test-cards">${(r.degreeCards || []).length} cards</span>
</summary>
<ul class="card-list">${(r.degreeCards || []).map((c, i) => `<li>${i + 1}. ${c}</li>`).join('')}
${r.pass ? '' : `<li class="error-msg">${r.error || 'Failed'}</li>`}</ul>
</details>`).join('')}`;
  }).join('')}
</div>
<div class="footer">DegreeMe Automation • ASU Online • ${results.length} full-flow paths<br>
For detailed traces and screenshots, run: <code>npx playwright show-report</code></div>
</div></body></html>`;

fs.writeFileSync(REPORT_FILE, html);
console.log(`\nFull flow report generated: ${REPORT_FILE}`);
console.log(`Results: ${passed}/${results.length} passed`);

try { execSync(`open "${REPORT_FILE}"`); } catch (e) { /* ignore */ }
