#!/bin/bash
set -a
[ -f .env.local ] && . .env.local
set +a
node --import tsx packages/cli/src/index.ts "$@"
