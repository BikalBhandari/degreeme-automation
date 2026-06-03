# Spec: Quiz — Environments

## Description
The user selects work environments they imagine themselves in. This step is optional — a "Skip to next question" button is available.

## Preconditions
- User completed all interest drilldowns

## Screen Elements
- Subheading: "Environments"
- Question: "What kind of work environment do you imagine yourself in?"
- Instruction: "Select all that apply:"
- Options (multi-select):
  - Fast-paced
  - Team-oriented
  - Independent and research-driven
  - Creative and flexible
  - Tech-focused and data-driven
  - Hands-on
  - Mission and community-driven
- Navigation: "Back" link, "Skip to next question" button

## Test Steps
1. Navigate to Environments screen
2. Verify all 7 environment options are visible
3. Select multiple options
4. Click "Skip to next question" — advances to Preferences
5. Click "Back" — returns to last drilldown

## Expected Result
- All environment options are displayed and selectable
- Skip advances to Preferences without requiring selection
- Back returns to the last interest drilldown
