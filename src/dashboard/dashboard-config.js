/**
 * Dashboard configuration — defines test groups and individual tests.
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
    id: 'full-flow',
    name: 'Full Flow',
    description: 'Complete quiz journey with real selections at every step (no skips)',
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
    name: 'RFI Submission',
    description: 'Full quiz flow + UNDECIDED RFI submission via Request Info button',
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
    id: 'results-undergrad',
    name: 'Results — Undergraduate',
    description: 'Validates AI-generated degree recommendations for undergraduate paths',
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
    description: 'Validates AI-generated degree recommendations for graduate paths',
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
    description: 'Validates AI-generated degree recommendations for certificate paths',
    tests: [
      { id: 'results-cert-all', name: 'All certificate results', command: 'npx playwright test quiz-results-certificate --project=chromium' },
    ],
    runAllCommand: 'npx playwright test quiz-results-certificate --project=chromium',
    reportJson: 'results-certificate-test-results.json',
    reportHtml: 'quiz-results-report.html',
  },
  {
    id: 'per-screen',
    name: 'Per-Screen Tests',
    description: 'Individual screen validation tests for each quiz step',
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
    id: 'discovery',
    name: 'Discovery',
    description: 'Canary test — fails if quiz options change, signaling config needs updating',
    tests: [
      { id: 'discovery', name: 'Quiz Discovery', command: 'npx playwright test quiz-discovery --project=chromium' },
    ],
    runAllCommand: 'npx playwright test quiz-discovery --project=chromium',
  },
];

module.exports = { groups };
