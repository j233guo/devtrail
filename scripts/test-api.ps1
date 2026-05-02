$ErrorActionPreference = "Stop"

Write-Host "Testing DevTrail backend health endpoint..."

$response = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/health" `
  -Method GET

$response | ConvertTo-Json

if ($response.status -ne "ok") {
  throw "Health check failed. Expected status=ok."
}

Write-Host "Health check passed."