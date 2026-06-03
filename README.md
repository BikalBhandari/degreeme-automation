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
├── ui-testing/
│   ├── specs/                  ← Functional test specs (plain language)
│   ├── tests/
│   │   ├── data/
│   │   │   └── quiz-paths.js  ← Test configuration (degree types, interests, keywords)
│   │   ├── helpers/
│   │   │   └── quiz-navigation.js  ← Shared navigation helpers
│   │   ├── quiz-discovery.spec.js  ← Early warning if quiz options change
│   │   ├── quiz-results-*.spec.js  ← Data-driven results validation
│   │   └── quiz-*.spec.js          ← Per-screen flow tests
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
