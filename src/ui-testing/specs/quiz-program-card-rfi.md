# Spec: Program Card RFI Submission

## Description
Validates the program-specific RFI submission flow from expanded degree cards on the results page.

## Flow
1. Complete quiz (Undergraduate + Arts, culture and society path)
2. Click "Read more" to expand a degree card
3. Click "Connect with us" button → RFI form opens ("Curious about this degree?")
4. Fill form: first name, last name, email, phone, military status
5. Submit → "We'll be in touch" confirmation appears
6. Close modal
7. Repeat for remaining cards

## Test Variants
- **First card**: Steps 1-6 for card 1 only (~60s)
- **All 5 cards**: Steps 1-6 for all 5 cards (~3-4 min)

## Test Data
- Same as existing RFI tests: embtest prefix, edplusqatest email
- Hardcoded phone: 6025980818 (passes BritVerify)
- Each card submission uses unique timestamped email

## Expected Result
- Each program card RFI submits successfully
- "We'll be in touch" confirmation appears after each submission
- Modal closes and results page remains accessible

## Running

```bash
npx playwright test quiz-program-card-rfi --project=chromium -g "First card"
npx playwright test quiz-program-card-rfi --project=chromium -g "All 5 cards"
```
