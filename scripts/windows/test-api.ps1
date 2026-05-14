<#
  Script name: test-api.ps1
  Purpose: Validate backend, database, frontend proxy, Projects API, and Tasks API health.
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

# Tasks API checks
Write-Host "Testing Tasks API..."

$taskProjectPayload = @{
  name = "DevTrail Tasks API Test"
  description = "Temporary project created for Tasks API checks."
  tech_stack = @("Fastify", "SQLite")
  status = "active"
} | ConvertTo-Json -Depth 10

$createdTaskProjectResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/projects" `
  -Method POST `
  -ContentType "application/json" `
  -Body $taskProjectPayload

if ($createdTaskProjectResponse.code -ne "CREATED") {
  throw "Task project create failed. Expected code=CREATED."
}

$taskProjectId = $createdTaskProjectResponse.data.id
Write-Host "Task test project create check passed."

$taskPayload = @{
  title = "Write Tasks API smoke test"
  description = "Temporary task created by scripts/windows/test-api.ps1."
  status = "todo"
  priority = "medium"
  acceptance_criteria = "Task API happy path passes."
} | ConvertTo-Json -Depth 10

$createdTaskResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/projects/$taskProjectId/tasks" `
  -Method POST `
  -ContentType "application/json" `
  -Body $taskPayload

if ($createdTaskResponse.code -ne "CREATED") {
  throw "Task create failed. Expected code=CREATED."
}

if ($createdTaskResponse.data.project_id -ne $taskProjectId) {
  throw "Task create failed. Unexpected project_id."
}

$taskId = $createdTaskResponse.data.id
Write-Host "Task create check passed."

$listedTasksResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/projects/$taskProjectId/tasks" `
  -Method GET

if ($listedTasksResponse.code -ne "OK") {
  throw "Task list failed. Expected code=OK."
}

if ($listedTasksResponse.data.Count -lt 1) {
  throw "Task list failed. Expected at least one task."
}

Write-Host "Task list check passed."

$loadedTaskResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/tasks/$taskId" `
  -Method GET

if ($loadedTaskResponse.code -ne "OK") {
  throw "Task load failed. Expected code=OK."
}

if ($loadedTaskResponse.data.id -ne $taskId) {
  throw "Task load failed. Unexpected task id."
}

Write-Host "Task load check passed."

$updatedTaskPayload = @{
  title = "Write Tasks API smoke test updated"
  description = "Temporary task updated by scripts/windows/test-api.ps1."
  status = "in_progress"
  priority = "high"
  acceptance_criteria = "Updated task API happy path passes."
} | ConvertTo-Json -Depth 10

$updatedTaskResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/tasks/$taskId" `
  -Method PUT `
  -ContentType "application/json" `
  -Body $updatedTaskPayload

if ($updatedTaskResponse.code -ne "OK") {
  throw "Task update failed. Expected code=OK."
}

if ($updatedTaskResponse.data.priority -ne "high") {
  throw "Task update failed. Expected priority=high."
}

Write-Host "Task update check passed."

$deletedTaskResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/tasks/$taskId" `
  -Method DELETE

if ($deletedTaskResponse.code -ne "OK") {
  throw "Task delete failed. Expected code=OK."
}

if ($deletedTaskResponse.data.deleted -ne $true) {
  throw "Task delete failed. Expected deleted=true."
}

Write-Host "Task delete check passed."

$deletedTaskProjectResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/projects/$taskProjectId" `
  -Method DELETE

if ($deletedTaskProjectResponse.code -ne "OK") {
  throw "Task project cleanup failed. Expected code=OK."
}

Write-Host "Task test project cleanup check passed."
Write-Host "Tasks API test passed."

Write-Host "All API checks passed."
