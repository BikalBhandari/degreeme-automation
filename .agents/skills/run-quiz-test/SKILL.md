# Run Quiz Test

Run a specific quiz flow test by walking the user through their selections. Reads available options from `src/ui-testing/tests/data/quiz-paths.js`.

Use when the user says "run a test", "test a quiz path", "run the quiz", or asks to test a specific degree/interest combination without providing all the details.

## Process

### 1. Check what the user provided

Read `src/ui-testing/tests/data/quiz-paths.js` to know the available options.

If the user already provided all values (degree type, interest area, sub-interest), skip to step 3.

If the user provided partial info (e.g., just "undergraduate" or "technology"), fill in what you know and ask only for what's missing.

### 2. Interview for missing values

First, ask if the user wants to answer all at once or one at a time:

> Do you want to provide all selections at once, or step through them one at a time?
>
> **All at once** — provide: degree type, education status (or skip), interest area, sub-interest
> **One at a time** — I'll walk you through each choice

**If all at once:** Show all options with numbers:

**Degree type:**
1. Undergraduate degree
2. Graduate degree
3. Graduate certificate

**Education status** (pick multiple or "skip"):
1. High school diploma or GED
2. Associate of Arts (AA) or Science (AS)
3. Associate of Applied Science (AAS)
4. Bachelor of Arts (BA)
5. Bachelor of Science (BS)
6. Master of Arts (MA)
7. Master of Science (MS)
8. Master of Business Administration (MBA)
9. Registered Nurse (RN) license
10. Teaching certification or licensure
11. Paralegal certificate or law-related training
12. Military or veteran

**Interest area:**
1. Arts, culture and society
2. Business
3. Education
4. Engineering
5. Health and nursing
6. Law, compliance and public service
7. Science
8. Social and behavioral sciences
9. Technology

**Sub-interest:** (show options for all 9 interest areas so user can pick)
Will be confirmed after interest area is known — or user can type the name directly.

Ask the user to answer like: `1, skip, 9, Web development` or `Graduate degree, 1+5, Technology, Cybersecurity or policy`

**If one at a time:** Ask one question at a time in this order:

**A — Degree type** (if not provided):

> Which degree type do you want to test?

Show the options from `DEGREE_TYPES`:
1. Undergraduate degree
2. Graduate degree
3. Graduate certificate

**B — Education status** (if not provided):

> Which education credentials should be selected? (or "skip" to skip this step)

Show the options from `EDUCATION_STATUS_OPTIONS`:
1. High school diploma or GED
2. Associate of Arts (AA) or Science (AS)
3. Associate of Applied Science (AAS)
4. Bachelor of Arts (BA)
5. Bachelor of Science (BS)
6. Master of Arts (MA)
7. Master of Science (MS)
8. Master of Business Administration (MBA)
9. Registered Nurse (RN) license
10. Teaching certification or licensure
11. Paralegal certificate or law-related training
12. Military or veteran

The user can pick multiple (e.g., "1, 4") or say "skip" to skip this step entirely.

**C — Interest area** (if not provided):

> Which interest area?

Show the options from `INTEREST_AREAS`:
1. Arts, culture and society
2. Business
3. Education
4. Engineering
5. Health and nursing
6. Law, compliance and public service
7. Science
8. Social and behavioral sciences
9. Technology

**D — Sub-interest** (if not provided):

> Which sub-interest?

Show the options from `SUB_INTERESTS[selectedInterest]`. Default is the first option ("General ...").

### 3. Run the test

Once you have all three values, run the test using a node script that:
1. Navigates through the quiz with those selections
2. Waits for results to load
3. Displays the 5 degree cards returned
4. Checks relevance against keywords from the sub-interest list
5. Reports pass/fail

Use this command pattern:
```bash
node -e "..." 
```

Or run the specific playwright test file filtered to the interest area:
```bash
npx playwright test quiz-results-undergraduate --project=chromium -g "InterestAreaName"
```

### 4. Report results

Show:
- The 5 degree cards returned
- Relevance check (✓/✗ per card)
- Overall pass/fail count
- Any potentially irrelevant results flagged

### Notes

- If the user says "run all", run `npm test` instead of interviewing.
- If the user provides a degree type but says "all interests", run the full results file for that degree type.
- Always use `--project=chromium` for single test runs (fastest).
- The test takes ~30-60 seconds due to AI result generation time — warn the user.
- For a human-readable HTML report, run `npm run report:full-flow` (reads from `full-flow-test-results.json` generated during the test run).
- For the RFI submission report, run `npm run report:rfi` (reads from `rfi-test-results.json`).
- For the AI results validation report, run `npm run report:results` (reads from `results-*-test-results.json`).
- The `quiz-full-flow.spec.js` test covers all 27 paths (3 degree types × 9 interest areas) with no skips.
- The `quiz-full-flow-withRFI.spec.js` test covers 3 paths with RFI submission.
