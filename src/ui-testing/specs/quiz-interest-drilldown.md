# Spec: Quiz — Interest Drilldown

## Description
After selecting interest areas, the user sees one drilldown screen per selected field. Each asks "What area of [Field] are you interested in?" with sub-options specific to that field. Fields are presented in sequence — completing one advances to the next.

## Preconditions
- User selected one or more fields on the Interest Areas screen and clicked Continue

## Screen Elements
- Tab header showing all selected fields (e.g., "Business | Education | Technology"), current field highlighted
- Question: "What area of [Field] are you interested in?"
- Instruction: "Select all that apply:"
- Sub-options specific to the field (multi-select, at least one required)
- Navigation: "Back" link, "Continue" button (disabled until selection made)

## Known Sub-options per Field

All sub-options are defined in `src/ui-testing/tests/data/quiz-paths.js` (the `SUB_INTERESTS` object). The discovery test (`quiz-discovery.spec.js`) verifies these match the live app.

Includes: Arts (11 options), Business (12), Education (10), Engineering (6), Health and nursing (12), Law/compliance/public service (17), Science (11), Social and behavioral sciences (10), Technology (12).

## Test Steps
1. Navigate to drilldown screen (select a field on Interest Areas + Continue)
2. Verify question and tab header are displayed
3. Verify sub-options are visible
4. Verify Continue is disabled without selection
5. Select a sub-option — Continue becomes enabled
6. Click Continue — advances to next drilldown (or Environments if last field)
7. Click Back — returns to previous drilldown (or Interest Areas if first field)

## Expected Result
- Each selected field gets its own drilldown screen
- At least one sub-option must be selected to continue
- Completing the last drilldown advances to Environments
