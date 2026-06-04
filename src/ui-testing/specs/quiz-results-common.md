# Spec: Quiz Results — Common UI Elements

## Description
Validates shared UI elements on the results page that are consistent across all degree types. Uses a single representative path (Undergraduate + Technology) to avoid redundant AI generation.

## Preconditions
- User completed the quiz and results are displayed

## What it checks
- ASU logo is visible
- Restart button is present
- Request Info button is present
- Instructional text is displayed
- 5 initial degree cards are shown
- "+" button is visible and expands to show 10 total cards

## Expected Result
- All common UI elements render correctly regardless of quiz path taken

## Running

```bash
npx playwright test quiz-results-common --project=chromium
```

Expected runtime: ~60s (single path with AI generation)
