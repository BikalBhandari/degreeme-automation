# Spec: Program Card RFI Submission

## Description
Validates the complete RFI flow: page-level UNDECIDED RFI followed by program-specific RFI submissions from expanded degree cards.

## Flow
1. Complete quiz (Undergraduate + Technology path)
2. Submit page-level RFI (UNDECIDED) via "Request Info" button
3. Confirm "We'll be in touch" → close modal
4. Expand degree card → click "Connect with us" → submit program-specific RFI
5. Confirm "We'll be in touch" → close with ↗ button
6. Repeat for remaining cards

## Test Variants
- **First card**: Steps 1-5 for card 1 only (~60s)
- **All cards**: Steps 1-5 for all 5 cards (~3-4 min)

## Test Data
- Same as existing RFI tests: embtest prefix, edplusqatest email, valid US phone
- Each card submission uses unique timestamped email

## Expected Result
- Page-level RFI submits successfully (UNDECIDED in Salesforce)
- Each program card RFI submits successfully (program-key specific in Salesforce)
- "We'll be in touch" confirmation appears after each submission
- ↗ button closes modal and returns to results page

## Running

```bash
npx playwright test quiz-program-card-rfi --project=chromium -g "first card"
npx playwright test quiz-program-card-rfi --project=chromium -g "all 5 cards"
```
