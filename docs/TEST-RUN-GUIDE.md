# Test Run Guide

## Full Flow Tests (No Skips)

```bash
# All 27 full-flow tests (~15-25 min)
npx playwright test quiz-full-flow --project=chromium

# All undergraduate paths (9 tests)
npx playwright test quiz-full-flow --project=chromium -g "Undergraduate"

# All graduate paths (9 tests)
npx playwright test quiz-full-flow --project=chromium -g "Graduate degree"

# All certificate paths (9 tests)
npx playwright test quiz-full-flow --project=chromium -g "Graduate certificate"

# Single interest area across all degree types (3 tests)
npx playwright test quiz-full-flow --project=chromium -g "Technology"
npx playwright test quiz-full-flow --project=chromium -g "Business"
npx playwright test quiz-full-flow --project=chromium -g "Engineering"

# One specific path (~40-60s)
npx playwright test quiz-full-flow --project=chromium -g "Undergraduate.*Technology"
npx playwright test quiz-full-flow --project=chromium -g "Graduate degree.*Business"
npx playwright test quiz-full-flow --project=chromium -g "Graduate certificate.*Health"
```

## Per-Screen Tests

```bash
# Homepage
npx playwright test homepage --project=chromium

# Degree type selection
npx playwright test quiz-degree-type-selection --project=chromium

# Education status
npx playwright test quiz-education-status --project=chromium

# Interest areas
npx playwright test quiz-interest-areas --project=chromium

# Interest drilldown (sub-interests)
npx playwright test quiz-interest-drilldown --project=chromium

# Environments
npx playwright test quiz-environments --project=chromium

# Preferences
npx playwright test quiz-preferences --project=chromium
```

## Results Tests (Skip Steps, Test AI Output)

```bash
# All undergraduate results (9 interest areas × 5 assertions)
npx playwright test quiz-results-undergraduate --project=chromium

# All graduate results
npx playwright test quiz-results-graduate --project=chromium

# All certificate results
npx playwright test quiz-results-certificate --project=chromium

# Common results page UI elements
npx playwright test quiz-results-common --project=chromium

# Single interest area
npx playwright test quiz-results-undergraduate --project=chromium -g "Technology"
npx playwright test quiz-results-graduate --project=chromium -g "Business"
npx playwright test quiz-results-certificate --project=chromium -g "Health"
```

## Discovery Test (Config Validation)

```bash
# Verify quiz options still match quiz-paths.js config
npx playwright test quiz-discovery --project=chromium
```

## Run Everything

```bash
# All tests, Chromium only (~15-30 min)
npx playwright test --project=chromium

# All tests, all browsers (~45-90 min)
npm test

# All tests against production
npm run test:prod
```

## Options

```bash
# Headed mode (see the browser)
npx playwright test quiz-full-flow --project=chromium --headed

# With trace on failure
npx playwright test quiz-full-flow --project=chromium --trace on

# Open last HTML report
npx playwright show-report
```

## Browser Selection

```bash
# Chromium only (fastest, recommended for development)
npx playwright test quiz-full-flow --project=chromium

# Firefox only
npx playwright test quiz-full-flow --project=firefox

# WebKit (Safari) only
npx playwright test quiz-full-flow --project=webkit

# All 3 browsers at once (3× the tests)
npx playwright test quiz-full-flow

# Two specific browsers
npx playwright test quiz-full-flow --project=chromium --project=firefox
```

When no `--project` is specified, Playwright runs against **all 3 browsers** (Chromium, Firefox, WebKit) as configured in `playwright.config.js`.
