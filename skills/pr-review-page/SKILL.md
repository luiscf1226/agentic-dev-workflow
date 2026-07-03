---
name: pr-review-page
description: Turn a pull request into one self-contained interactive HTML review page a reviewer can read without opening the diff — plain-language summary, frontend/backend/change classification, DB model changes as tables, endpoints as cards, frontend before/after screenshots, and in-page questions that post back to the PR as @claude comments. Use for "review this PR", "make a review page", "explain this PR", "PR review artifact", "so reviewers don't read the code".
license: MIT
---

# PR Review Page

## When to use
After a PR is open (following `pr-no-mistakes`) — or on a local branch diff before the PR exists — when
a reviewer should understand and question a change **without reading the raw diff**.

## Procedure
1. **Gather the PR.** Resolve the PR number/URL (or the local branch). Pull metadata, changed files, and
   the diff via `gh pr view` / `gh pr diff` (or the GitHub MCP). Record base and head SHAs.
2. **Classify + summarize.** From the changed paths, tag the PR **frontend / backend / change** (any mix)
   and set a blast radius (Low/Medium/High). Write a faithful plain-language summary of intent — if you
   can't tell why, say so; do not invent.
3. **Extract backend changes** into review data:
   - **DB model changes** — from migration/schema diffs (Drizzle/Prisma/SQL): per table, list columns with
     `added` / `removed` / `changed` (carry the old value in `was`) / `unchanged`.
   - **Endpoints** — from route/handler diffs: method, path, purpose, auth, request params, response shapes.
4. **Extract frontend changes** — identify affected screens/routes and capture **real before/after
   screenshots**: check out `base` and screenshot each screen, then `head` and screenshot the same screen
   at the same viewport/state (`run` skill + Playwright/Chrome). Save the pairs beside the output file.
5. **Assemble.** Fill the `REVIEW` object in `templates/pr-review.html` (pr meta, `database`, `endpoints`,
   `screens`, `files`) and write `pr-<n>-review.html` next to its `screens/` images. Hide any empty section.
6. **Deliver + round-trip.** Share the file. Reviewers leave questions in-page and **Copy as PR comments** /
   Download `pr-questions.md`; post them to the PR (`gh pr comment <n> --body-file pr-questions.md`). The
   `@claude` mentions route to an agent that answers on the thread — hand to `address-pr-comments`.

## Output
- `pr-<n>-review.html` (+ `screens/` images) — a self-contained, offline, interactive review page.
- Questions captured in-page that export as `@claude` PR comments for an agent to answer.

## Rules
- **Self-contained, no secrets.** The file may be shared; embed nothing that requires a token to view.
- **Real screenshots only.** Same viewport and state at base vs head; label both SHAs. No mockups.
- **Summarize, don't editorialize.** Reflect the diff faithfully; flag uncertainty instead of guessing.
- **Review aid, not a gate.** `pr-no-mistakes` still governs merge; this page never approves anything.
- Scope discipline per `constitution.md` — read the PR, produce the page, touch nothing else.
