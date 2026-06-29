---
name: issues
description: Use to turn phases or tasks into GitHub issues with labels, milestones, and dependency links. Works through the gh CLI or the GitHub MCP. Use for "create issues", "open tickets", "file the backlog".
license: MIT
---

# Issues

## When to use
After `phases`.

## Procedure
1. For each task create an issue: title, body, acceptance criteria, and `blockedBy` links.
2. Label by phase; create a milestone per phase.
3. Prefer the `gh` CLI for portability; use the GitHub MCP if available.

## Output
- GitHub issues + milestones, dependency-linked.
