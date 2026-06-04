/**
 * Generates a human-readable HTML report for quiz results validation.
 * Usage: npm run report:results
 *
 * Reads results-*-test-results.json files and produces quiz-results-report.html.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..', '..', '..');
const REPORT_FILE = path.join(ROOT, 'quiz-results-report.html');

const sources = [
  { file: 'results-undergraduate-test-results.json', label: 'Undergraduate' },
  { file: 'results-graduate-test-results.json', label: 'Graduate' },
  { file: 'results-certificate-test-results.json', label: 'Certificate' },
];

let allResults = [];
let reportEnv = 'nonprod';
for (const src of sources) {
  const filePath = path.join(ROOT, src.file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (data.env) reportEnv = data.env;
    allResults.push(...data.results.map(r => ({ ...r, category: src.label })));
  }
}

if (!allResults.length) {
  console.error('No results JSON files found. Run the results tests first:\n\n  npx playwright test quiz-results --project=chromium\n');
  process.exit(1);
}

const passed = allResults.filter(r => r.pass).length;
const failed = allResults.length - passed;
const totalDuration = allResults.reduce((s, r) => s + parseFloat(r.duration || 0), 0).toFixed(0);

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>DegreeMe Results Validation Report</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;padding:2rem;color:#333}
.container{max-width:1100px;margin:0 auto}
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
.result-block{margin-bottom:1rem;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden}
.result-header{display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;background:#fafafa;border-bottom:1px solid #e5e7eb}
.icon{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;flex-shrink:0}
.icon.pass{background:#dcfce7;color:#16a34a}
.icon.fail{background:#fee2e2;color:#dc2626}
.result-title{font-weight:600;font-size:0.9rem}
.result-dur{margin-left:auto;font-size:0.8rem;color:#888}
.cards-list{padding:0.75rem 1rem;list-style:none}
.cards-list li{display:flex;align-items:center;gap:0.5rem;padding:0.3rem 0;font-size:0.85rem;border-bottom:1px solid #f5f5f5}
.cards-list li:last-child{border:none}
.relevance{font-size:0.7rem;font-weight:600;padding:0.1rem 0.4rem;border-radius:3px}
.relevance.yes{background:#dcfce7;color:#166534}
.relevance.no{background:#fee2e2;color:#991b1b}
.error-msg{color:#dc2626;font-size:0.85rem;padding:0.5rem 1rem}
.footer{text-align:center;margin-top:1.5rem;color:#999;font-size:0.8rem}
</style></head><body><div class="container">
<div class="header">
<h1>🎯 DegreeMe Results Validation Report</h1>
<div class="meta"><span>${new Date().toLocaleString()}</span><span>Environment: ${reportEnv}</span><span>AI Relevance Check</span></div>
<div class="stats">
<div class="stat"><div class="stat-val">${allResults.length}</div><div class="stat-lbl">Paths</div></div>
<div class="stat"><div class="stat-val" style="color:#86efac">${passed}</div><div class="stat-lbl">Passed</div></div>
<div class="stat"><div class="stat-val" style="color:#fca5a5">${failed}</div><div class="stat-lbl">Failed</div></div>
<div class="stat"><div class="stat-val">${totalDuration}s</div><div class="stat-lbl">Duration</div></div>
</div></div>
<div class="content">
${['Undergraduate', 'Graduate', 'Certificate'].map(cat => {
  const group = allResults.filter(r => r.category === cat);
  if (!group.length) return '';
  const gp = group.filter(r => r.pass).length;
  return `<div class="section-title">${cat} (${gp}/${group.length} passed)</div>
${group.map(r => `<div class="result-block">
<div class="result-header">
<span class="icon ${r.pass ? 'pass' : 'fail'}">${r.pass ? '✓' : '✗'}</span>
<span class="result-title">${r.interest}</span>
<span class="result-dur">${r.duration}s</span>
</div>
${r.error ? `<div class="error-msg">${r.error}</div>` : ''}
${r.degreeCards && r.degreeCards.length ? `<ul class="cards-list">
${r.relevanceResults.map((c, i) => `<li><span class="relevance ${c.relevant ? 'yes' : 'no'}">${c.relevant ? '✓ Relevant' : '✗ Irrelevant'}</span>${c.card}</li>`).join('')}
</ul>` : ''}
</div>`).join('')}`;
}).join('')}
</div>
<div class="footer">DegreeMe Automation • ASU Online • AI Results Validation<br>
For detailed traces and screenshots, run: <code>npx playwright show-report</code></div>
</div></body></html>`;

fs.writeFileSync(REPORT_FILE, html);
console.log(`\nResults report generated: ${REPORT_FILE}`);
console.log(`Results: ${passed}/${allResults.length} passed`);

try { execSync(`open "${REPORT_FILE}"`); } catch (e) { /* ignore */ }
