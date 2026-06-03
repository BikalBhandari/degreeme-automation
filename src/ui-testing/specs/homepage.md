# Spec: Homepage

## Description
Verify that the DegreeMe homepage loads and displays key elements including the quiz entry point.

## Preconditions
- No authentication required (nonprod)

## Screen Elements
- Page title contains "DegreeMe"
- "Take the quiz" button (primary CTA, gateway to quiz flow)
- "5 min to complete" indicator

## Test Steps
1. Navigate to the homepage
2. Verify the page title contains "DegreeMe"
3. Verify "Take the quiz" button is visible
4. Verify the page loads within 5 seconds
5. Verify no console errors on load

## Expected Result
- Page loads successfully with correct title
- "Take the quiz" button is present and clickable
- No JavaScript errors in console
