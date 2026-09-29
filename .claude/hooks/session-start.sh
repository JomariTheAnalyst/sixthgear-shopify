#!/bin/bash
# SessionStart hook for Claude Code on the web: installs dependencies so
# `npx tsc --noEmit`, `npm run lint`, and `npm run build` work in cloud sessions.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# The repo pins pnpm via "packageManager" and ships pnpm-lock.yaml.
# Skip Playwright's browser download; the container provides Chromium.
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
export CI=true

pnpm install --prefer-offline
