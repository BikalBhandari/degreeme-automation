/**
 * Dashboard configuration — defines test groups and individual tests.
 */

const groups = [
  {
    id: 'full-flow',
    name: 'Full Flow',
    description: 'Complete quiz journey with real selections at every step (no skips)',
    tests: [
      { id: 'full-flow-undergrad-arts', name: 'Undergraduate — Arts, culture and society', command: 'npx playwright test quiz-full-flow --project=chromium -g "Undergraduate.*Arts"' },
      { id: 'full-flow-undergrad-business', name: 'Undergraduate — Business', command: 'npx playwright test quiz-full-flow --project=chromium -g "Undergraduate.*Business"' },
      { id: 'full-flow-undergrad-education', name: 'Undergraduate — Education', command: 'npx playwright test quiz-full-flow --project=chromium -g "Undergraduate.*Education"' },
      { id: 'full-flow-undergrad-engineering', name: 'Undergraduate — Engineering', command: 'npx playwright test quiz-full-flow --project=chromium -g "Undergraduate.*Engineering"' },
      { id: 'full-flow-undergrad-health', name: 'Undergraduate — Health and nursing', command: 'npx playwright test quiz-full-flow --project=chromium -g "Undergraduate.*Health"' },
      { id: 'full-flow-undergrad-law', name: 'Undergraduate — Law, compliance and public service', command: 'npx playwright test quiz-full-flow --project=chromium -g "Undergraduate.*Law"' },
      { id: 'full-flow-undergrad-science', name: 'Undergraduate — Science', command: 'npx playwright test quiz-full-flow --project=chromium -g "Undergraduate.*Science"' },
      { id: 'full-flow-undergrad-social', name: 'Undergraduate — Social and behavioral sciences', command: 'npx playwright test quiz-full-flow --project=chromium -g "Undergraduate.*Social"' },
      { id: 'full-flow-undergrad-tech', name: 'Undergraduate — Technology', command: 'npx playwright test quiz-full-flow --project=chromium -g "Undergraduate.*Technology"' },
      { id: 'full-flow-grad-arts', name: 'Graduate — Arts, culture and society', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate degree.*Arts"' },
      { id: 'full-flow-grad-business', name: 'Graduate — Business', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate degree.*Business"' },
      { id: 'full-flow-grad-education', name: 'Graduate — Education', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate degree.*Education"' },
      { id: 'full-flow-grad-engineering', name: 'Graduate — Engineering', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate degree.*Engineering"' },
      { id: 'full-flow-grad-health', name: 'Graduate — Health and nursing', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate degree.*Health"' },
      { id: 'full-flow-grad-law', name: 'Graduate — Law, compliance and public service', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate degree.*Law"' },
      { id: 'full-flow-grad-science', name: 'Graduate — Science', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate degree.*Science"' },
      { id: 'full-flow-grad-social', name: 'Graduate — Social and behavioral sciences', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate degree.*Social"' },
      { id: 'full-flow-grad-tech', name: 'Graduate — Technology', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate degree.*Technology"' },
      { id: 'full-flow-cert-arts', name: 'Certificate — Arts, culture and society', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate certificate.*Arts"' },
      { id: 'full-flow-cert-business', name: 'Certificate — Business', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate certificate.*Business"' },
      { id: 'full-flow-cert-education', name: 'Certificate — Education', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate certificate.*Education"' },
      { id: 'full-flow-cert-engineering', name: 'Certificate — Engineering', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate certificate.*Engineering"' },
      { id: 'full-flow-cert-health', name: 'Certificate — Health and nursing', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate certificate.*Health"' },
      { id: 'full-flow-cert-law', name: 'Certificate — Law, compliance and public service', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate certificate.*Law"' },
      { id: 'full-flow-cert-science', name: 'Certificate — Science', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate certificate.*Science"' },
      { id: 'full-flow-cert-social', name: 'Certificate — Social and behavioral sciences', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate certificate.*Social"' },
      { id: 'full-flow-cert-tech', name: 'Certificate — Technology', command: 'npx playwright test quiz-full-flow --project=chromium -g "Graduate certificate.*Technology"' },
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
      { id: 'rfi-undergrad', name: 'Undergraduate — RFI', command: 'npx playwright test quiz-full-flow-withRFI --project=chromium -g "Undergraduate"' },
      { id: 'rfi-grad', name: 'Graduate — RFI', command: 'npx playwright test quiz-full-flow-withRFI --project=chromium -g "Graduate degree"' },
      { id: 'rfi-cert', name: 'Certificate — RFI', command: 'npx playwright test quiz-full-flow-withRFI --project=chromium -g "Graduate certificate"' },
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
  },
  {
    id: 'results-grad',
    name: 'Results — Graduate',
    description: 'Validates AI-generated degree recommendations for graduate paths',
    tests: [
      { id: 'results-grad-all', name: 'All graduate results', command: 'npx playwright test quiz-results-graduate --project=chromium' },
    ],
    runAllCommand: 'npx playwright test quiz-results-graduate --project=chromium',
  },
  {
    id: 'results-cert',
    name: 'Results — Certificate',
    description: 'Validates AI-generated degree recommendations for certificate paths',
    tests: [
      { id: 'results-cert-all', name: 'All certificate results', command: 'npx playwright test quiz-results-certificate --project=chromium' },
    ],
    runAllCommand: 'npx playwright test quiz-results-certificate --project=chromium',
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
