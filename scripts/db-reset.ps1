$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$dbDir = Join-Path $repoRoot "backend\data"

Write-Host "Resetting DevTrail SQLite database..."

if (Test-Path $dbDir) {
  Get-ChildItem $dbDir -File | Remove-Item -Force
  Write-Host "Removed existing database files from $dbDir"
} else {
  New-Item -ItemType Directory -Path $dbDir | Out-Null
  Write-Host "Created database directory at $dbDir"
}

Set-Location $repoRoot

Write-Host "Running database migrations..."
npm run db:migrate --workspace backend

Write-Host "Database reset complete."