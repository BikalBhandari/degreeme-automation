/**
 * Dashboard configuration — defines test groups and individual tests.
 * Order: sanity → unit screens → results validation → full e2e → advanced e2e
 */

const INTEREST_AREAS = [
  'Arts, culture and society', 'Business', 'Education', 'Engineering',
  'Health and nursing', 'Law, compliance and public service', 'Science',
  'Social and behavioral sciences', 'Technology',
];

function fullFlowTests(degreeType, idPrefix) {
  return INTEREST_AREAS.map(interest => ({
    id: `${idPrefix}-${interest.toLowerCase().replace(/[^a-z]/g, '').substring(0, 8)}`,
    name: `${degreeType} — ${interest}`,
    command: `npx playwright test quiz-full-flow --project=chromium -g "Full flow .+ ${degreeType} .+ ${interest}"`,
  }));
}

const groups = [
  {
    id: 'discovery',
    name: 'Discovery (Sanity Check)',
    description: 'Canary test — fails if quiz options change. ~30s total | ~5s per test',
    tests: [
      { id: 'discovery', name: 'Quiz Discovery', command: 'npx playwright test quiz-discovery --project=chromium' },
    ],
    runAllCommand: 'npx playwright test quiz-discovery --project=chromium',
  },
  {
    id: 'per-screen',
    name: 'Per-Screen Validation',
    description: 'Individual screen validation tests for each quiz step. ~2 min total | ~10s per test',
    tests: [
      { id: 'screen-homepage', name: 'Homepage', command: 'npx playwright test homepage --project=chromium' },
      { id: 'screen-degree-type', name: 'Degree Type Selection', command: 'npx playwright test quiz-degree-type-selection --project=chromium' },
      { id: 'screen-education', name: 'Education Status', command: 'npx playwright test quiz-education-status --project=chromium' },
      { id: 'screen-interests', name: 'Interest Areas', command: 'npx playwright test quiz-interest-areas --project=chromium' },
      { id: 'screen-drilldown', name: 'Interest Drilldown (Sub-interests)', command: 'npx playwright test quiz-interest-drilldown --project=chromium' },
      { id: 'screen-environments', name: 'Environments', command: 'npx playwright test quiz-environments --project=chromium' },
      { id: 'screen-preferences', name: 'Preferences', command: 'npx playwright test quiz-preferences --project=chromium' },
    ],
    runAllCommand: 'npx playwright test homepage quiz-degree-type-selection quiz-education-status quiz-interest-areas quiz-interest-drilldown quiz-environments quiz-preferences --project=chromium',
  },
  {
    id: 'results-undergrad',
    name: 'Results — Undergraduate',
    description: 'Validates AI-generated Bachelor degree recommendations. ~10 min total | ~60s per test',
    tests: [
      { id: 'results-undergrad-all', name: 'All undergraduate results', command: 'npx playwright test quiz-results-undergraduate --project=chromium' },
    ],
    runAllCommand: 'npx playwright test quiz-results-undergraduate --project=chromium',
    reportJson: 'results-undergraduate-test-results.json',
    reportHtml: 'quiz-results-report.html',
  },
  {
    id: 'results-grad',
    name: 'Results — Graduate',
    description: 'Validates AI-generated Master degree recommendations. ~10 min total | ~60s per test',
    tests: [
      { id: 'results-grad-all', name: 'All graduate results', command: 'npx playwright test quiz-results-graduate --project=chromium' },
    ],
    runAllCommand: 'npx playwright test quiz-results-graduate --project=chromium',
    reportJson: 'results-graduate-test-results.json',
    reportHtml: 'quiz-results-report.html',
  },
  {
    id: 'results-cert',
    name: 'Results — Certificate',
    description: 'Validates AI-generated certificate recommendations. ~10 min total | ~60s per test',
    tests: [
      { id: 'results-cert-all', name: 'All certificate results', command: 'npx playwright test quiz-results-certificate --project=chromium' },
    ],
    runAllCommand: 'npx playwright test quiz-results-certificate --project=chromium',
    reportJson: 'results-certificate-test-results.json',
    reportHtml: 'quiz-results-report.html',
  },
  {
    id: 'full-flow',
    name: 'Full Flow (Quiz Completion)',
    description: 'Complete quiz journey with real selections at every step — no skips. ~20 min total | ~40s per test',
    tests: [
      ...fullFlowTests('Undergraduate degree', 'ff-ug'),
      ...fullFlowTests('Graduate degree', 'ff-gr'),
      ...fullFlowTests('Graduate certificate', 'ff-ct'),
    ],
    runAllCommand: 'npx playwright test quiz-full-flow --project=chromium',
    reportJson: 'full-flow-test-results.json',
    reportHtml: 'quiz-full-flow-report.html',
  },
  {
    id: 'rfi',
    name: 'RFI Submission (E2E)',
    description: 'Full quiz flow + RFI form submission — complete end-to-end user journey. ~2 min total | ~40s per test',
    tests: [
      { id: 'rfi-undergrad', name: 'Undergraduate — RFI', command: 'npx playwright test quiz-full-flow-withRFI --project=chromium -g "Full flow with RFI .+ Undergraduate degree"' },
      { id: 'rfi-grad', name: 'Graduate — RFI', command: 'npx playwright test quiz-full-flow-withRFI --project=chromium -g "Full flow with RFI .+ Graduate degree"' },
      { id: 'rfi-cert', name: 'Certificate — RFI', command: 'npx playwright test quiz-full-flow-withRFI --project=chromium -g "Full flow with RFI .+ Graduate certificate"' },
    ],
    runAllCommand: 'npx playwright test quiz-full-flow-withRFI --project=chromium',
    reportJson: 'rfi-test-results.json',
    reportHtml: 'quiz-rfi-report.html',
  },
  {
    id: 'negative',
    name: 'Negative Scenarios',
    description: 'Error handling: AI timeout, network failure, BritVerify rejection. ~30s total | simulated',
    tests: [
      { id: 'neg-ai-timeout', name: 'AI Timeout — shows retry message', command: 'npx playwright test quiz-negative-scenarios --project=chromium -g "AI timeout"' },
      { id: 'neg-network-fail', name: 'Network Failure — shows error message', command: 'npx playwright test quiz-negative-scenarios --project=chromium -g "Network failure"' },
      { id: 'neg-invalid-email', name: 'Invalid Email — BritVerify rejection', command: 'npx playwright test quiz-negative-scenarios --project=chromium -g "invalid email"' },
      { id: 'neg-invalid-phone', name: 'Invalid Phone — BritVerify rejection', command: 'npx playwright test quiz-negative-scenarios --project=chromium -g "invalid phone"' },
    ],
    runAllCommand: 'npx playwright test quiz-negative-scenarios --project=chromium',
  },
  {
    id: 'cross-browser',
    name: 'Cross-Browser',
    description: 'Representative paths on Chromium, Firefox, and WebKit. ~4 min total | ~40s per browser',
    tests: [
      { id: 'xb-full-flow-chromium', name: 'Full Flow (Chromium)', command: 'npx playwright test quiz-full-flow --project=chromium -g "Full flow .+ Undergraduate degree .+ Technology"' },
      { id: 'xb-full-flow-firefox', name: 'Full Flow (Firefox)', command: 'npx playwright test quiz-full-flow --project=firefox -g "Full flow .+ Undergraduate degree .+ Technology"' },
      { id: 'xb-full-flow-webkit', name: 'Full Flow (WebKit)', command: 'npx playwright test quiz-full-flow --project=webkit -g "Full flow .+ Undergraduate degree .+ Technology"' },
      { id: 'xb-rfi-chromium', name: 'RFI Submission (Chromium)', command: 'npx playwright test quiz-full-flow-withRFI --project=chromium -g "Full flow with RFI .+ Undergraduate degree"' },
      { id: 'xb-rfi-firefox', name: 'RFI Submission (Firefox)', command: 'npx playwright test quiz-full-flow-withRFI --project=firefox -g "Full flow with RFI .+ Undergraduate degree"' },
      { id: 'xb-rfi-webkit', name: 'RFI Submission (WebKit)', command: 'npx playwright test quiz-full-flow-withRFI --project=webkit -g "Full flow with RFI .+ Undergraduate degree"' },
    ],
    runAllCommand: 'npx playwright test quiz-full-flow -g "Full flow .+ Undergraduate degree .+ Technology" && npx playwright test quiz-full-flow-withRFI -g "Full flow with RFI .+ Undergraduate degree"',
  },
];

module.exports = { groups };
