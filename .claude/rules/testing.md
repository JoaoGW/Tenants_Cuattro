# Testing Rules

paths:
  - "**/*.{test,spec}.{ts,tsx}"
  - "jest.config.*"
---

## General

- Test observable behavior and public contracts, not implementation details.
- Add or update tests whenever behavior changes.
- For a reproducible bug, add a failing regression test before or with the fix.
- Keep tests deterministic, independent, and readable.
- Do not weaken assertions, delete coverage, increase arbitrary timeouts, or skip tests to make a change pass.

## Jest

- Unit-test pure logic, validation, and route behavior.
- Mock external boundaries only: network, time, repositories, and third-party services.
- Do not mock the unit under test.
- Cover expected success, invalid input, failure behavior, and relevant edge cases.

## Validation Sequence

Run the narrowest relevant test first, then run the applicable project checks:

`npm run lint`  
`npm run typecheck`  
`npm test`  
`npm run test:e2e`

If a command is unavailable, fails because of unrelated existing work, or cannot run locally, report that fact clearly for the user to see/validate and give a veridict about what to do next.