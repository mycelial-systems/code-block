#!/usr/bin/env sh
set -eu

./node_modules/.bin/esbuild --bundle test/a11y.ts \
    --loader:.css=text \
    --loader:.html=text |
    ./node_modules/.bin/tapout
