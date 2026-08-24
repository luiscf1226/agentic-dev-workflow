---
name: create-test-plan-demo
description: Write a step-by-step demo/QA test plan as Markdown under docs/test-plans/<slug>-demo.md — Action → Expected steps, prerequisites, edge/negative cases, and sign-off. Use for "/create-test-plan-demo", "create test plan", "demo test plan", "QA walkthrough".
license: MIT
---

# Create Test Plan Demo

## When to use
When the user needs a demo script, QA walkthrough, or stakeholder test plan for
a feature, flow, or product surface — not automated test code.

## Procedure
1. **Discover the product under test.** Start from `.agentic/project.md` (from `orient`) for the app
   entrypoint, run command, roles, and env needs — only investigate what the map
   doesn't cover. Then identify the main personas/roles and critical flows. Note environment needs (env vars, seed
   data, test users, services). Prefer real routes/screens/API names from the
   codebase — do not invent URLs. If no feature was named, infer the primary
   user-facing flow and confirm the title in the plan header.
2. **Write the Markdown plan** at:

   `docs/test-plans/<slug>-demo.md`

   Use this structure unless the repo already has a test-plan template (then
   follow that template):

   ```markdown
   # Demo Test Plan: <Feature Name>

   | Field | Value |
   |-------|-------|
   | Version | |
   | Last updated | YYYY-MM-DD |
   | Owner | |
   | Environment | local / staging |
   | Build / commit | |

   ## 1. Goal
   One paragraph: what this demo proves.

   ## 2. Prerequisites
   - [ ] App running (`<command>`)
   - [ ] Seed / fixtures loaded
   - [ ] Accounts (role → credentials placeholder, never real secrets)
   - [ ] Tools (browser, Postman, etc.)

   ## 3. Personas
   | Persona | Role | What they can do |

   ## 4. Demo script (happy path)
   Numbered steps. Each step has:
   1. **Action** — what the tester clicks/types
   2. **Expected** — observable result
   3. **Screenshot / note** — optional

   ## 5. Alternate / edge paths
   Short scenarios with Action → Expected.

   ## 6. Negative tests
   Auth failures, validation errors, empty states.

   ## 7. Regression checklist
   Quick tick-list of nearby features that must still work.

   ## 8. Pass / fail criteria
   What "demo ready" means.

   ## 9. Known issues / blockers
   ## 10. Sign-off
   | Role | Name | Date | Result |
   ```
3. **Make it demo-ready.** Steps must be runnable in order without tribal
   knowledge. Use checkbox lists for prerequisites and regression. Keep each
   Action ≤ 1 sentence and Expected ≤ 1 sentence. Include role switches
   explicitly (`Log out → log in as Admin`). Call out data that must be reset
   between runs. Never put real passwords, API keys, or PII in the file — use
   placeholders like `admin@example.com` / `<STAGING_PASSWORD>`.
4. **Deliver.** Write the `.md` file, tell the user the path, and give a 3–5
   bullet summary of flows covered plus any gaps you could not verify from code.

## Output
- `docs/test-plans/<slug>-demo.md` — a runnable step-by-step demo/QA plan with
  Action → Expected, edge/negative cases, and sign-off.

## Rules
- Output is always Markdown, step-by-step — not a vague outline.
- Prefer one focused plan per feature; split huge products into multiple plans.
- If multiple features are named, create one file per feature or one file with
  clear H2 sections — choose clarity over length.
- No real secrets in the plan.
- Scope discipline per `constitution.md`.
