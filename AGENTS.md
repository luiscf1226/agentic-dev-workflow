# AGENTS.md — router for any harness

Skills live in `skills/`. Each is a self-contained folder with a `SKILL.md`.
Load the one whose description matches the task; ignore the rest.

To make these skills available in this harness, load `skills/install/SKILL.md` (or run `./install.sh`).
The intended order is `problem → spec → phases → issues → design → plan-parallelize → pr-no-mistakes`,
but each is independent — run any subset.

## Non-negotiables (apply to every skill)
1. **Surface assumptions before building.** If requirements conflict, stop and ask.
2. **Touch only what you're asked.** No drive-by refactors.
3. **Leave evidence.** A task is not done without proof (test run, screenshot, query, log).
4. **Keep PRs small.** One concern per PR.
5. **A human owns irreversible calls** (problem agreement, merge to main).

Full rules: `constitution.md`.
