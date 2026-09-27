# TypeScript Rules

paths:
  - "**/*.{ts,tsx}"
---

## TypeScript

- Preserve the established file structure, naming, exports, and import style.
- Prefer explicit types at system boundaries: API payloads, environment configuration, and external integrations.
- Prefer inference for obvious local values.
- Do not use `any`, `@ts-ignore`, broad type assertions, or disabled lint rules to silence an error.
- Keep functions focused on one responsibility.
- Do not create reusable abstractions for a single use case.
- All imports should be grouped by their alias. Each grouped alias should have a complete line spacement (blank line)

## Code and Methods documentation (Comments)

- All `let` and `const` variables placed inside functions or in the top of files should have a one-line comment
- All functions/methods should the following documentation pattern:
  ```
    /**
      * Brief description of the method, what the do and where it's used on the code (references). Max: 2 lines
      *  
      * @remarks this is a section used to provide extra, in-depth information about a method, class, or property
      * This one can have maximum of 5 lines
      *
      * @params name, parameter type and what is his doing here
      * @return What this method is returning
    **/
  ```
- Comment decisions, constraints, or non-obvious behavior only.
- Do not write comments that restate the code.
- Do not create TODO comments.

## Types and Interfaces

- All types for specific components should be placed inside the folder using `@types` as a name. Types for generic uses or that are used in multiple places in the code, should stay at the main `@types` folder on the root.
- All interfaces for specific components should be placed inside the folder using `Interfaces` as a name. Interfaces for generic uses or that are used in multiple places in the code, should stay at the main `Interfaces` folder on the root.
- Interfaces names should have a "I" character at the beginning. Example: `ILogin`.
- Types names should have a "Types" at the end of each name. Example: `LoginTypes`.
