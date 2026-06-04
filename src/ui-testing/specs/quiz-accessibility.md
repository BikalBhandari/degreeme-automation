# Spec: Accessibility — RFI Modal

## Description
Validates that the RFI "Connect with us" modal meets accessibility requirements: keyboard navigation, screen reader support, color contrast, focus indicators, and proper ARIA labeling.

## Tests

### Keyboard Focus Trap
- Open RFI form, Tab through all elements
- Focus stays within modal, does not escape to background

### Screen Reader Labeling (Aria-labels)
- All form inputs have associated labels or aria-labels
- Labels are descriptive (First Name, Last Name, Email, Phone, Military)

### Color Contrast Ratio
- Text and interactive elements meet 4.5:1 contrast ratio minimum

### Visual Focus Indicators
- Tab through form without mouse
- Clear focus ring visible on active element

### Modal Closure via Esc Key
- Open RFI form, press Escape
- Modal closes and focus returns to the page

### Alt Text for Icons
- Close (X) button has aria-label
- Any status icons have descriptive alt text or aria-labels

## Running

```bash
npx playwright test quiz-accessibility --project=chromium
```

Expected runtime: ~60s
