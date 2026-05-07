#!/usr/bin/env bash
set -euo pipefail

# Script: test-api.sh
# Purpose: Validate backend, database, frontend proxy, and Projects API health.
# Usage: ./scripts/unix/test-api.sh

# Resolve paths
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"

# Configure API targets
backend_url="http://localhost:3000"
frontend_url="http://localhost:4200"
project_id=""

cleanup_project() {
  if [[ -n "$project_id" ]]; then
    curl --silent --show-error --fail \
      --request DELETE \
      "$backend_url/api/projects/$project_id" >/dev/null || true
  fi
}

trap cleanup_project EXIT

request_json() {
  local method="$1"
  local url="$2"
  local body="${3:-}"

  if [[ -n "$body" ]]; then
    curl --silent --show-error --fail \
      --request "$method" \
      --header "Content-Type: application/json" \
      --data "$body" \
      "$url"
  else
    curl --silent --show-error --fail \
      --request "$method" \
      "$url"
  fi
}

json_value() {
  local json="$1"
  local path="$2"

  node -e '
    const data = JSON.parse(process.argv[1]);
    const path = process.argv[2].split(".");
    const value = path.reduce((current, key) => current?.[key], data);
    if (value === undefined) process.exit(1);
    if (typeof value === "object") {
      console.log(JSON.stringify(value));
    } else {
      console.log(String(value));
    }
  ' "$json" "$path"
}

assert_json_value() {
  local json="$1"
  local path="$2"
  local expected="$3"
  local actual

  actual="$(json_value "$json" "$path")"

  if [[ "$actual" != "$expected" ]]; then
    echo "Expected $path=$expected, got $actual"
    exit 1
  fi
}

# Health checks
echo "Testing DevTrail backend health endpoint..."
backend_response="$(request_json GET "$backend_url/api/health")"
assert_json_value "$backend_response" "code" "OK"
assert_json_value "$backend_response" "data.status" "ok"
echo "Backend health check passed."

# Database health checks
echo "Testing DevTrail database health endpoint..."
db_response="$(request_json GET "$backend_url/api/db/health")"
assert_json_value "$db_response" "code" "OK"
assert_json_value "$db_response" "data.status" "ok"
assert_json_value "$db_response" "data.database" "sqlite"
echo "Database health check passed."

# Frontend proxy health checks
echo "Testing Angular dev proxy health endpoint..."
proxy_response="$(request_json GET "$frontend_url/api/health")"
assert_json_value "$proxy_response" "code" "OK"
assert_json_value "$proxy_response" "data.status" "ok"
echo "Frontend proxy health check passed."

# Projects API checks
echo "Testing Projects API..."
project_payload='{
  "name": "DevTrail API Test",
  "description": "Temporary project created by scripts/unix/test-api.sh.",
  "tech_stack": ["Angular", "Fastify", "SQLite"],
  "status": "active"
}'

created_project_response="$(request_json POST "$backend_url/api/projects" "$project_payload")"
assert_json_value "$created_project_response" "code" "CREATED"
assert_json_value "$created_project_response" "data.name" "DevTrail API Test"
project_id="$(json_value "$created_project_response" "data.id")"
echo "Project create check passed."

loaded_project_response="$(request_json GET "$backend_url/api/projects/$project_id")"
assert_json_value "$loaded_project_response" "code" "OK"
assert_json_value "$loaded_project_response" "data.id" "$project_id"
echo "Project load check passed."

updated_project_payload='{
  "name": "DevTrail API Test Updated",
  "description": "Temporary project updated by scripts/unix/test-api.sh.",
  "tech_stack": ["Angular", "Fastify", "SQLite", "TypeScript"],
  "status": "active"
}'

updated_project_response="$(request_json PUT "$backend_url/api/projects/$project_id" "$updated_project_payload")"
assert_json_value "$updated_project_response" "code" "OK"
assert_json_value "$updated_project_response" "data.name" "DevTrail API Test Updated"
echo "Project update check passed."

deleted_project_response="$(request_json DELETE "$backend_url/api/projects/$project_id")"
assert_json_value "$deleted_project_response" "code" "OK"
assert_json_value "$deleted_project_response" "data.deleted" "true"
project_id=""
echo "Project delete check passed."
echo "Projects API test passed."

echo "All API checks passed."
