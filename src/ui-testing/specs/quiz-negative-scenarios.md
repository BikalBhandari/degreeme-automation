# Spec: Negative Scenarios — Error Handling

## Description
Validates that the quiz handles failure states gracefully: AI timeouts, network failures, and form validation rejections.

## Tests

### AI Timeout
- Intercept the `/quiz-session` API call and delay indefinitely
- Assert a timeout/retry message appears to the user
- Quiz does not crash or show a blank screen

### Network Failure
- Intercept the `/quiz-session` API call and abort the request
- Assert an error/retry message appears
- User is not left on a loading spinner forever

### BritVerify Rejection (Invalid Email)
- Fill the RFI form with an invalid email (`fakeinvalid@notreal.xyz`)
- Assert an inline error message appears below the email field
- Submit button remains disabled or form does not submit

### BritVerify Rejection (Invalid Phone)
- Fill the RFI form with an invalid phone (`0000000000`)
- Assert an inline error message appears below the phone field

## Running

```bash
npx playwright test quiz-negative --project=chromium
```

Expected runtime: ~30s (simulated failures, no real AI wait)
