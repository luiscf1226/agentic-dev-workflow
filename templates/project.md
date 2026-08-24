# Project map — <project name>

Written by `orient`. The shared source of truth for **how this repo works**, read by every other skill
and every teammate. Regenerate with `orient` when it goes stale.

- **Mapped on:** YYYY-MM-DD (commit `<sha>`)
- **Project type:** new (greenfield) | existing (inherited)

## Stack
| Field | Value |
|-------|-------|
| Language / runtime | <e.g. TypeScript, Node 20> |
| Framework | <e.g. Next.js 15 App Router> |
| Package manager | <from the lockfile — pnpm / npm / yarn / bun> |
| Database + ORM | <e.g. Postgres + Drizzle> |
| Auth | <e.g. NextAuth / Clerk / custom JWT> |

## Commands — verified
Mark each one `verified` (you ran it) or `UNVERIFIED`. Never guess.

| Purpose | Command | Status |
|---------|---------|--------|
| Install | | |
| Run (dev) | | |
| Build | | |
| Test (all) | | |
| Test (single file) | | |
| Lint / format | | |
| Typecheck | | |
| Migrate | | |
| Seed | | |

## Layout
| What | Where |
|------|-------|
| App entry point | |
| Routes / API handlers | |
| UI components | |
| Shared libs / utils | |
| DB schema / migrations | |
| Tests | |
| Design tokens / theme | |

## Roles
Exact names as they appear in code (`superadmin` ≠ `admin`).

| Role | How it's checked | Can do |
|------|------------------|--------|

## Conventions
- **Branch naming:** <observed from git log, e.g. `feat/<issue>-slug`>
- **Commit style:** <e.g. conventional commits>
- **Test style:** <framework + where tests live relative to source>
- **PR requirements:** <template, required checks, reviewers>
- **Evidence norm:** <what counts as proof here — screenshot tool, test output, query>

## Environment
Names only — **never values**.

| Var | Needed for | Where to get it |
|-----|------------|-----------------|

External services: <e.g. Stripe test mode, S3 bucket, staging URL>

## Risk areas
Shared/fragile surfaces. `plan-parallelize` keeps parallel agents off these; `run-batch` never assigns
two of these to different tracks at once.

| File / module | Why risky | Rule |
|---------------|-----------|------|

## Unverified / unknown
Everything the map could not confirm. Be explicit — this is the list the next person picks up.
- 
