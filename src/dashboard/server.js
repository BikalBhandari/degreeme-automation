/**
 * Test Dashboard Server
 * Serves the dashboard UI and provides API to run tests.
 * Usage: npm run dashboard
 */
const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { groups } = require('./dashboard-config');

const app = express();
const PORT = 4400;
const PROJECT_ROOT = path.join(__dirname, '..', '..');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Track running processes
const runningProcesses = {};

// Current environment
let currentEnv = 'nonprod';

// GET /api/env — get current environment
app.get('/api/env', (req, res) => {
  res.json({ env: currentEnv });
});

// POST /api/env — switch environment
app.post('/api/env', (req, res) => {
  const { env } = req.body;
  if (!['nonprod', 'prod'].includes(env)) return res.status(400).json({ error: 'Invalid env. Use "nonprod" or "prod".' });
  currentEnv = env;
  console.log(`\n🔄 Environment switched to: ${env.toUpperCase()}\n`);
  res.json({ env: currentEnv });
});

// GET /api/tests — return groups with last run status
app.get('/api/tests', (req, res) => {
  const result = groups.map(group => {
    let lastResults = null;
    if (group.reportJson) {
      const jsonPath = path.join(PROJECT_ROOT, group.reportJson);
      if (fs.existsSync(jsonPath)) {
        try { lastResults = JSON.parse(fs.readFileSync(jsonPath, 'utf8')); } catch (e) {}
      }
    }
    return { ...group, lastResults };
  });
  res.json(result);
});

// POST /api/run-test — run a single test by id
app.post('/api/run-test', (req, res) => {
  const { testId } = req.body;
  let testConfig = null;
  let parentGroup = null;
  for (const group of groups) {
    testConfig = group.tests.find(t => t.id === testId);
    if (testConfig) { parentGroup = group; break; }
  }
  if (!testConfig) return res.status(404).json({ error: 'Test not found' });

  // Clear the JSON results file so report only shows this run
  if (parentGroup.reportJson) {
    const jsonPath = path.join(PROJECT_ROOT, parentGroup.reportJson);
    fs.writeFileSync(jsonPath, JSON.stringify({ timestamp: new Date().toISOString(), env: currentEnv, results: [] }));
  }

  const start = Date.now();
  const child = exec(testConfig.command, { cwd: PROJECT_ROOT, timeout: 300000, env: { ...process.env, ENV: currentEnv } }, (error, stdout, stderr) => {
    delete runningProcesses[testId];
    const duration = ((Date.now() - start) / 1000).toFixed(1);
    const pass = !error;
    res.json({ testId, pass, duration, output: pass ? stdout : stderr || stdout });
  });
  runningProcesses[testId] = child;
});

// POST /api/run-group — run all tests in a group
app.post('/api/run-group', (req, res) => {
  const { groupId } = req.body;
  const group = groups.find(g => g.id === groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  // Clear the JSON results file so report only shows this run
  if (group.reportJson) {
    const jsonPath = path.join(PROJECT_ROOT, group.reportJson);
    fs.writeFileSync(jsonPath, JSON.stringify({ timestamp: new Date().toISOString(), env: currentEnv, results: [] }));
  }

  const start = Date.now();
  const child = exec(group.runAllCommand, { cwd: PROJECT_ROOT, timeout: 600000, env: { ...process.env, ENV: currentEnv } }, (error, stdout, stderr) => {
    delete runningProcesses[`group-${groupId}`];
    const duration = ((Date.now() - start) / 1000).toFixed(1);
    const pass = !error;
    res.json({ groupId, pass, duration, output: pass ? stdout : stderr || stdout });
  });
  runningProcesses[`group-${groupId}`] = child;
});

// POST /api/stop-test — kill a running test
app.post('/api/stop-test', (req, res) => {
  const { testId } = req.body;
  const key = testId.startsWith('group-') ? testId : testId;
  const child = runningProcesses[key];
  if (!child) return res.json({ ok: false, message: 'No running process found' });
  child.kill('SIGTERM');
  delete runningProcesses[key];
  res.json({ ok: true });
});

// GET /api/reports/playwright — open Playwright report
app.get('/api/reports/playwright', (req, res) => {
  const { spawn } = require('child_process');
  spawn('npx', ['playwright', 'show-report'], { cwd: PROJECT_ROOT, detached: true, stdio: 'ignore' }).unref();
  res.json({ ok: true, message: 'Playwright report opening on port 9323' });
});

// GET /api/reports/stakeholder/:type — regenerate and serve custom HTML report
app.get('/api/reports/stakeholder/:type', (req, res) => {
  const types = { 'full-flow': 'report:full-flow', 'rfi': 'report:rfi', 'results-undergrad': 'report:results', 'results-grad': 'report:results', 'results-cert': 'report:results' };
  const script = types[req.params.type];
  if (!script) return res.status(404).json({ error: 'Unknown report type' });

  const files = { 'full-flow': 'quiz-full-flow-report.html', 'rfi': 'quiz-rfi-report.html', 'results-undergrad': 'quiz-results-report.html', 'results-grad': 'quiz-results-report.html', 'results-cert': 'quiz-results-report.html' };
  const filePath = path.join(PROJECT_ROOT, files[req.params.type]);

  // Regenerate from current JSON before serving
  exec(`npm run ${script} --silent`, { cwd: PROJECT_ROOT }, (error) => {
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Report not generated. Run the tests first.' });
    res.sendFile(filePath);
  });
});

app.listen(PORT, () => {
  console.log(`\n🎓 DegreeMe Test Dashboard running at http://localhost:${PORT}\n`);
  const open = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${open} http://localhost:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Server error:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message);
});
