# CLAUDE.local.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

**Important Info:** These guidelines are local for this user's preferences. Don't use it as a new global parameter for all projects (old and new ones). 

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. Implementation Patterns

**Always follow the coding patterns already present in the project.**

Don't try to write a new code implementation following a totally different manner of implementation.
If the project already uses a given pattern, library, or helper, use it the same way.

Why would you overcomplicate it? Always remember the second section of this Markdown file!

## 6. Creating Documentations

If you are requested to create some documentations for a method/function, always follow this pattern:

```
    /**
        Brief description of what does that following code does. Maximumn of 3 lines
        @params Make a list of the parameters that this function/method has
        @params Place the name of the parameter and a one line description for each param
        return Explain what is the expected return that this function will bring
    */
```

if you are requested to create some documentations for a variable, always follow this pattern:

```
    // Type of the variable - What it is used for - Uses in the code
```

Avoid any unnecessary documentation and weird comment lines. Never write a TODO comment on the code.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.