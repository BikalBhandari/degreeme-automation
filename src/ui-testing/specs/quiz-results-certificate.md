# Spec: Quiz Results — Graduate Certificate

## Description
Verifies that selecting "Graduate certificate" in the quiz returns certificate programs relevant to the user's selected interest area.

## Preconditions
- User selected "Graduate certificate" at the degree type step
- User selected one of 9 interest areas with a sub-interest (configured in `tests/data/quiz-paths.js`)
- User completed or skipped remaining steps

## Data-Driven
This test runs once per interest area (9 paths total). The interest, sub-interest, and expected relevance keywords are defined in `src/ui-testing/tests/data/quiz-paths.js`.

## Expected Result
- 5 degree cards appear after AI finishes generating
- All cards show "Graduate certificate" label
- All results are certificate programs
- Results are relevant to the selected interest area (validated via keyword matching from sub-interests)
- + button reveals 5 additional relevant certificate programs (10 total)
