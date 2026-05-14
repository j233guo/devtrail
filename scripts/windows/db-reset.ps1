<#
  Script name: db-reset.ps1
  Purpose: Remove local SQLite database files and rerun backend migrations.
  Usage: pwsh ./scripts/windows/db-reset.ps1
#>

$ErrorActionPreference = "Stop"

# Resolve paths
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$dbDir = Join-Path $repoRoot "backend\data"

Write-Host "Resetting DevTrail SQLite database..."

# Reset database files
if (Test-Path $dbDir) {
  try {
    Get-ChildItem $dbDir -File | Remove-Item -Force
  } catch {
    Write-Host "Could not reset the SQLite database because one or more files are in use."
    Write-Host "Stop the DevTrail backend server first, then rerun:"
    Write-Host ".\scripts\windows\db-reset.ps1"
    exit 1
  }

  Write-Host "Removed existing database files from $dbDir"
} else {
  New-Item -ItemType Directory -Path $dbDir | Out-Null
  Write-Host "Created database directory at $dbDir"
}

Set-Location $repoRoot

# Run migrations
Write-Host "Running database migrations..."
npm run db:migrate --workspace backend

Write-Host "Database reset complete."
