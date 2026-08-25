---
name: plan-parallelize
description: Use to turn issues into a master plan plus per-issue sub-plans and assign parallel work across git worktrees. Lets the human review one plan while sub-plans are auto-governed. Use for "plan", "parallelize", "run in parallel", "worktrees", "plan of plans".
license: MIT
---

# Plan & Parallelize

## When to use
After `issues`, before building. Scales from 1 to many issues.

## Procedure
0. **Single mode (one issue) — `--single`:** skip the master plan and waves. Write exactly one sub-plan
   for the chosen issue and seed a baton from `templates/baton.md`. The human approves that one plan,
   then `execute-plan` builds it and `pr-no-mistakes` ships it. Use this for a single focused task; use
   the steps below for many issues.
1. **Master plan (human reviews this one):** order issues into dependency-driven waves with a concurrency
   cap (default 4 worktrees). Output it as a plan the human approves.
   **Compute the file-overlap map first — do not assign tracks by feel.** Take each issue's
   files/modules (from the issue body / `phases.md`) plus the risk areas in `.agentic/project.md`, then:
   - two issues sharing any file go in the **same** track, ordered — never in parallel tracks;
   - anything listed as a risk area is treated as shared by default;
   - an issue with no declared edit surface is not parallelizable until someone declares it.
   Show the owned-files column per track in the master plan so the human can sanity-check the split.
2. **Sub-plans (auto-governed):** for each issue write a sub-plan using `templates/sub-plan.md`
   (goal, files in scope, out of scope, approach, depends-on, test plan, evidence). A reviewer agent
   approves each against `constitution.md`; the human only sees exceptions (see constitution escalation rules).
3. **Execute in bounded waves.** Never spawn the whole backlog. Use `orchestrate-team` to coordinate up
   to 4 worker worktrees, one per track (e.g. Claude Code, Cursor, Codex); respect file locks. It hands
   each track's ordered issue list to `run-batch` so that worker loops the whole track to completion
   instead of stopping after one issue.
4. **Optional — Lavish plan (ON REQUEST ONLY, never automatic):** when the user asks, promote a chosen
   issue (or the master plan) into an interactive Lavish plan for hands-on annotation:
   `npx lavish-axi <plan>.html`. Do not do this unless explicitly asked.

## Output
- Master plan, per-issue sub-plans, worktree assignment. Optionally a Lavish plan (on request).
- Single mode: one approved sub-plan + a seeded baton (`templates/baton.md`) for `execute-plan`.

## Rules
- Each agent touches only files in its sub-plan's scope.
