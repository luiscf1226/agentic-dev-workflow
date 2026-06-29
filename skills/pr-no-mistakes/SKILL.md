---
name: pr-no-mistakes
description: Use before opening any pull request, to ship without breaking anything. Runs the no-mistakes validation gate (review, test, lint, PR, CI) and writes a PR description with a screenshot (if UI), the scope, and the system impact. Use for "open a PR", "ship it", "submit", "don't break anything".
license: MIT
---

# PR — no mistakes

## When to use
The final step, on a committed feature branch, before the PR reaches main.

## Procedure
1. **Commit** your work on a feature branch (the gate validates committed history, not the working tree).
2. **Run the gate** (kunchenguid/no-mistakes):
   - First time in a repo: `no-mistakes init`
   - Then: `no-mistakes axi run`
   - Resolve findings: `no-mistakes axi respond --action fix|approve|skip`
   It covers intent, rebase, review, test, document, lint, push, PR, CI.
3. **Write the PR description** from `templates/pr-description.md`. It REQUIRES:
   - **Screenshot** — only if the change is visible/UI (before/after when useful).
   - **Scope** — what changed, which files, and what was deliberately left untouched.
   - **System impact** — blast radius (Low/Medium/High), what it affects, any migrations.
4. **Do not merge** if any gate is red or required evidence is missing.

## Output
- A vetted PR whose description carries screenshot (if UI) + scope + system impact.

## Note
- No merge queue by design. Keep changes small and scoped so each PR is safe on its own.
