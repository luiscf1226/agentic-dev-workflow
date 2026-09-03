# Constitution

Shared rules every skill in this library inherits. Reviewers and gates enforce these.

## Project map (team baseline)
- Every project has a committed `.agentic/project.md`, written by `orient`. Skills read it instead of
  re-deriving the stack, so two teammates get the same picture of the same repo.
- **Never invent a project command.** Test/lint/run/migrate commands come from the map (verified) or from
  the repo. A fabricated command that appears to pass is worse than no evidence.
- If the map is wrong, fix the map in the same PR. A stale map misleads everyone downstream.

## Isolation
- Never build on trunk. One worktree and one branch per task and per agent (`new-feature`).
- Worktrees do not isolate ports, shared databases, or lockfiles. Confirm the process on a port is
  yours before treating it as evidence. Regenerate lockfiles; never hand-merge them.
- Before starting, scope-check open PRs' files. On overlap, stop and ask.

## Scope
- Touch only the files the task/sub-plan names. No adjacent refactors.
- Repeated operational mechanics belong in a service layer; domain policy stays in the calling flow
  (`code-structure`). Do not extract one-off logic.

## Evidence
- Every task ends with proof (`evidence-driven-testing`). UI change → before/after screenshots (or
  video). Backend change → measured query/API output. Prose is not evidence.
- Capture the **before** state while reproducing a defect, *before* writing the fix.
- Evidence artifacts live in `.artifacts/` (not committed). Pair UI shots with `before-and-after`.

## Pull requests
- Must use `templates/pr-description.md`: executive summary, before/after behavior, value, reviewer
  walkthrough, screenshot (if UI), scope, risk, evidence, then optional technical detail.
- Must pass the `no-mistakes` gate (review, test, lint, CI) before merge.
- **One concern per branch, cut from an up-to-date trunk.** A branch carrying an earlier issue's commits
  is re-cut, not shipped — this is the failure mode batched/parallel runs hit most often.
- Agents open PRs; **humans merge.** No agent merges to main.

## Plan review (for parallel work)
- The human reviews ONE master plan. Per-issue sub-plans are approved by a reviewer agent against this
  constitution. Escalate to the human only when a sub-plan: touches schema/auth/shared modules, fails
  review twice, exceeds 8 files or 400 LOC, raises an ambiguity flag, or conflicts with another issue.

## Cost
- Hard token/cost ceiling per run; cross it and stop.
- Model tiering: best model for judgment + review; cheaper model for bulk work; cap concurrency at ~4 worktrees.
