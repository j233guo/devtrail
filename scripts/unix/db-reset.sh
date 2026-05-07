#!/usr/bin/env bash
set -euo pipefail

# Script: db-reset.sh
# Purpose: Remove local SQLite database files and rerun backend migrations.
# Usage: ./scripts/unix/db-reset.sh

# Resolve paths
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
db_dir="$repo_root/backend/data"

echo "Resetting DevTrail SQLite database..."

# Reset database files
mkdir -p "$db_dir"

sqlite_files=()

while IFS= read -r -d '' file; do
  sqlite_files+=("$file")
done < <(find "$db_dir" -maxdepth 1 -type f \( \
  -name "*.sqlite" -o \
  -name "*.sqlite3" -o \
  -name "*.db" -o \
  -name "*.sqlite-*" -o \
  -name "*.sqlite3-*" -o \
  -name "*.db-*" \
\) -print0)

if ((${#sqlite_files[@]} > 0)); then
  if ! rm -f "${sqlite_files[@]}"; then
    echo "Failed to reset database files because they may be in use. Stop the DevTrail backend server first, then rerun ./scripts/unix/db-reset.sh"
    exit 1
  fi
fi

echo "Removed existing SQLite database files from $db_dir"

# Run migrations
echo "Running database migrations..."
cd "$repo_root"
npm run db:migrate --workspace backend

echo "Database reset complete."
