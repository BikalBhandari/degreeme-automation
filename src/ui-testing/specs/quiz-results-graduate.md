# Spec: Quiz Results — Graduate

## Description
Verifies that selecting "Graduate degree" in the quiz returns Master's degree programs relevant to the user's selected interest area.

## Preconditions
- User selected "Graduate degree" at the degree type step
- User selected one of 9 interest areas with a sub-interest (configured in `tests/data/quiz-paths.js`)
- User completed or skipped remaining steps

## Data-Driven
This test runs once per interest area (9 paths total). The interest, sub-interest, and expected relevance keywords are defined in `src/ui-testing/tests/data/quiz-paths.js`.

## Expected Result
- 5 degree cards appear after AI finishes generating
- All cards show "Graduate" label
- All results are "Master of ..." programs
- Results are relevant to the selected interest area (validated via keyword matching from sub-interests)
- + button reveals 5 additional relevant Master's programs (10 total)
