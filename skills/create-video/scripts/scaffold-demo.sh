#!/usr/bin/env bash
# scaffold-demo.sh — print a Playwright demo-test scaffold with fake cursor + ripple.
# Usage: bash skills/create-video/scripts/scaffold-demo.sh <slug> [base-url]
#
# Also copy the cursor helper into the target project:
#   mkdir -p e2e/helpers
#   cp skills/create-video/scripts/demo-cursor.ts e2e/helpers/demo-cursor.ts

set -euo pipefail

SLUG="${1:-demo-flow}"
BASE_URL="${2:-http://localhost:3000}"
SAFE_SLUG="$(printf '%s' "$SLUG" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')"

cat <<EOF
import { test, expect } from '@playwright/test'
import { installDemoCursor, demoClick, demoFill } from '../helpers/demo-cursor'

test.use({
  video: 'on',
  viewport: { width: 1280, height: 720 },
})

test('demo: ${SAFE_SLUG}', async ({ page }) => {
  const base = process.env.DEMO_BASE_URL ?? '${BASE_URL}'
  await page.goto(base)
  await installDemoCursor(page)

  // Replace with real walkthrough steps.
  // Always use demoClick / demoFill so the fake cursor moves + ripples before interacting.
  await expect(page).toHaveTitle(/.+/)

  // Example:
  // await demoClick(page, page.getByRole('link', { name: 'Sign in' }))
  // await demoFill(page, page.getByLabel('Email'), process.env.DEMO_USER ?? '')
  // await demoFill(page, page.getByLabel('Password'), process.env.DEMO_PASSWORD ?? '')
  // await demoClick(page, page.getByRole('button', { name: 'Sign in' }))
  // await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})
EOF
