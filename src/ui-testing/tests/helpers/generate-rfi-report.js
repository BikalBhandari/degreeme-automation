/**
 * Generates a human-readable HTML report from RFI test results JSON.
 * Usage: npm run report:rfi (after running npm run test:rfi)
 *
 * Reads rfi-test-results.json written by the Playwright test and produces quiz-rfi-report.html.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const RESULTS_FILE = path.join(__dirname, '..', '..', '..', '..', 'rfi-test-results.json');
const REPORT_FILE = path.join(__dirname, '..', '..', '..', '..', 'quiz-rfi-report.html');

if (!fs.existsSync(RESULTS_FILE)) {
  console.error('No rfi-test-results.json found. Run the tests first:\n\n  npm run test:rfi\n');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
const results = data.results;

if (!results.length) {
  console.error('rfi-test-results.json is empty. Run the tests first:\n\n  npm run test:rfi\n');
  process.exit(1);
}

const passed = results.filter(r => r.pass).length;
const failed = results.length - passed;
const totalDuration = results.reduce((s, r) => s + parseFloat(r.duration), 0).toFixed(0);

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>DegreeMe RFI Submission Report</title>
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
.test-block{margin-bottom:1.5rem;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden}
.test-header{display:flex;align-items:center;gap:0.75rem;padding:1rem;background:#fafafa;border-bottom:1px solid #e5e7eb}
.icon{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;flex-shrink:0}
.icon.pass{background:#dcfce7;color:#16a34a}
.icon.fail{background:#fee2e2;color:#dc2626}
.test-title{font-weight:600;font-size:1rem}
.test-dur{margin-left:auto;font-size:0.85rem;color:#888}
.test-body{padding:1rem}
.rfi-data{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;margin-bottom:0.5rem;padding:0.75rem;background:#f9fafb;border-radius:6px}
.rfi-data:last-of-type{margin-bottom:1rem}
.rfi-field{font-size:0.85rem}
.rfi-field .label{font-weight:600;color:#666;font-size:0.75rem;text-transform:uppercase}
.rfi-field .value{margin-top:0.2rem}
.steps{list-style:none}
.steps li{display:flex;align-items:center;gap:0.5rem;padding:0.35rem 0;font-size:0.85rem;border-bottom:1px solid #f5f5f5}
.steps li:last-child{border:none}
.step-icon{font-size:0.7rem}
.step-icon.pass{color:#16a34a}
.step-icon.fail{color:#dc2626}
.step-detail{color:#888;margin-left:auto;font-size:0.8rem;max-width:50%;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.footer{text-align:center;margin-top:1.5rem;color:#999;font-size:0.8rem}
</style></head><body><div class="container">
<div class="header">
<h1>📋 DegreeMe RFI Submission Report</h1>
<div class="meta"><span>${new Date(data.timestamp).toLocaleString()}</span><span>Environment: ${data.env || 'nonprod'}</span><span>Browser: Chromium</span></div>
<div class="stats">
<div class="stat"><div class="stat-val">${results.length}</div><div class="stat-lbl">Total</div></div>
<div class="stat"><div class="stat-val" style="color:#86efac">${passed}</div><div class="stat-lbl">Passed</div></div>
<div class="stat"><div class="stat-val" style="color:#fca5a5">${failed}</div><div class="stat-lbl">Failed</div></div>
<div class="stat"><div class="stat-val">${totalDuration}s</div><div class="stat-lbl">Duration</div></div>
</div></div>
<div class="content">
${results.map(r => `<div class="test-block">
<div class="test-header">
<span class="icon ${r.pass ? 'pass' : 'fail'}">${r.pass ? '✓' : '✗'}</span>
<span class="test-title">${r.degreeType}</span>
<span class="test-dur">${r.duration}s</span>
</div>
<div class="test-body">
<div class="rfi-data">
<div class="rfi-field"><div class="label">Name</div><div class="value">${r.rfi.firstName} ${r.rfi.lastName}</div></div>
<div class="rfi-field"><div class="label">Email</div><div class="value">${r.rfi.email}</div></div>
</div>
<div class="rfi-data">
<div class="rfi-field"><div class="label">Phone</div><div class="value">+1 ${r.rfi.phone}</div></div>
<div class="rfi-field"><div class="label">Military</div><div class="value">${r.rfi.military}</div></div>
</div>
<ul class="steps">
${r.steps.map(s => `<li><span class="step-icon ${s.status}">${s.status === 'pass' ? '✓' : '✗'}</span>${s.name}${s.detail ? `<span class="step-detail" title="${s.detail}">${s.detail}</span>` : ''}</li>`).join('')}
</ul></div></div>`).join('')}
</div>
<div class="footer">DegreeMe Automation • ASU Online • RFI Submission (UNDECIDED) • 3 paths<br>
For detailed traces and screenshots, run: <code>npx playwright show-report</code></div>
</div></body></html>`;

fs.writeFileSync(REPORT_FILE, html);
console.log(`\nRFI report generated: ${REPORT_FILE}`);
console.log(`Results: ${passed}/${results.length} passed`);

// Open in browser
try { execSync(`open "${REPORT_FILE}"`); } catch (e) { /* ignore */ }
