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

**RFI (Request for Information)**:
A lead submission form where a prospective student requests to be contacted. Creates an interaction record in Salesforce.
_Avoid_: Lead form, contact form, inquiry

**UNDECIDED RFI**:
An RFI submitted from the page-level "Request Info" button on the results page. The user has not selected a specific program. Identified as undecided in Salesforce.
_Avoid_: General RFI, page RFI

**Program-Specific RFI**:
An RFI submitted from a "Request Info" button inside a degree card. Tied to a specific program key in Salesforce.
_Avoid_: Card RFI

**Connect with us Modal**:
The overlay form that appears when clicking "Request Info" on the results page. Contains first name, last name, email, phone (with country code), and military status fields.
_Avoid_: RFI form, request form

**BritVerify**:
Third-party validation service that checks email deliverability and phone number validity in real-time before form submission is accepted.
_Avoid_: Email validator, phone validator

**embtest Prefix**:
Naming convention applied to first and last name fields in test RFI submissions, making them identifiable as test data in Salesforce (e.g., `embtestJohn`).
_Avoid_: Test prefix

## Boundaries

- This context tests the **quiz UI flow** only — not the underlying API, not the AI model, not the CMS that provides content.
- Tests run against the deployed Nuxt 3 app (nonprod or prod). They do not mock the backend.
- Results relevance is checked via keyword matching against sub-interest names — not a semantic evaluation of AI output quality.
