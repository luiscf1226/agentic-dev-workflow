---
name: orient
description: Use as the FIRST step on any project you haven't mapped yet — especially an existing/inherited codebase. Reads the repo and writes .agentic/project.md, the shared map every other skill and teammate reads instead of re-discovering the stack. Use for "onboard me", "new to this repo", "understand this codebase", "existing project", "where do I start", "what is this project", "get up to speed".
license: MIT
---

# Orient

## When to use
**Before any other skill, on any project whose `.agentic/project.md` is missing or stale.**

- **Existing/inherited codebase** — this is the entry point. You cannot plan work you don't understand.
- **New project** — run it once the skeleton exists (after the first commits), so later skills and
  teammates inherit the same conventions.
- **Re-run when stale** — stack change, new test runner, restructure, or the file is older than the
  conventions it describes.

Everyone on the team reads the same map, so two teammates don't derive two different pictures of the
same repo.

## Procedure
1. **Read before asking.** Derive as much as possible from the repo itself — don't interview the user
   for what the code already answers:
   - **Stack** — language(s), framework, package manager (from lockfile, not assumption), runtime version.
   - **Run + test + lint** — the real commands, from `package.json` scripts / `Makefile` / `justfile` /
     CI workflow. CI is the most reliable source: it shows what actually must pass.
   - **Layout** — entry points, where routes/handlers live, where UI lives, where tests live, shared libs.
   - **Data** — ORM/schema location, migration tool and command, how a local DB is seeded.
   - **Auth + roles** — how identity works and how roles are named (verbatim — `superadmin` vs `admin`
     matters to `add-logger-watchdog` and `security-audit`).
   - **Conventions** — branch naming, commit style, PR template, existing test style, existing design
     tokens/theme. Prefer observed patterns (git log, existing files) over stated ones.
   - **Environment** — required env vars **by name only** (never values), external services.
2. **Verify the commands actually work.** Run the install, build, and test commands you found. A map
   that documents a broken or wrong command is worse than no map. Record what passed, what failed, and
   what you couldn't verify.
3. **Note the risk areas.** Files/modules that are large, shared by everything, untested, or obviously
   hazardous to touch in parallel. `plan-parallelize` uses these to keep two agents off the same file.
4. **Write `.agentic/project.md`** from `templates/project.md`. Mark anything you could not verify as
   `UNVERIFIED` — never guess a command into the file.
5. **Confirm the gaps with the human — once.** Ask only about what the repo genuinely cannot answer
   (staging URLs, which flows matter most, tribal knowledge). Fold the answers in and commit the file.

## Output
- `.agentic/project.md` — the shared project map: stack, verified commands, layout, conventions, roles,
  risk areas, and an explicit list of what's unverified.

## How other skills use it
Any skill with a "discover the stack / map the surface" step reads `.agentic/project.md` **first** and
only investigates what the map doesn't cover — `improve-ui-ux`, `security-audit`,
`create-test-plan-demo`, `add-logger-watchdog`, `execute-plan`, and `pr-no-mistakes` (for the real test
and lint commands).

## Rules
- **Read-only.** `orient` maps the project; it never refactors, upgrades, or "fixes" what it finds.
  Write exactly one file: `.agentic/project.md`.
- **No secrets.** Env vars by name only — never copy values out of `.env` into the map.
- **Unverified is a valid answer.** Say "UNVERIFIED" rather than writing a plausible-looking command.
- Commit the map — it's a team artifact, not a personal scratch file.
