---
name: code-structure
description: Use when multiple workflows duplicate the same operational logic, when deciding what belongs in actions vs shared services, or when refactoring repeated operational blocks across domain flows. Use when adding new features that share mechanics with existing ones, or for "service layer", "extract a service", "stop copy-pasting this operation".
license: MIT
---

# Code Structure

**Two-layer separation:** actions/boundaries orchestrate domain rules (the "why/when"); a service
layer centralizes reusable operational mechanics (the "how").

Adapted from [michaelshimeles/skills](https://github.com/michaelshimeles/skills) `code-structure`.
Read `.agentic/project.md` first and follow this repo's layout names — "action" here means the
orchestration boundary (route handler, use-case, CLI command), not a Next.js `'use server'` file
unless that is actually the boundary.

## When to use
- Multiple callers need the same low-level operation (email, payments, sandbox, file storage)
- Operational logic is being copy-pasted between handlers
- A bug fix in one workflow does not propagate to others doing the same thing
- Adding a feature that shares mechanics with existing flows

**Don't extract** when the logic is truly domain-specific and used by only one caller.

## Core pattern

```
Orchestration (actions / use-cases)     Service layer (shared mechanics)
├── owns business rules                 ├── owns reusable operations
├── owns state transitions              ├── owns provider/SDK interactions
├── owns auth/ownership checks          ├── owns command execution details
├── owns failure classification         ├── owns health checks / readiness
├── owns retries / user-facing errors   └── returns structured results
└── calls service functions
```

**Rule of thumb:** "what this product flow means" stays in orchestration; "how to do this operation
reliably" moves to the service layer.

## Quick reference

| Design principle | Do | Don't |
|---|---|---|
| API shape | Composable capability blocks | One giant "do everything" method |
| Inputs/outputs | Explicit params, structured returns | Hidden global state, reaching into DB |
| Migration | Extract one block, replace one caller, verify, then migrate the rest | Refactor everything at once |
| Domain logic | Keep auth, policy, error classification in orchestration | Let the service mutate domain state directly |
| Extraction trigger | Logic repeated across 2+ callers | Logic used once (over-abstraction) |

## Designing service functions
Design **capability blocks**, not monoliths. Each function should:
- Accept all required data as **explicit parameters**
- Return **structured outputs** (e.g. `{ ready, previewUrl, proxyPort }`)
- Never reach into database/state directly
- Make failure explicit (structured results, not swallowed errors)

Callers then choose strict vs relaxed behavior per flow.

## Migration checklist
1. Write the flow in orchestration code first (clear behavior).
2. Mark repeated operational chunks across callers.
3. Extract **only** repeated, non-domain chunks to a service.
4. Replace one caller → verify with this repo's commands from `.agentic/project.md` → replace the rest.
5. Keep domain policy in orchestration (auth, status transitions, error classification).
6. Leave evidence that every migrated caller still works.

## Anti-patterns

| Anti-pattern | Problem |
|---|---|
| **God service** | One huge function hides all control flow |
| **Leaky service** | Service mutates database tables directly |
| **Inconsistent API** | Each function uses different argument styles and error semantics |
| **Over-abstraction** | Extracting logic used by only one caller |

## Example

```ts
// emailService.ts — shared mechanics
export async function sendWelcomeEmail(params: { to: string; name: string }) {
  const html = `<h1>Welcome ${params.name}</h1>`;
  await emailProvider.send(params.to, "Welcome", html);
}

// userSignup.ts — orchestration (owns WHEN to send)
if (user.marketingOptIn) {
  await sendWelcomeEmail({ to: user.email, name: user.name });
}

// adminInvite.ts — orchestration (different business rule, same mechanic)
await sendWelcomeEmail({ to: invitee.email, name: invitee.name });
```

## Output
- Shared mechanics in a service with an explicit API; domain policy still in the calling flow.

## Rules
- Touch only the files the current sub-plan allows (`constitution.md`). Extraction that spills into
  unrelated modules goes back to `plan-parallelize` to split.
- Never invent a verify command; use the map.
