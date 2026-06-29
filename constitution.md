# Constitution

Shared rules every skill in this library inherits. Reviewers and gates enforce these.

## Scope
- Touch only the files the task/sub-plan names. No adjacent refactors.

## Evidence
- Every task ends with proof. UI change -> screenshot. Backend change -> query result or API response.

## Pull requests
- Must use `templates/pr-description.md`: screenshot (if UI) + scope + system impact.
- Must pass the `no-mistakes` gate (review, test, lint, CI) before merge.

## Plan review (for parallel work)
- The human reviews ONE master plan. Per-issue sub-plans are approved by a reviewer agent against this
  constitution. Escalate to the human only when a sub-plan: touches schema/auth/shared modules, fails
  review twice, exceeds 8 files or 400 LOC, raises an ambiguity flag, or conflicts with another issue.

## Cost
- Hard token/cost ceiling per run; cross it and stop.
- Model tiering: best model for judgment + review; cheaper model for bulk work; cap concurrency at ~4 worktrees.
