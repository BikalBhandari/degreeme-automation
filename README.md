# DegreeMe Automation

Spec-driven test automation suite for the [DegreeMe Quiz](https://nonprod-degree-me.edpl.us/) — ASU Online's AI-powered degree recommendation tool.

## Stack

- **Playwright** — browser automation (Chromium, Firefox, WebKit)
- **JavaScript** — test language
- **Spec-driven** — each test has a corresponding plain-language spec in `specs/`

## Setup

```bash
npm install
npx playwright install
```

## Dashboard

A web-based test launcher with ASU branding. Run tests via button clicks instead of the terminal.

```bash
npm run dashboard
```

Opens `http://localhost:4400` with:
- Test cards grouped by category (Full Flow, RFI, Results, Per-Screen, Discovery)
- "Run All" button per group
- Individual "Run" button per test
- Live status: spinner → pass/fail with duration
- Links to Playwright report (debug) and Stakeholder report (shareable)

## Running Tests

```bash
npm test                        # All tests, all browsers (nonprod)
npm run test:ui                 # UI tests only
npm run test:api                # API tests only
npm run test:automation         # Automation tests only
npm run test:prod               # All tests against production
npx playwright test --project=chromium  # Single browser
npm run report                  # Open HTML report
```

## Full Flow Tests (No Skips)

The `quiz-full-flow.spec.js` test runs the complete user journey with real selections at every step — no skips. It tests one path per degree type × interest area (27 paths):

```bash
# Run all 27 full-flow tests
npx playwright test quiz-full-flow --project=chromium

# Run just one degree type
npx playwright test quiz-full-flow --project=chromium -g "Undergraduate"
npx playwright test quiz-full-flow --project=chromium -g "Graduate degree"
npx playwright test quiz-full-flow --project=chromium -g "Graduate certificate"
```

Each test takes ~30-60s due to AI result generation. The full path config is defined in `FULL_PATHS` within `src/ui-testing/tests/data/quiz-paths.js`.

## RFI Submission Tests

The `quiz-full-flow-withRFI.spec.js` test runs the full quiz flow and then submits an UNDECIDED RFI through the page-level "Request Info" button. Tests 3 paths (one per degree type).

```bash
# Run all 3 RFI tests
npm run test:rfi

# Run one degree type
npx playwright test quiz-full-flow-withRFI --project=chromium -g "Undergraduate"
```

Each test takes ~30-45s. Test data uses:
- Names: `embtest` prefix (e.g., `embtestPriya`, `embtestNguyen`)
- Email: `edplusqatest+degreemeautomation{timestamp}@gmail.com`
- Phone: valid US 10-digit number (passes BritVerify)
- Military: alternates Yes/No across paths

## Reports

Each test writes results to a JSON file during execution. Reports are generated instantly from the JSON — no second browser run needed.

```bash
# Playwright HTML report (debug: traces, screenshots, errors)
npx playwright show-report

# Custom human-readable reports (stakeholder-friendly)
npm run report:full-flow        # From full-flow-test-results.json → quiz-full-flow-report.html
npm run report:rfi              # From rfi-test-results.json → quiz-rfi-report.html
npm run report:results          # From results-*-test-results.json → quiz-results-report.html
```

Workflow:
1. Run tests: `npm run test:rfi` or `npx playwright test quiz-full-flow --project=chromium`
2. Debug failures: `npx playwright show-report`
3. Share with stakeholders: `npm run report:rfi` or `npm run report:full-flow`

## Running a Specific Quiz Path

To test a specific degree type + interest + sub-interest combination, edit the config file:

**`src/ui-testing/tests/data/quiz-paths.js`**

Find the path you want to change and update the `subInterest` field. For example, to test:

| Online programs | Interest areas | Sub Interest Areas |
|-----------------|---------------|-------------------|
| Undergrad Degree | Health and nursing | General health and nursing |
| Undergrad Degree | Health and nursing | Health care leadership and policy |

Find the Undergraduate + Health entry in `quiz-paths.js` and change:

```js
subInterest: SUB_INTERESTS[interest][0],  // default: "General health and nursing"
```

To test a different sub-interest, replace `[0]` with the specific option:

```js
subInterest: 'Health care leadership and policy',
```

Then run:

```bash
# Run just the undergraduate results for Health and nursing
npx playwright test quiz-results-undergraduate --project=chromium -g "Health"
```

To test **both** sub-interests, duplicate the entry in the `PATHS` array so each gets its own test run.

## Running a Specific Test

```bash
# Run one test file
npx playwright test src/ui-testing/tests/quiz-degree-type-selection.spec.js

# Run one test file on Chromium only (fastest)
npx playwright test src/ui-testing/tests/quiz-education-status.spec.js --project=chromium

# Run tests matching a keyword in the file name
npx playwright test -g "Interest Areas"

# Run two specific test files
npx playwright test src/ui-testing/tests/quiz-degree-type-selection.spec.js src/ui-testing/tests/quiz-interest-areas.spec.js

# Run all results tests (matches file name pattern)
npx playwright test quiz-results

# Run with visible browser (for debugging)
npx playwright test src/ui-testing/tests/homepage.spec.js --headed
```

## Project Structure

```
src/
├── dashboard/
│   ├── public/
│   │   └── index.html              ← Dashboard frontend (ASU-branded SPA)
│   ├── dashboard-config.js         ← Test groups, commands, metadata
│   └── server.js                   ← Express server (port 4400)
├── ui-testing/
│   ├── specs/                  ← Functional test specs (plain language)
│   ├── tests/
│   │   ├── data/
│   │   │   ├── quiz-paths.js  ← Test configuration (degree types, interests, keywords)
│   │   │   └── rfi-data.js    ← RFI test data generator (names, email, phone, military)
│   │   ├── helpers/
│   │   │   ├── quiz-navigation.js            ← Shared navigation helpers
│   │   │   ├── generate-full-flow-report.js  ← Stakeholder report (reads JSON)
│   │   │   ├── generate-rfi-report.js        ← RFI stakeholder report (reads JSON)
│   │   │   └── generate-results-report.js    ← Results validation report (reads JSON)
│   │   ├── quiz-discovery.spec.js       ← Early warning if quiz options change
│   │   ├── quiz-full-flow.spec.js       ← Full quiz flow (27 paths)
│   │   ├── quiz-full-flow-withRFI.spec.js  ← Full flow + RFI submission (3 paths)
│   │   ├── quiz-results-*.spec.js       ← Data-driven results validation
│   │   └── quiz-*.spec.js              ← Per-screen flow tests
├── api-testing/
│   ├── specs/
│   └── tests/
└── automation/
    ├── specs/
    └── tests/
```

## Environments

| Environment | URL |
|-------------|-----|
| Nonprod (default) | https://nonprod-degree-me.edpl.us/ |
| Production | https://degreeme.asuonline.asu.edu/ |

## Spec-Driven Workflow

1. Write a spec in `src/<context>/specs/feature-name.md`
2. Implement the test in `src/<context>/tests/feature-name.spec.js`
3. Run with `npm test`

## Updating Quiz Configuration

If quiz options change (new interest areas, renamed fields, etc.):

1. `quiz-discovery.spec.js` will fail — telling you what changed
2. Update `src/ui-testing/tests/data/quiz-paths.js` to match
3. All data-driven tests pick up the change automatically
