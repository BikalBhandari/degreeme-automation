# Spec: Quiz Full Flow — End-to-End (No Skips)

## Description
Verifies the complete quiz user journey from start to results, with real selections at every step (no skips). Tests one path per degree type to validate that the full flow produces correct degree recommendations.

## Preconditions
- DegreeMe quiz is accessible at the configured environment URL
- Full path configuration defined in `tests/data/quiz-paths.js` (`FULL_PATHS`)

## Data-Driven
This test runs once per degree type × interest area (27 paths total: 3 × 9). Each path specifies:
- Degree type (Undergraduate / Graduate / Certificate)
- Education status (realistic prerequisite for that level)
- Interest area (all 9 covered)
- 2 sub-interest selections
- 2 environment selections
- 2 preference selections

## Flow
1. Navigate to DegreeMe homepage
2. Click "Take the quiz"
3. Select degree type → Continue
4. Select education status → Continue
5. Select interest area → Continue
6. Select 2 sub-interests → Continue
7. Select 2 environments → Continue
8. Select 2 preferences → Click "Generate results"
9. Animation screen appears ("Analyzing your answers" / "Searching degrees and certificates")
10. Degree cards load within 90 seconds

## Expected Result
- Animation message is visible before results load
- 5 degree cards appear
- Cards are the correct degree level (Bachelor / Master / Certificate)
- "Request Info" button is visible
- "Restart" button is visible

## Degree Type Paths

| Degree Type | Education Status | Interest | Sub-Interests | Environments | Preferences |
|---|---|---|---|---|---|
| Undergraduate | High school diploma or GED | Technology | General technology, Web development | Fast-paced, Tech-focused and data-driven | Solving complex problems with data, Collaborating with others |
| Graduate | Bachelor of Science (BS) | Technology | General technology, Web development | Fast-paced, Tech-focused and data-driven | Solving complex problems with data, Collaborating with others |
| Certificate | Bachelor of Arts (BA) | Technology | General technology, Web development | Fast-paced, Tech-focused and data-driven | Solving complex problems with data, Collaborating with others |

## Running

```bash
# Run all 27 full-flow tests
npx playwright test quiz-full-flow --project=chromium

# Run one degree type (9 tests)
npx playwright test quiz-full-flow --project=chromium -g "Undergraduate"

# Run one specific path
npx playwright test quiz-full-flow --project=chromium -g "Undergraduate.*Technology"
```

Expected total runtime: ~15-25 minutes for all 27 tests.

## Reports

After running, generate both reports:

```bash
# 1. Playwright HTML report (detailed traces, screenshots on failure)
npx playwright show-report

# 2. Custom human-readable report (degree cards, steps, pass/fail per path)
npm run report:full-flow
```

The custom report is saved to `quiz-full-flow-report.html` in the project root and opens automatically in the browser.
