---
name: orchestrate-team
description: Lead a bounded multi-agent software run by assigning non-overlapping worktree tracks, coordinating structured progress and dependency messages, routing results through independent review, and replanning stalled work. Use for "orchestrate a team", "lead multiple agents", "agents collaborate", "delegate this backlog", or "coordinate parallel agents". Use a single agent instead when the work has no safe parallel split.
license: MIT
---

# Orchestrate Team

## When to use
After `plan-parallelize` has produced an approved master plan with at least two parallel-safe tracks, or
when the task genuinely benefits from separate implementation and evaluation agents. The agent that
loads this skill becomes the **leader**: it retains the user conversation, global constraints, budget,
task state, and final synthesis.

Do not create a team merely because the runtime supports one. If the work has one edit surface, tight
sequential dependencies, or cannot fund a complete additional worker, use `plan-parallelize --single`
and `execute-plan` instead.

## Roles

- **Leader:** plans assignments, dispatches workers, maintains the team ledger, resolves dependencies,
  detects stalls, requests review, and reports to the human. It does not silently become an extra
  implementation worker while coordinating a live team.
- **Workers:** one per non-overlapping track/worktree. Each receives bounded scope and normally runs
  `run-batch` for its ordered issues or `execute-plan` for one issue.
- **Reviewer:** independent from the worker whose output it judges. It checks the approved plan,
  `constitution.md`, diff, and evidence; it returns pass or actionable findings rather than praising
  the work generically.
- **Human:** approves the master plan and every irreversible action, including merge. Existing
  constitution escalation rules still apply.

## Procedure

1. **Load shared state.** Read `.agentic/project.md`, `constitution.md`, and the approved master plan.
   Confirm every track declares its dependencies, owned files, done condition, and evidence. Send an
   undeclared edit surface back to `plan-parallelize`; do not improvise ownership during dispatch.
2. **Choose the topology.** Use the smallest team that covers the independent tracks, with at most four
   concurrent worker worktrees. Prefer the strongest available model for leader/reviewer judgment and
   cheaper capable models for bounded implementation work, within the run budget.
3. **Check runtime capability.** If the harness supports subagents, messages, and waits, create the
   workers there. Otherwise write complete task packets and worktree assignments for the human to
   launch. Never claim an agent was created, messaged, or monitored when the runtime cannot do it.
4. **Start the ledger.** Seed `.agentic/team-runs/<slug>.md` from `templates/team-run.md`, give every
   worker its path, and update it after every assignment, status change, decision, review, and
   escalation. The ledger is the durable fallback for session loss; runtime messages are the fast path.
5. **Dispatch bounded task packets.** Each worker receives:
   - task/issue IDs and one measurable goal;
   - owned worktree and files in/out of scope;
   - dependencies and which outputs it may consume;
   - done condition, verified commands, and required evidence;
   - budget/stop conditions and the structured message contract below.
6. **Run the coordination loop.** Continue until every task is `shipped`, `flagged`, `blocked`, or
   `pending` for an explicit reason:
   - receive worker events and update the ledger immediately;
   - unblock independent tracks without waiting for an unrelated blocked worker;
   - route dependency requests through the leader; direct worker-to-worker messages are allowed only
     for a named dependency and must also be reflected to the leader;
   - only the leader may change scope, ownership, ordering, or the approved plan;
   - after the same blocker or evidence-free attempt repeats twice, stop that path, record the failed
     approaches, and replan or escalate instead of spending another worker blindly;
   - do not let workers create their own subteams unless the approved plan explicitly delegates that
     authority and budget.
7. **Review independently.** Route each completed unit and its evidence to the reviewer. Findings go
   back to the owning worker for a bounded correction loop. Two failed reviews trigger the existing
   human escalation rule. Passing work proceeds through `pr-no-mistakes`; nobody merges.
8. **Synthesize once.** Return one leader-owned report listing shipped PRs, fixes requested by review,
   flagged/blocked/pending work, evidence, material decisions, and budget used. Do not dump raw agent
   chatter on the user.

## Message contract

Workers send concise structured events rather than free-form status conversation:

```yaml
type: progress | dependency_request | blocked | result | review_result
task: <issue or task id>
from: <agent role/name>
status: <current task status>
summary: <what changed or what is needed>
artifacts: [<commit, PR, baton, log, screenshot, or query>]
needs: <leader action or dependency; omit when none>
```

A `result` without the required evidence is still in progress. A message cannot grant new scope or
authorize an irreversible action.

## Output

- A current team-run ledger, bounded task packets, independently reviewed results, and one synthesized
  completion report.
- In a runtime without native team support: the ledger plus launch-ready worktree assignments, clearly
  marked as not yet running.

## Rules

- Hub-and-spoke by default: workers report to the leader; peer communication is narrow and visible.
- One worktree owns a file at a time. Overlapping work stays in one ordered track.
- The leader owns coordination and the final answer; workers own only their assigned artifacts.
- No worker reviews its own change, merges a PR, or expands its scope.
