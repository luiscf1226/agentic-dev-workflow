/**
 * Playwright demo cursor helpers.
 *
 * Copy this file into the project's e2e helpers folder (e.g. e2e/helpers/demo-cursor.ts)
 * and use demoClick / demoFill instead of raw locator.click() so recordings show a
 * visible cursor that moves to each target and a click ripple.
 *
 * Usage:
 *   import { installDemoCursor, demoClick, demoFill } from './helpers/demo-cursor'
 *   await page.goto(url)
 *   await installDemoCursor(page)
 *   await demoClick(page, page.getByRole('button', { name: 'Sign in' }))
 */

import type { Locator, Page } from '@playwright/test'

const CURSOR_INIT_SCRIPT = () => {
  if ((window as unknown as { __pwDemoCursorInstalled?: boolean }).__pwDemoCursorInstalled) {
    return
  }
  ;(window as unknown as { __pwDemoCursorInstalled?: boolean }).__pwDemoCursorInstalled = true

  const style = document.createElement('style')
  style.setAttribute('data-pw-demo-cursor', 'true')
  style.textContent = `
    #pw-demo-cursor {
      position: fixed;
      left: 0;
      top: 0;
      width: 22px;
      height: 22px;
      margin-left: -2px;
      margin-top: -2px;
      border-radius: 50%;
      border: 2px solid #111;
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
      pointer-events: none;
      z-index: 2147483647;
      transform: translate(-100px, -100px);
      transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
      mix-blend-mode: normal;
    }
    #pw-demo-cursor::after {
      content: '';
      position: absolute;
      left: 9px;
      top: 9px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #111;
    }
    #pw-demo-cursor.pw-demo-cursor--pressed {
      transform: translate(var(--pw-x), var(--pw-y)) scale(0.85);
      background: rgba(37, 99, 235, 0.35);
      border-color: #2563eb;
    }
    .pw-demo-ripple {
      position: fixed;
      left: 0;
      top: 0;
      width: 14px;
      height: 14px;
      margin-left: -7px;
      margin-top: -7px;
      border-radius: 50%;
      border: 2px solid rgba(37, 99, 235, 0.9);
      background: rgba(37, 99, 235, 0.2);
      pointer-events: none;
      z-index: 2147483646;
      transform: translate(var(--pw-x), var(--pw-y)) scale(0.4);
      opacity: 0.95;
      animation: pw-demo-ripple 450ms ease-out forwards;
    }
    .pw-demo-highlight {
      position: fixed;
      pointer-events: none;
      z-index: 2147483645;
      border: 2px solid rgba(37, 99, 235, 0.85);
      border-radius: 8px;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
      background: rgba(37, 99, 235, 0.06);
      transition: opacity 200ms ease;
    }
    @keyframes pw-demo-ripple {
      to {
        transform: translate(var(--pw-x), var(--pw-y)) scale(3.2);
        opacity: 0;
      }
    }
  `
  document.documentElement.appendChild(style)

  const cursor = document.createElement('div')
  cursor.id = 'pw-demo-cursor'
  document.documentElement.appendChild(cursor)

  ;(window as unknown as { __pwDemoCursor?: {
    moveTo: (x: number, y: number) => void
    press: (x: number, y: number) => void
    release: () => void
    highlight: (rect: { x: number; y: number; width: number; height: number }) => void
    clearHighlight: () => void
  } }).__pwDemoCursor = {
    moveTo(x: number, y: number) {
      const el = document.getElementById('pw-demo-cursor')
      if (!el) return
      el.style.setProperty('--pw-x', `${x}px`)
      el.style.setProperty('--pw-y', `${y}px`)
      el.style.transform = `translate(${x}px, ${y}px)`
    },
    press(x: number, y: number) {
      const el = document.getElementById('pw-demo-cursor')
      if (!el) return
      el.style.setProperty('--pw-x', `${x}px`)
      el.style.setProperty('--pw-y', `${y}px`)
      el.classList.add('pw-demo-cursor--pressed')

      const ripple = document.createElement('div')
      ripple.className = 'pw-demo-ripple'
      ripple.style.setProperty('--pw-x', `${x}px`)
      ripple.style.setProperty('--pw-y', `${y}px`)
      document.documentElement.appendChild(ripple)
      window.setTimeout(() => ripple.remove(), 500)
    },
    release() {
      document.getElementById('pw-demo-cursor')?.classList.remove('pw-demo-cursor--pressed')
    },
    highlight(rect) {
      document.querySelectorAll('.pw-demo-highlight').forEach((n) => n.remove())
      const box = document.createElement('div')
      box.className = 'pw-demo-highlight'
      box.style.left = `${rect.x - 4}px`
      box.style.top = `${rect.y - 4}px`
      box.style.width = `${rect.width + 8}px`
      box.style.height = `${rect.height + 8}px`
      document.documentElement.appendChild(box)
    },
    clearHighlight() {
      document.querySelectorAll('.pw-demo-highlight').forEach((n) => n.remove())
    },
  }
}

async function ensureCursorApi(page: Page): Promise<void> {
  const ready = await page.evaluate(() => Boolean((window as unknown as { __pwDemoCursor?: unknown }).__pwDemoCursor))
  if (!ready) {
    await page.evaluate(CURSOR_INIT_SCRIPT)
  }
}

/** Install fake cursor CSS/JS. Call after goto, and again after full navigations if needed. */
export async function installDemoCursor(page: Page): Promise<void> {
  await page.addInitScript(CURSOR_INIT_SCRIPT)
  await ensureCursorApi(page)
}

export type DemoClickOptions = {
  /** Cursor travel pause (ms). Default 320. */
  moveDelayMs?: number
  /** Pause after ripple starts before the real click (ms). Default 180. */
  clickDelayMs?: number
  /** Show a highlight outline around the target before clicking. Default true. */
  highlight?: boolean
}

async function centerOf(locator: Locator): Promise<{ x: number; y: number; box: { x: number; y: number; width: number; height: number } }> {
  const box = await locator.boundingBox()
  if (!box) {
    throw new Error('demoClick: target has no bounding box (not visible?)')
  }
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
    box,
  }
}

/** Move the fake cursor to a locator, show ripple/highlight, then perform a real click. */
export async function demoClick(
  page: Page,
  locator: Locator,
  options: DemoClickOptions = {},
): Promise<void> {
  const moveDelayMs = options.moveDelayMs ?? 320
  const clickDelayMs = options.clickDelayMs ?? 180
  const highlight = options.highlight ?? true

  await locator.scrollIntoViewIfNeeded()
  await ensureCursorApi(page)

  const { x, y, box } = await centerOf(locator)

  if (highlight) {
    await page.evaluate((rect) => {
      ;(window as unknown as { __pwDemoCursor?: { highlight: (r: typeof rect) => void } }).__pwDemoCursor?.highlight(rect)
    }, box)
  }

  await page.evaluate(({ x, y }) => {
    ;(window as unknown as { __pwDemoCursor?: { moveTo: (x: number, y: number) => void } }).__pwDemoCursor?.moveTo(x, y)
  }, { x, y })
  await page.waitForTimeout(moveDelayMs)

  await page.evaluate(({ x, y }) => {
    ;(window as unknown as { __pwDemoCursor?: { press: (x: number, y: number) => void } }).__pwDemoCursor?.press(x, y)
  }, { x, y })
  await page.waitForTimeout(clickDelayMs)

  await locator.click()

  await page.evaluate(() => {
    const api = (window as unknown as {
      __pwDemoCursor?: { release: () => void; clearHighlight: () => void }
    }).__pwDemoCursor
    api?.release()
    api?.clearHighlight()
  })
}

/** Move cursor to a field, ripple-click to focus, then fill. */
export async function demoFill(
  page: Page,
  locator: Locator,
  value: string,
  options: DemoClickOptions = {},
): Promise<void> {
  await demoClick(page, locator, options)
  await locator.fill(value)
}

/** Move the fake cursor to a locator without clicking (for hover narration). */
export async function demoMoveTo(
  page: Page,
  locator: Locator,
  options: Pick<DemoClickOptions, 'moveDelayMs' | 'highlight'> = {},
): Promise<void> {
  const moveDelayMs = options.moveDelayMs ?? 320
  const highlight = options.highlight ?? true

  await locator.scrollIntoViewIfNeeded()
  await ensureCursorApi(page)
  const { x, y, box } = await centerOf(locator)

  if (highlight) {
    await page.evaluate((rect) => {
      ;(window as unknown as { __pwDemoCursor?: { highlight: (r: typeof rect) => void } }).__pwDemoCursor?.highlight(rect)
    }, box)
  }

  await page.evaluate(({ x, y }) => {
    ;(window as unknown as { __pwDemoCursor?: { moveTo: (x: number, y: number) => void } }).__pwDemoCursor?.moveTo(x, y)
  }, { x, y })
  await page.waitForTimeout(moveDelayMs)
}
