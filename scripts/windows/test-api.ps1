<#
  Script name: test-api.ps1
  Purpose: Validate backend, database, frontend proxy, and Projects API health.
  Usage: pwsh ./scripts/windows/test-api.ps1
#>

$ErrorActionPreference = "Stop"

# Health checks
Write-Host "Testing DevTrail backend health endpoint..."

$backendResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/health" `
  -Method GET

if ($backendResponse.code -ne "OK") {
  throw "Backend health check failed. Expected code=OK."
}

if ($backendResponse.data.status -ne "ok") {
  throw "Backend health check failed. Expected data.status=ok."
}

Write-Host "Backend health check passed."

# Database health checks
Write-Host "Testing DevTrail database health endpoint..."

$dbResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/db/health" `
  -Method GET

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

# Frontend proxy health checks
Write-Host "Testing Angular dev proxy health endpoint..."

$proxyResponse = Invoke-RestMethod `
  -Uri "http://localhost:4200/api/health" `
  -Method GET

if ($proxyResponse.code -ne "OK") {
  throw "Frontend proxy health check failed. Expected code=OK."
}

if ($proxyResponse.data.status -ne "ok") {
  throw "Frontend proxy health check failed. Expected data.status=ok."
}

Write-Host "Frontend proxy health check passed."

# Projects API checks
Write-Host "Testing Projects API..."

$projectPayload = @{
  name = "DevTrail API Test"
  description = "Temporary project created by scripts/windows/test-api.ps1."
  tech_stack = @("Angular", "Fastify", "SQLite")
  status = "active"
} | ConvertTo-Json -Depth 10

$createdProjectResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/projects" `
  -Method POST `
  -ContentType "application/json" `
  -Body $projectPayload

if ($createdProjectResponse.code -ne "CREATED") {
  throw "Project create failed. Expected code=CREATED."
}

if ($createdProjectResponse.data.name -ne "DevTrail API Test") {
  throw "Project create failed. Unexpected project name."
}

if ($createdProjectResponse.data.tech_stack.Count -lt 3) {
  throw "Project create failed. Expected tech_stack array."
}

$projectId = $createdProjectResponse.data.id
Write-Host "Project create check passed."

$loadedProjectResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/projects/$projectId" `
  -Method GET

if ($loadedProjectResponse.code -ne "OK") {
  throw "Project load failed. Expected code=OK."
}

Write-Host "Project load check passed."

$updatedProjectPayload = @{
  name = "DevTrail API Test Updated"
  description = "Temporary project updated by scripts/windows/test-api.ps1."
  tech_stack = @("Angular", "Fastify", "SQLite", "TypeScript")
  status = "active"
} | ConvertTo-Json -Depth 10

$updatedProjectResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/projects/$projectId" `
  -Method PUT `
  -ContentType "application/json" `
  -Body $updatedProjectPayload

if ($updatedProjectResponse.code -ne "OK") {
  throw "Project update failed. Expected code=OK."
}

if ($updatedProjectResponse.data.tech_stack.Count -lt 4) {
  throw "Project update failed. Expected updated tech_stack array."
}

Write-Host "Project update check passed."

$deletedProjectResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/projects/$projectId" `
  -Method DELETE

if ($deletedProjectResponse.code -ne "OK") {
  throw "Project delete failed. Expected code=OK."
}

if ($deletedProjectResponse.data.deleted -ne $true) {
  throw "Project delete failed. Expected deleted=true."
}

Write-Host "Project delete check passed."
Write-Host "Projects API test passed."


Write-Host "All API checks passed."
