$ErrorActionPreference = "Stop"

Write-Host "Starting DevTrail backend and frontend in separate PowerShell windows..."

$repoRoot = Split-Path -Parent $PSScriptRoot

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

Write-Host "Started backend and frontend."
Write-Host "Frontend: http://localhost:4200"
Write-Host "Backend health: http://localhost:3000/api/health"