# Baton — issue #<N>

The single source of truth for one issue as it moves from plan → execution → handoff/PR.
`plan-parallelize` (single mode) seeds it, `execute-plan` keeps it current, `handoff` refreshes it
for a fresh session.

- **Issue:** #<N> — <title>
- **Task-type:** create | modify | fix | test   <!-- detected by execute-plan; never hand-set -->
- **Status:** planned | executing | verified | handed-off | failed
- **Scope:** <files this task may touch — enforced>
- **Done means:** <one sentence; the exit condition>
- **Progress:** <steps completed so far>
- **Next:** <the exact next action a fresh session should take — no re-planning>
- **Evidence:** <screenshot (UI) | query/test run (backend)>
- **Verified before handoff:** <yes / no — test-gate result>
- **Handoff trigger:** <bad approach | lost context | session switch | — >   <!-- only if handed off -->
