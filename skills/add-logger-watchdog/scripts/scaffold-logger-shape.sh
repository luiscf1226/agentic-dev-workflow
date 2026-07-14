#!/usr/bin/env bash
# scaffold-logger-shape.sh — print the structured log + watchdog event shape.
# Usage: bash skills/add-logger-watchdog/scripts/scaffold-logger-shape.sh

set -euo pipefail

cat <<'EOF'
# Structured log event shape (language-agnostic)

Required:
  timestamp    ISO-8601 UTC
  level        info | warning | error | security
  message      short human-readable summary
  action       dotted verb, e.g. user.login, role.grant, order.cancel
  outcome      success | failure

Recommended:
  actorId      authenticated principal id (or "anonymous")
  actorRole    role at time of action
  requestId    correlation / trace id
  resourceType entity name
  resourceId   entity id
  meta         object of non-sensitive context

Never log:
  password, token, refreshToken, authorization header,
  cookie, apiKey, secret, cvv, full PAN

# Suggested security actions
  auth.login.success
  auth.login.failure
  authz.denied
  role.grant
  role.revoke
  token.rejected
  admin.impersonate
  watchdog.view
  watchdog.ack

# Watchdog query filters
  level, action, actorId, outcome, from, to, requestId
EOF
