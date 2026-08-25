# Team run — <project / objective>

Written and maintained by `orchestrate-team` at `.agentic/team-runs/<slug>.md`. This is the durable
control-plane view; worker batons and batch ledgers remain the source of truth inside their individual
tracks.

- **Objective:** <what the human asked the team to accomplish>
- **Leader / harness:** <agent and runtime>
- **Master plan:** <path or URL>
- **Base branch:** <main>
- **State:** planning | running | reviewing | complete | blocked
- **Started:** YYYY-MM-DD
- **Concurrency cap:** <1-4 worker worktrees>
- **Run budget:** <token/cost/time ceiling>

## Team roster

| Agent | Role | Worktree / runtime | Owns | Status |
|-------|------|--------------------|------|--------|
| | leader | | coordination, decisions, final synthesis | running |
| | worker | | <track / files> | pending |
| | reviewer | read-only | review and evidence | pending |

## Task board

| Task | Issue | Owner | Depends on | Owned files | Status | Evidence / PR | Next |
|------|-------|-------|------------|-------------|--------|---------------|------|
| | | | | | pending | | |

**Statuses:** `pending`, `ready`, `running`, `review`, `fix`, `shipped`, `flagged`, `blocked`.

## Event log

Record decisions and state transitions, not conversational noise.

| Time | Type | Task | From → To | Summary | Artifact / evidence |
|------|------|------|-----------|---------|---------------------|
| | progress \| dependency_request \| blocked \| result \| review_result | | | | |

## Decisions and escalations

| Time | Decision / question | Owner | Resolution | Effect on plan |
|------|---------------------|-------|------------|----------------|
| | | | | |

## Completion summary

- **Shipped:**
- **Flagged:**
- **Blocked:**
- **Pending:**
- **Evidence:**
- **Budget used:**
- **Human actions remaining:** review and merge approved PRs
