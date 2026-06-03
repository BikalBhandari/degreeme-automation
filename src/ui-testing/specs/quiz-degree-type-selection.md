# Spec: Quiz Start — Degree Type Selection

## Description
After clicking "Take the quiz" on the homepage, the user is presented with a degree type selection screen where they must choose one of three options before continuing.

## Preconditions
- User is on the DegreeMe homepage
- No authentication required

## Test Steps
1. Navigate to the homepage
2. Click "Take the quiz" button
3. Verify the degree type selection screen appears with:
   - Subheading: "Online programs"
   - Heading: "What are you interested in pursuing?"
   - Instruction: "Must select one:"
   - Three selectable cards:
     - "Undergraduate degree"
     - "Graduate degree"
     - "Graduate certificate"
   - A "Back" link
   - A "Continue →" button
4. Select "Undergraduate degree" card
5. Click "Continue →"
6. Verify the next step of the quiz loads

## Expected Result
- Degree type selection screen renders after clicking "Take the quiz"
- All three degree type cards are visible and selectable
- Selecting a card visually highlights it
- "Continue" button advances to the next quiz question
- "Back" link returns to the homepage
