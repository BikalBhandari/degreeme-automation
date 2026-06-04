# UI Testing Context

## Glossary

| Term | Definition |
|------|-----------|
| Quiz | The DegreeMe recommendation tool — a multi-step form that collects user preferences and returns AI-generated degree suggestions |
| Degree Type | The first quiz selection: Undergraduate degree, Graduate degree, or Graduate certificate |
| Education Status | Optional credentials the user already holds (e.g., High school diploma, Bachelor's degree) |
| Interest Area | One of 9 broad academic fields (e.g., Technology, Business, Engineering) |
| Sub-Interest | A narrower specialization within an interest area (e.g., "Web development" under Technology) |
| Environments | Work environment preferences (e.g., Fast-paced, Tech-focused and data-driven) |
| Preferences | Activity preferences that influence recommendations (e.g., "Solving complex problems with data") |
| Results | The 5 AI-generated degree cards shown after completing the quiz |
| Degree Card | A single recommendation showing the program name, degree level, and "Read more" link |
| TRANSITION_TIMEOUT | Shared constant (30000ms) used across all navigation helpers for DOM-based waiting |
| Full Flow | A test path that makes real selections at every step — no skips |
| Discovery Test | A canary test that fails if quiz options change, signaling quiz-paths.js needs updating |

## Boundaries

- This context tests the **quiz UI flow** only — not the underlying API, not the AI model, not the CMS that provides content.
- Tests run against the deployed Nuxt 3 app (nonprod or prod). They do not mock the backend.
- Results relevance is checked via keyword matching against sub-interest names — not a semantic evaluation of AI output quality.
