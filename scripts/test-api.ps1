$ErrorActionPreference = "Stop"

Write-Host "Testing DevTrail backend health endpoint..."

$backendResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/health" `
  -Method GET

$backendResponse | ConvertTo-Json -Depth 5

if ($backendResponse.code -ne "OK") {
  throw "Backend health check failed. Expected code=OK."
}

if ($backendResponse.data.status -ne "ok") {
  throw "Backend health check failed. Expected data.status=ok."
}

Write-Host "Backend health check passed."

Write-Host "Testing DevTrail database health endpoint..."

$dbResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/db/health" `
  -Method GET

$dbResponse | ConvertTo-Json -Depth 5

if ($dbResponse.code -ne "OK") {
  throw "Database health check failed. Expected code=OK."
}

if ($dbResponse.data.status -ne "ok") {
  throw "Database health check failed. Expected data.status=ok."
}

if ($dbResponse.data.database -ne "sqlite") {
  throw "Database health check failed. Expected data.database=sqlite."
}

Write-Host "Database health check passed."

Write-Host "Testing Angular dev proxy health endpoint..."

$proxyResponse = Invoke-RestMethod `
  -Uri "http://localhost:4200/api/health" `
  -Method GET

$proxyResponse | ConvertTo-Json -Depth 5

if ($proxyResponse.code -ne "OK") {
  throw "Frontend proxy health check failed. Expected code=OK."
}

if ($proxyResponse.data.status -ne "ok") {
  throw "Frontend proxy health check failed. Expected data.status=ok."
}

Write-Host "Frontend proxy health check passed."