---
name: pr-no-mistakes
description: Use before opening any pull request, to ship without breaking anything. Runs the no-mistakes validation gate (review, test, lint, PR, CI) and writes a human-understandable PR description that briefs a tech lead or CTO before presenting optional implementation detail. Use for "open a PR", "ship it", "submit", "don't break anything".
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
   - **Executive summary** — write as if briefing a tech lead or CTO who understands software but has
     not followed the implementation. Explain the problem, the practical change, and why it matters in
     2-4 plain-language sentences.
   - **Before and after** — show the workflow or behavior change directly. Separate distinct changes
     into bullets or rows; never compress the whole PR into one technical paragraph.
   - **Impact before implementation** — explain user/team value, operational effect, risk, and rollout
     before file names or internal mechanics. Define unavoidable jargon on first use.
   - **Reviewer walkthrough** — where to start, what to inspect or try, and the expected result.
   - **Screenshot** — only if the change is visible/UI (before/after when useful).
   - **Scope** — what changed, which files, and what was deliberately left untouched.
   - **System impact** — blast radius (Low/Medium/High), what it affects, any migrations.
   - **Optional implementation details last** — include only details that help the review. Do not make
     the reviewer reconstruct intent from commit messages, file lists, or the diff.
4. **Do not merge** if any gate is red or required evidence is missing.

## Output
- A vetted PR that a tech lead or CTO can understand from the executive summary, before/after behavior,
  impact, risk, and reviewer walkthrough, with optional technical detail kept secondary.

## Note
- No merge queue by design. Keep changes small and scoped so each PR is safe on its own.
- The gate's **test step is also the pre-handoff checkpoint**: run it before any `handoff` so a session
  never passes unverified or broken work to the next one.
