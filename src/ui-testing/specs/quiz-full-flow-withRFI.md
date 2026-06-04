# Spec: Full Flow with RFI Submission

## Description
Verifies the complete quiz user journey from start to results, followed by submitting an UNDECIDED RFI through the page-level "Request Info" button. Tests one path per degree type (3 total).

## Preconditions
- DegreeMe quiz is accessible at the configured environment URL
- Full path configuration defined in `tests/data/quiz-paths.js` (`FULL_PATHS`)
- RFI test data generator available in `tests/data/rfi-data.js`

## Data-Driven
This test runs 3 paths — one per degree type (Undergraduate, Graduate, Certificate). Each uses the first `FULL_PATHS` entry for that degree type.

## Flow
1. Navigate to DegreeMe homepage
2. Click "Take the quiz"
3. Select degree type → Continue
4. Select education status → Continue
5. Select interest area → Continue
6. Select 2 sub-interests → Continue
7. Select 2 environments → Continue
8. Select 2 preferences → Click "Generate results"
9. Animation screen appears
10. Degree cards load within 90 seconds
11. Click page-level "Request Info" button
12. Assert "Connect with us" modal appears
13. Fill first name (`embtest` + random name)
14. Fill last name (`embtest` + random name)
15. Fill email (`edplusqatest+degreemeautomation{timestamp}@gmail.com`)
16. Select US country code, fill phone number (valid 10-digit)
17. Select military status radio (alternates Yes/No per path)
18. Assert Submit button is enabled
19. Click Submit
20. Assert "We'll be in touch" confirmation modal appears
21. Click X to close confirmation modal

## Expected Result
- Quiz completes with 5 degree cards at correct level
- "Connect with us" modal opens on Request Info click
- Submit button is disabled until all fields are filled
- Submit button activates once form is complete
- "We'll be in touch" confirmation modal appears after submit
- Confirmation modal closes on X click

## Running

```bash
# Run all 3 RFI tests
npx playwright test full-flow-withRFI --project=chromium

# Run one degree type
npx playwright test full-flow-withRFI --project=chromium -g "Undergraduate"
```

Expected runtime: ~3-5 minutes for all 3 tests.
