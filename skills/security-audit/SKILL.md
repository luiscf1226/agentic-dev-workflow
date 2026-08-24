---
name: security-audit
description: Adversarial security audit of APIs, database access, JWT/roles, and try-to-break attack paths. Produces a severity-ranked findings report. Scope arg: api | db | auth | full. Use for "/security-audit", "security audit", "try to break the app", "pentest". Local/staging only — never attack production.
license: MIT
---

# Security Audit

## When to use
When the user wants a penetration-style review — not a coding checklist —
covering APIs, DB access, auth/JWT/roles, and attempt-to-break scenarios.

**Scope** (ask once if unclear; default `full`):
- `api` — HTTP/GraphQL endpoints, input validation, rate limits, CORS
- `db` — queries, RLS/permissions, migrations, secrets in schema dumps
- `auth` — JWT, sessions, roles, privilege escalation
- `full` — all of the above plus try-to-break scenarios

## Procedure
1. **Map the attack surface.** Start from `.agentic/project.md` (from `orient`) — it already names the
   stack, the auth mechanism, and the **exact role names**; getting those wrong
   invalidates the audit. Only investigate what the map doesn't cover. Otherwise
   detect stack (framework, ORM, auth library, API style). Inventory public and authenticated routes, auth middleware and role
   checks, DB models / migrations / RLS, JWT or session creation/verification,
   file uploads, webhooks, and admin tools. Sketch a short threat map:
   unauthenticated → authenticated user → privileged role → admin/superadmin.
2. **Audit APIs** (when scope includes `api` / `full`). For each sensitive
   endpoint verify: auth required where expected; authorization checks resource
   owner or role (not just "logged in"); input validated; no mass assignment of
   privileged fields; no IDOR via path/body IDs; errors do not leak internals;
   dangerous methods need stronger auth (+ CSRF where applicable); rate limits
   on login/reset/OTP/expensive searches. Document endpoint, precondition,
   attack steps, impact.
3. **Audit database access** (when scope includes `db` / `full`). Parameterized
   queries / ORM only; least-privilege DB roles; RLS or tenant isolation;
   migrations without default admin passwords or open policies; no secrets in
   committed seed data; soft-delete / export cannot dump other users' rows.
4. **Audit JWT and roles** (when scope includes `auth` / `full`). Algorithm
   pinned (reject `none`); signature verified; `exp`/`iss`/`aud` validated when
   used; tokens not in localStorage if XSS is realistic (prefer httpOnly cookies
   when that is the project pattern); claims not forgeable from client body;
   privilege escalation paths blocked; logout/rotation/revocation for stolen
   tokens; elevated roles gated server-side everywhere.
5. **Try to break the app** (local/staging reasoning + tests only). Design
   scenarios and, where safe, encode them as tests: admin API with normal user
   JWT; IDOR via swapped resource IDs; replay expired/tampered JWT; injection in
   search/filter; unexpected uploads; CSRF on cookie sessions; race on critical
   writes. Mark each **Blocked**, **Vulnerable**, or **Unknown (needs runtime)**.
6. **Report** a severity-ranked markdown report (Summary, Findings with asset /
   attack path / impact / evidence / remediation / status, attack scenarios
   table, residual risk). If asked to fix, remediate Critical and High first,
   add regression tests where practical, and re-scan those paths.

## Output
- A severity-ranked security audit report; optional remediations and regression
  tests when requested.

## Rules
- **Local / staging only.** Never run live attacks against production.
- Never exfiltrate or commit real secrets; redact findings; rotate guidance only.
- Never recommend disabling auth "temporarily" as a fix.
- If scope is too large, prioritize authz/IDOR and injection first.
- Distinct from a while-coding security checklist — this is an audit pass.
- Scope discipline per `constitution.md`.
