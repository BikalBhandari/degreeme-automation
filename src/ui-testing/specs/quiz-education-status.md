# Spec: Quiz — Education Status

## Description
After selecting a degree type, the user is asked about their current education credentials and experience. This helps personalize program recommendations.

## Preconditions
- User clicked "Take the quiz"
- User selected a degree type and clicked Continue

## Screen Elements
- Subheading: "Education status"
- Question: "Do you currently have any of the following degrees, certifications or experience?"
- Instruction: "Select all that apply:"
- Options (multi-select):
  - High school diploma or GED
  - Associate of Arts (AA) or Science (AS)
  - Associate of Applied Science (AAS)
  - Bachelor of Arts (BA)
  - Bachelor of Science (BS)
  - Master of Arts (MA)
  - Master of Science (MS)
  - Master of Business Administration (MBA)
  - Registered Nurse (RN) license
  - Teaching certification or licensure
  - Paralegal certificate or law-related training
  - Military or veteran
- Navigation: "Back" link, "Skip to next question" button

## Test Steps
1. Navigate to the education status screen
2. Verify all screen elements are visible
3. Select multiple options
4. Click "Skip to next question" — advances to next step
5. Click "Back" — returns to degree type selection

## Expected Result
- All 12 credential options are visible and selectable
- Multiple options can be selected simultaneously
- "Skip to next question" advances without requiring selection
- "Back" returns to the degree type selection screen
