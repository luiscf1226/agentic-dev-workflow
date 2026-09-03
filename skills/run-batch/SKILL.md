---
name: run-batch
description: Use to run one agent through a whole batch of issues without stopping between them — repeats plan-parallelize --single, execute-plan, and pr-no-mistakes per issue until the batch is done. Use for "work through these issues", "don't stop after one", "give this agent a batch", "run N issues in a loop".
license: MIT
---

# Run Batch

## When to use
`orchestrate-team` has split a backlog across up to 4 worker worktrees (any harness — Claude Code,
Cursor, Codex, Gemini CLI), or the human has made the same bounded assignment, and each worker should
churn through its assigned issues end-to-end without stopping after every issue.

## Input
An ordered list of issue refs assigned to *this* agent (e.g. `#12, #14, #19`). Independent issues only —
if two issues in the batch touch the same files, `plan-parallelize` should have put them in the same
track, ordered; this skill does not resolve cross-issue file conflicts.

## Before the loop
1. Read `.agentic/project.md` (from `orient`) for the real branch naming, test, and lint commands.
   If it's missing, run `orient` first — do not guess this repo's conventions.
2. Seed a batch ledger from `templates/batch-ledger.md` with every issue in the batch at `pending`.
   This is what makes a batch resumable if the session dies mid-run.

## Procedure
For each issue in the batch, in order:

1. **Start from a clean base — mandatory.** Isolate with `new-feature` (or `git checkout <main> &&
   git pull` inside this worker's assigned worktree) before planning the issue, so each issue's
   branch is cut from trunk. Never reuse another issue's dirty tree.
   **Exception:** if the sub-plan's `Depends on` names an earlier issue in this batch whose PR is still
   open, branch from that issue's branch instead and say so in the PR description.
   *Skipping this is the single most likely way to corrupt a batch: without it, issue 2 branches off
   issue 1's unmerged work and its PR silently contains both diffs, breaking "one concern per PR".*
2. `plan-parallelize --single <issue>` — sub-plan + baton. Auto-approved against `constitution.md`;
   only constitution escalations reach the human.
3. `execute-plan` — build it. If it hits its own stop-and-confirm case (mixed/ambiguous task-type),
   mark the issue `blocked`, ask, and **move to the next issue** — never stall the whole batch.
4. `pr-no-mistakes` — ship it. If the gate is red and not auto-fixable, mark the issue `flagged` with
   the reason and move on.
5. **Update the ledger** (`shipped` / `flagged` / `blocked` + PR number) before starting the next issue.
6. **Check the budget.** `constitution.md` sets a hard cost ceiling per run. If the remaining budget
   won't cover another full issue, stop the batch cleanly, leave the rest `pending`, and report — do
   not start an issue you can't finish.
7. **Continue immediately to the next issue.** No confirmation between issues — that's the point of this
   skill. Only the conditions above pause a single issue; nothing pauses the whole run.

## Output
- One PR per shipped issue, plus the completed ledger.
- An end-of-batch summary: shipped (with PR numbers), flagged (with reasons), blocked (with the question),
  pending (with why the run stopped). **Every issue in the batch gets a final status.**

## Resuming
If the session dies mid-batch, a fresh session reads the ledger and restarts at the first non-`shipped`
issue. Use `handoff` for the in-flight issue's own state; the ledger carries the batch position.

## Rules
- Still one issue, one task-type, one scope, one PR — this skill removes the *stop-and-wait* between
  issues, it does not relax `execute-plan`'s or `pr-no-mistakes`'s rules.
- Never silently drop an issue. Unfinished is a reportable status, not an omission.
- Never merge. Batches open PRs; humans own merges (`constitution.md`).
