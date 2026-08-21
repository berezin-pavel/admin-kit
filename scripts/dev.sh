#!/usr/bin/env bash
#
# Wrapper: the script itself lives in ai-kit; only the stack config (.claude/dev-stack.conf) is here.

DEV_STACK_CONF="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.claude/dev-stack.conf" \
  exec /Users/pavel/Projects/Ai/ai-kit/scripts/dev-stack.sh "$@"
