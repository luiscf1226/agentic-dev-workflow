---
name: add-logger-watchdog
description: Add structured application logging (info, security, error, warning) plus a superadmin-only watchdog feed with filters. Redacts secrets. Scope arg: logger | watchdog | full. Use for "/add-logger-watchdog", "add logger", "watchdog", "superadmin audit log".
license: MIT
---

# Add Logger + Watchdog

## When to use
When the user wants structured audit logging, security event trails, or a
superadmin watchdog dashboard / API.

**Scope** (ask once if unclear; default `full`):
- `logger` — logging module + levels only
- `watchdog` — superadmin review surface assuming a logger exists
- `full` — both

## Procedure
1. **Discover.** Start from `.agentic/project.md` (from `orient`) — it names the **exact** role strings
   (`superadmin` vs `admin` matters here) and the stack. Then find existing
   logger, APM, or audit tables; how the privileged role is represented; where requests enter (middleware, API
   gateway, controllers); and PII/secret fields that must never be logged.
   Prefer extending what exists over introducing a second logging stack.
2. **Logger — levels and events** (when scope includes `logger` / `full`).
   Implement (or wrap) a logger with at least:

   | Level | Use for |
   |-------|---------|
   | `info` | Normal successful actions (login, non-sensitive CRUD) |
   | `warning` | Recoverable anomalies (retry, deprecation, rate-limit approach) |
   | `error` | Failures that need attention (unhandled exceptions, failed jobs) |
   | `security` | Authz failures, login failures, privilege changes, token anomalies, admin actions |

   Every line must be structured (JSON or equivalent), not free-form
   `console.log`. Required fields when available: `timestamp` (ISO-8601),
   `level`, `message`, `action` (stable verb, e.g. `user.login`), `actorId` /
   `actorRole`, `requestId` / correlation ID, `resourceType` / `resourceId`,
   `outcome` (`success` | `failure`), `meta` (non-sensitive only).

   **Redaction (mandatory):** never log passwords, tokens, session cookies, API
   keys, full card numbers, raw authorization headers, or secrets.

   Wire-up: request middleware attaches `requestId` and logs security denials;
   domain services log important mutations; global error handler logs `error`
   with stack **server-side only**.

   Optional field checklist:

   ```bash
   bash skills/add-logger-watchdog/scripts/scaffold-logger-shape.sh
   ```
3. **Superadmin watchdog** (when scope includes `watchdog` / `full`). Build a
   surface only reachable by superadmin (server-side role check):

   - **Action feed** — recent `info` / `security` / `warning` / `error` events
   - **Filters** — level, actor, action, time range, outcome
   - **Security spotlight** — failed logins, 403s, role changes, token anomalies
   - **Detail view** — single event with correlation ID to related logs
   - **Retention note** — document how long events are kept

   Pick admin API + simple UI, or API-only if there is no admin UI yet.
   Hard requirements: role check on **every** watchdog endpoint; 403 for lower
   roles; read-only by default (acknowledge actions must also be logged);
   paginate — do not dump entire log tables.
4. **Persist or ship.** Prefer project norms: DB audit table / append-only store
   for security events, or stdout JSON → existing log drain. For `security` and
   `error`, prefer durable storage so the watchdog has something to query.
   Document if `info` is stdout-only.
5. **Verify.** Emit sample events at each level; confirm secrets are redacted;
   confirm non-superadmin cannot access watchdog routes; confirm superadmin can
   filter by `security` and see actor/action/outcome.

## Output
- Logger and/or watchdog implementation matching scope, with redaction, role
  gating, a field reference, and verification evidence.

## Rules
- Least privilege: only `superadmin` (or the project's exact equivalent) gets
  watchdog access.
- Logging must not badly hurt request latency — keep handlers non-blocking where
  the stack allows.
- Do not invent a second auth system; hook into existing roles.
- If the codebase already has pino/winston/slog/etc., wrap it — do not replace
  it casually.
- Never log secrets.
- Scope discipline per `constitution.md`.
