---
name: pr-no-mistakes
description: Use before opening any pull request, to ship without breaking anything. Runs the no-mistakes validation gate (review, test, lint, PR, CI) and writes a human-understandable PR description with the purpose, behavior, reviewer walkthrough, screenshot when applicable, scope, and system impact. Use for "open a PR", "ship it", "submit", "don't break anything".
license: MIT
---

# PR — no mistakes

## When to use
The final step, on a committed feature branch, before the PR reaches main.

## Procedure
0. **Read `.agentic/project.md`** for branch naming, the verified test/lint commands, and what counts as
   evidence in this repo. Follow the repo's conventions, not your own defaults.
1. **Commit** your work on a feature branch cut from an up-to-date trunk (the gate validates committed
   history, not the working tree). One concern per branch — if the branch carries an earlier issue's
   commits too, stop and re-cut it from trunk.
2. **Run the gate** (kunchenguid/no-mistakes):
   - First time in a repo: `no-mistakes init`
   - Then: `no-mistakes axi run`
   - Resolve findings: `no-mistakes axi respond --action fix|approve|skip`
   It covers intent, rebase, review, test, document, lint, push, PR, CI.
3. **Write the PR description** from `templates/pr-description.md`. It REQUIRES:
   - **Plain-language purpose and behavior** — lead with why the change matters and what a person will
     observe. Explain unavoidable jargon on first use. Do not make the reviewer reconstruct intent from
     commit messages, file lists, or the diff.
   - **Reviewer walkthrough** — where to start, what to inspect or try, and the expected result.
   - **Screenshot** — only if the change is visible/UI (before/after when useful).
   - **Scope** — what changed, which files, and what was deliberately left untouched.
   - **System impact** — blast radius (Low/Medium/High), what it affects, any migrations.
4. **Do not merge** if any gate is red or required evidence is missing.

## Output
- A vetted, human-understandable PR whose description carries purpose, observable behavior, a reviewer
  walkthrough, screenshot (if UI), scope, system impact, and evidence.

## Note
- No merge queue by design. Keep changes small and scoped so each PR is safe on its own.
- The gate's **test step is also the pre-handoff checkpoint**: run it before any `handoff` so a session
  never passes unverified or broken work to the next one.
