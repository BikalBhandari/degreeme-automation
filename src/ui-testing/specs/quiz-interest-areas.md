# Spec: Quiz — Interest Areas

## Description
The user selects one or more broad fields of interest. This determines which sub-interest drilldown screens appear next. At least one selection is required — there is no skip option.

## Preconditions
- User completed or skipped the Education Status step

## Screen Elements
- Subheading: "Interest areas"
- Question: "What fields excite you the most?"
- Instruction: "Select all that apply:"
- Options (multi-select, at least one required):
  - Arts, culture and society
  - Business
  - Education
  - Engineering
  - Health and nursing
  - Law, compliance and public service
  - Science
  - Social and behavioral sciences
  - Technology
- Navigation: "Back" link, "Continue" button (disabled until selection made), "Restart" in header

## Test Steps
1. Navigate to interest areas screen
2. Verify all 9 fields are visible
3. Verify Continue is disabled with no selection
4. Select a field — Continue becomes enabled
5. Select multiple fields
6. Click Continue — advances to first drilldown for selected fields
7. Click Back — returns to Education Status

## Expected Result
- All 9 interest fields are displayed
- Continue is disabled until at least one field is selected
- Multiple fields can be selected
- After Continue, the first drilldown screen appears for the selected fields
