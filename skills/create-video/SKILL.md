---
name: create-video
description: Record a Playwright demo video with video on, a visible fake cursor, and click ripple/highlight before every interaction via demoClick/demoFill. Use for "/create-video", "create video", "Playwright video", "record a demo", "demo recording".
license: MIT
---

# Create Video

## When to use
When the user wants a product demo recording — a Playwright walkthrough with
`video: 'on'`, a visible fake cursor, and click ripple/highlight before each
interaction.

## Procedure
1. **Prerequisites.** Detect package manager and whether Playwright is installed.
   If missing, propose install (do not silently add deps without confirmation).
   Confirm a runnable local URL (e.g. `http://localhost:3000`) or accept a
   staging URL from the user / env. Prefer the project's existing e2e folder
   (`e2e/`, `tests/e2e/`, `playwright/`).
2. **Install the demo cursor helper.** Copy the shared helper into the project
   (do not import across skill directories at runtime — copy the file in):

   ```bash
   mkdir -p e2e/helpers
   cp skills/create-video/scripts/demo-cursor.ts e2e/helpers/demo-cursor.ts
   ```

   Or print a starter demo that already wires the helpers:

   ```bash
   bash skills/create-video/scripts/scaffold-demo.sh <slug> [base-url]
   ```

   `installDemoCursor(page)` injects a CSS/JS overlay (`#pw-demo-cursor`, blue
   ripple, optional highlight). **Required API:**

   | Helper | Use instead of |
   |--------|----------------|
   | `installDemoCursor(page)` | — call once after first `goto` (also registers `addInitScript`) |
   | `demoClick(page, locator)` | `locator.click()` |
   | `demoFill(page, locator, value)` | `locator.click()` + `locator.fill(value)` |
   | `demoMoveTo(page, locator)` | hover / narration without clicking |

   **Flow before each click:** scroll into view → move fake cursor → highlight +
   ripple → real `.click()`.
3. **Write the recording script** (e.g. `e2e/demos/<slug>.demo.ts`):
   - `video: 'on'` (optionally `screenshot: 'on'`, `trace: 'on-first-retry'`)
   - Realistic viewport (1280×720 or 1920×1080)
   - **Fake cursor on every interaction** — use `demoClick` / `demoFill` /
     `demoMoveTo`; demo specs must **NOT** use bare `locator.click()`
   - Slow enough to watch (helper defaults ~320ms move + ~180ms ripple)
   - Stable selectors (`getByRole`, `getByLabel`, `getByTestId`)
   - Login via env (`DEMO_USER`, `DEMO_PASSWORD`) — never hardcode secrets
   - One linear narrative: land → key actions → success state
   - Re-call `installDemoCursor(page)` after hard navigations if the overlay is missing

   Example shape:

   ```typescript
   import { test, expect } from '@playwright/test'
   import { installDemoCursor, demoClick, demoFill } from '../helpers/demo-cursor'

   test.use({
     video: 'on',
     viewport: { width: 1280, height: 720 },
   })

   test('demo: <flow name>', async ({ page }) => {
     await page.goto(process.env.DEMO_BASE_URL ?? 'http://localhost:3000')
     await installDemoCursor(page)

     await demoClick(page, page.getByRole('link', { name: 'Sign in' }))
     await demoFill(page, page.getByLabel('Email'), process.env.DEMO_USER ?? '')
     await demoFill(page, page.getByLabel('Password'), process.env.DEMO_PASSWORD ?? '')
     await demoClick(page, page.getByRole('button', { name: 'Sign in' }))

     await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
   })
   ```
4. **Record.** Start the app if needed. Run only the demo spec:

   ```bash
   npx playwright test e2e/demos/<slug>.demo.ts --headed
   ```

   Headed mode when a display is available; headless still produces video when
   `video: 'on'`. Confirm the fake cursor travels and ripples are visible.
   Optionally convert WebM → MP4 with ffmpeg if installed.
5. **Document** under `docs/demos/<slug>.md`: what the video shows, that it uses
   the fake cursor + ripple helper, how to re-record (commands + env vars),
   selector assumptions, and artifact path pattern.
6. **Deliver.** Report spec path, helper path, video artifact path(s),
   confirmation that cursor motion + ripples appear, and any gaps.

## Output
- A Playwright demo spec using `demoClick` / `demoFill`, copied
  `e2e/helpers/demo-cursor.ts`, video artifact(s), and a short re-record doc.

## Rules
- Always ship the cursor helper with the demo — demos without a visible cursor
  are incomplete.
- Demo specs must not use bare `locator.click()`; use `demoClick` / `demoFill`.
- Prefer reusing existing Playwright config over a one-off parallel setup.
- Do not commit large binary videos unless the repo already stores demo media;
  otherwise gitignore `test-results/` / `playwright-report/` and document locally.
- Keep the demo under ~2–3 minutes of narrative; split longer tours.
- Never record real production credentials or customer PII.
- Scope discipline per `constitution.md`.
