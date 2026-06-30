---
name: execute-plan
description: Use to execute one approved sub-plan/baton for a single issue — auto-detects whether the task is create, modify, fix, or test, runs the right approach, leaves evidence, and keeps the baton current. Sits between plan-parallelize and pr-no-mistakes. Use for "execute the plan", "build this issue", "do the task", "run the sub-plan".
license: MIT
---

# Execute Plan

## When to use
After `plan-parallelize` (single mode, or one wave-item) has produced an approved sub-plan/baton,
before `pr-no-mistakes`. One issue at a time.

## Procedure
1. **Detect the task-type** from the issue/baton — do not ask the human to label it:
   - **create** — new feature/file/module → build it from the spec.
   - **modify** — change existing behavior → locate the surface, change only what's in scope.
   - **fix** — defect → reproduce first, then patch the cause, not the symptom.
   - **test** — coverage → add tests that fail before the change and pass after.
   If the issue is mixed or the type is ambiguous, **stop and confirm** — never guess-route.
2. **Execute within the sub-plan's scope only.** Touch only the files the sub-plan allows.
3. **Leave evidence** per the sub-plan's test plan — screenshot (UI) or query/test run (backend).
4. **Keep the baton current** (`templates/baton.md`): status, progress, next — as you go, not at the end.
   If the session goes sideways (bad approach, lost context, session switch), invoke `handoff`.
5. **Hand to `pr-no-mistakes`** once the sub-plan's "done" is met and evidence exists.

## Output
- Working, in-scope changes with evidence, and an up-to-date baton ready for `pr-no-mistakes`.

## Rules
- One issue, one task-type, one scope. Mixed work goes back to `plan-parallelize` to split.
- Reproduce before you fix; assert before you call a test done.
