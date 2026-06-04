# Spec: Quiz Discovery — Config Validation

## Description
Canary test that verifies quiz options on the live site match the local `quiz-paths.js` configuration. If this fails, the config needs updating before other tests will pass.

## Preconditions
- DegreeMe quiz is accessible at the configured environment URL

## What it checks
- Degree type options match `DEGREE_TYPES` array
- Interest area options match `INTEREST_AREAS` array
- Education status options match `EDUCATION_STATUS_OPTIONS` array
- Sub-interest options for each interest area match `SUB_INTERESTS` map

## Expected Result
- All options visible on the live site match the config exactly
- If any option is added, removed, or renamed on the site, this test fails first

## Running

```bash
npx playwright test quiz-discovery --project=chromium
```

Expected runtime: ~30s
