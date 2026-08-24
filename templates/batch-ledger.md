# Batch ledger — track <A/B/C>

Written by `run-batch`, updated after **every** issue. Carries the batch position so a dead session can
resume without re-doing shipped work. (`baton.md` carries one issue's state; this carries the batch's.)

- **Agent / harness:** <e.g. Cursor, worktree `../wt-b`>
- **Base branch:** <main>
- **Started:** YYYY-MM-DD

| # | Issue | Status | PR | Note |
|---|-------|--------|----|------|
| 1 | #<n> | pending \| in-progress \| shipped \| flagged \| blocked | | |
| 2 | | pending | | |

**Status meanings**
- `pending` — not started (or batch stopped before reaching it)
- `in-progress` — currently being worked; a `baton.md` exists for it
- `shipped` — PR open and the no-mistakes gate is green
- `flagged` — gate red / not auto-fixable; needs a human. Note the reason.
- `blocked` — ambiguous task-type or an unanswered question. Note the question.

**Resume rule:** restart at the first issue that is not `shipped`.

## End-of-batch summary
- Shipped: 
- Flagged: 
- Blocked: 
- Pending (batch stopped early — reason): 
