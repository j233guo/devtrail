$ErrorActionPreference = "Stop"

Write-Host "Testing DevTrail backend health endpoint..."

$backendResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/health" `
  -Method GET

$backendResponse | ConvertTo-Json

if ($backendResponse.status -ne "ok") {
  throw "Backend health check failed. Expected status=ok."
}

Write-Host "Backend health check passed."

Write-Host "Testing DevTrail database health endpoint..."

$dbResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/db/health" `
  -Method GET

$dbResponse | ConvertTo-Json

if ($dbResponse.status -ne "ok") {
  throw "Database health check failed. Expected status=ok."
}

if ($dbResponse.database -ne "sqlite") {
  throw "Database health check failed. Expected database=sqlite."
}

Write-Host "Database health check passed."

Write-Host "Testing Angular dev proxy health endpoint..."

$proxyResponse = Invoke-RestMethod `
  -Uri "http://localhost:4200/api/health" `
  -Method GET

$proxyResponse | ConvertTo-Json

if ($proxyResponse.status -ne "ok") {
  throw "Frontend proxy health check failed. Expected status=ok."
}

Write-Host "Frontend proxy health check passed."