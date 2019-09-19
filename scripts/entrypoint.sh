#!/bin/bash
set -euo pipefail

rm -rf tmp/pids/*.pid
exec "$@"
