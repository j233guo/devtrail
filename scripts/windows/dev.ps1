<#
  Script name: dev.ps1
  Purpose: Start the DevTrail backend and frontend development servers.
  Usage: pwsh ./scripts/windows/dev.ps1
#>

$ErrorActionPreference = "Stop"

# Resolve paths
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

# Start services
Write-Host "Starting DevTrail backend and frontend in separate PowerShell windows..."

Start-Process pwsh -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd `"$repoRoot`"; npm run dev:backend"
)

Start-Process pwsh -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd `"$repoRoot`"; npm run dev:frontend"
)

# Print service URLs
Write-Host "Started backend and frontend."
Write-Host "Frontend: http://localhost:4200"
Write-Host "Backend health: http://localhost:3000/api/health"
