---
name: new-feature
description: Start a new task in an isolated Git worktree branched from origin/main (or the repo's trunk) so multiple agents can work in parallel without conflicts. Use at the beginning of every new feature, fix, or task — before writing any code. Use for "new feature", "isolate in a worktree", "start this task", "don't build on main".
license: MIT
---

# New Feature

Every task gets its own worktree and branch, created from the latest trunk. Never build on `main` /
`master`, and never reuse another agent's worktree or branch.

Adapted from [michaelshimeles/skills](https://github.com/michaelshimeles/skills) `new-feature`, aligned
with this library's `orient` → `plan-parallelize` → `execute-plan` path.

## When to use
Before writing code for a new feature, fix, or task — especially when more than one agent or session
may touch the same repo. For an already-approved sub-plan, still isolate first, then load `execute-plan`.

## Harness deltas — read first
- **Claude Code:** the harness creates worktrees (under `.claude/worktrees/<name>`). Skip steps 3–4
  (no manual `git worktree add` / `remove`). Keep the harness-assigned branch name. Steps 1–2 and 5
  still apply.
- **Cursor-managed worktrees** (branches named `worktree-*`): keep the assigned branch and worktree;
  apply steps 1–2 and 5.
- **`orchestrate-team` / `plan-parallelize`:** use the worktree the leader already assigned. Do not
  create a second one for the same task.
- Any other harness: follow all steps.

## Procedure
0. **Read `.agentic/project.md`.** Use its branch-naming convention and verified install command. If
   the map is missing, run `orient` first.
1. **Sync:** `git fetch origin`.
2. **Scope check:** `gh pr list` and skim open PRs' files (`gh pr diff <n> --name-only`). If this task
   needs files another open PR is editing, **stop and ask** instead of stacking a conflicting branch.
   Also check for uncommitted work in shared checkouts — another agent may be mid-task.
3. **Name the task:** lowercase-with-hyphens plus a short unique suffix (e.g. `user-auth-0816a`). If
   `git worktree add` fails because the name exists, pick a different name — never force or reuse.
4. **Create the worktree** from the repo root into a **gitignored** directory (`.worktrees/` or
   `.claude/worktrees/`):

   ```bash
   git worktree add <worktrees-dir>/<task-name> \
     -b <branch-prefix>/<task-name> origin/<trunk>
   ```

   Trunk is `main` or `master` as documented in `.agentic/project.md`. Branch prefix follows that map
   (often `feat/`).
5. **Enter and verify:**

   ```bash
   cd <worktrees-dir>/<task-name>
   git branch --show-current   # must print your new branch, not trunk
   ```

   Install dependencies **inside this worktree** (worktrees do not share `node_modules` / virtualenvs)
   using the map's verified install command. Confirm the runtime version the repo requires.

6. **Hand off:** with the worktree isolated, continue with `plan-parallelize --single` (if no sub-plan
   yet) then `execute-plan`. Do not start coding on trunk.

## Remember
- Worktrees do **not** isolate shared resources: ports, shared databases, and lockfiles are global.
  Confirm a port answers *your* process (`lsof -i :<port>` or `ss -ltnp "sport = :<port>"`) before
  trusting what it serves. Resolve lockfile conflicts by regenerating, never by hand-merging.
- Never force-push to trunk. On your own task branch after a rebase, only `--force-with-lease`.
- Keep the worktree until the PR is merged or closed. Cleanup after merge:

  ```bash
  git worktree remove <worktrees-dir>/<task-name>
  git branch -D <branch-prefix>/<task-name>
  ```

  `-D` is expected after a squash- or rebase-merge (`-d` refuses even though the work is merged).

## Output
- A unique worktree + branch cut from up-to-date trunk, scope-checked against open PRs, ready for
  `execute-plan`.

## Rules
- One worktree and one branch per task and per agent.
- If a conflict can't be resolved confidently, stop and report instead of guessing.
