---
name: handoff
description: Use to hand an in-flight task to a fresh session when the current one can no longer be trusted to finish — a bad approach, lost context, or a deliberate session switch. Verifies before handing off, then writes a resumable baton .md so the next session continues clean. Use for "handoff", "hand this off", "context is lost", "switch sessions", "start fresh".
license: MIT
---

# Handoff

## When to use
Mid-execution, NOT as a routine step. Fire it the moment the current session can no longer be trusted
to finish. Three triggers:
- **Bad approach** — the agent is down a wrong path and iterating won't recover it.
- **Loss of context** — the window is bloated/degraded; earlier decisions are being forgotten.
- **Session switch** — you (or the orchestrator) are deliberately moving the work to another session/agent.

## Procedure
1. **Verify first — never hand off broken state.** Run the test/verify step from `pr-no-mistakes`
   (the gate's test phase). A baton that hands off red work just moves the bug to the next session.
   Record the result in the baton; if it can't be made green, hand off as `status: failed` so the next
   session knows it's inheriting a problem, not progress.
2. **Write the baton** using `templates/baton.md` — issue, detected task-type, status, what's done,
   the exact `next` action, files touched, and the trigger that fired the handoff.
3. **Point the new session at the baton.** It reads the baton first and resumes from `next`; it does not
   re-plan or restart from zero.
4. **Stop the dead session.** Set the baton `status` and stop editing — no parallel work from the session
   you just abandoned.

## Output
- A committed `baton.md` (the resumable handoff artifact) and a clean stopping point.

## Rules
- The baton is the single source of truth between sessions — if it isn't in the baton, it didn't happen.
- Always verify before writing the baton. Handoff is a rescue, not an escape from the test gate.
