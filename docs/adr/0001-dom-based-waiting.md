# ADR-0001: DOM-Based Waiting Over Fixed Timeouts

## Status

Accepted

## Context

The DegreeMe quiz is a Nuxt 3 universal (SSR/SPA) app. After initial page load, navigation between quiz steps happens via client-side routing. Each transition fetches a `_payload.json` and renders the next Vue component.

Our Playwright tests were using `page.waitForTimeout(1000-2000)` as fixed delays between steps. This caused:

1. **Timeouts on slow environments** — nonprod cold starts and CI resource contention made 2s insufficient
2. **`SyntaxError: Unexpected end of JSON input`** — tests interacted with the page during in-flight Nuxt route transitions, catching partial JSON payload responses
3. **Wasted time on fast environments** — tests waited 1-2s even when transitions completed in 200ms

## Decision

Replace all `waitForTimeout` calls with **DOM-based waiting** — wait for a specific element on the next screen to become visible. Use a shared `TRANSITION_TIMEOUT` constant (30000ms) as the ceiling.

**Approach:**
- After every navigation action, wait for a **positive signal** (next screen's element visible) rather than a negative one (old screen gone) or a blind delay
- Use a single shared constant for all transition timeouts so tuning is centralized
- No network-level interception (`waitForLoadState('networkidle')`) — DOM visibility is the definitive signal

## Alternatives Considered

1. **Increase fixed timeouts** — rejected; still fragile, just shifts the threshold
2. **Network interception** — rejected; Nuxt makes multiple background requests (analytics, prefetch) that keep the network "busy" unpredictably
3. **Playwright retries (`test.retries`)** — rejected; masks real failures and slows the suite
4. **`waitForLoadState('networkidle')`** — rejected; unreliable with SPA apps that have persistent connections

## Consequences

- Tests adapt to environment speed (fast on prod, patient on nonprod)
- Zero `waitForTimeout` calls remain in the test suite
- The 30s ceiling means a genuine failure takes up to 30s to report — acceptable tradeoff vs flaky 2s timeouts
- Any new test must use `TRANSITION_TIMEOUT` from `quiz-navigation.js` — no hardcoded delays
