# DevTrail Development Workflow

## 1. Overview

DevTrail can be developed on both Windows and Mac. The project uses npm workspaces, with dependencies and common commands managed from the repository root.

The frontend and backend run as separate development servers:

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:4200`

## 2. Repository Setup

Clone the repository, then install dependencies from the repository root:

```sh
npm install
```

Dependencies are managed from the repository root through npm workspaces. Run workspace-level commands from the root unless a task explicitly says otherwise.

## 3. Environment Setup

Copy `.env.example` if local environment values are needed:

```sh
cp .env.example .env
```

Backend environment values include:

- `PORT`
- `DATABASE_URL`
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_MODEL`
- `FRONTEND_ORIGIN`

DeepSeek values are not required until AI features are implemented.

## 4. Windows Development

Recommended shell: PowerShell 7.

Start the backend from the repository root:

```powershell
npm run dev:backend
```

Start the frontend in another PowerShell window:

```powershell
npm run dev:frontend
```

Optional helper:

```powershell
.\scripts\windows\dev.ps1
```

Run the API test:

```powershell
.\scripts\windows\test-api.ps1
```

Reset the database:

```powershell
.\scripts\windows\db-reset.ps1
```

If database reset fails because SQLite is in use, stop the backend server and rerun the reset script.

## 5. Mac Development

Recommended shell: zsh or bash.

Start the backend from the repository root:

```sh
npm run dev:backend
```

Start the frontend in another terminal tab or window:

```sh
npm run dev:frontend
```

Make Unix scripts executable:

```sh
chmod +x scripts/unix/*.sh
```

Run the API test:

```sh
./scripts/unix/test-api.sh
```

Reset the database:

```sh
./scripts/unix/db-reset.sh
```

There is intentionally no Unix dev helper workflow recommended here because terminal splitting differs across environments. Run the backend and frontend in separate terminal tabs or windows.

## 6. Stopping Dev Servers

Use `Ctrl+C` in the terminal running each dev server.

On Mac, stopping the backend dev server may print something like:

```text
npm error code 130
```

or:

```text
tsx Previous process hasn't exited yet. Force killing...
```

This usually means the dev process was interrupted manually. It can be ignored if the server stops cleanly and the next start works.

If a port remains in use, restart the terminal or identify the process using the port.

## 7. Database Workflow

SQLite database files live under `backend/data`.

Database files should not be committed.

Run migrations:

```sh
npm run db:migrate --workspace backend
```

Reset the database on Windows:

```powershell
.\scripts\windows\db-reset.ps1
```

Reset the database on Mac:

```sh
./scripts/unix/db-reset.sh
```

Stop the backend before resetting the database.

## 8. API Testing Workflow

Start the backend and frontend first, then run the platform-specific test script.

The test scripts check:

- backend health
- database health
- frontend proxy health
- Projects API happy path

## 9. Common Commands

| Task | Command |
| --- | --- |
| Install dependencies | `npm install` |
| Start backend dev server | `npm run dev:backend` |
| Start frontend dev server | `npm run dev:frontend` |
| Build backend | `npm run build:backend` |
| Build frontend | `npm run build:frontend` |
| Typecheck backend | `npm run typecheck --workspace backend` |
| Run backend migrations | `npm run db:migrate --workspace backend` |
| Run Windows API test | `.\scripts\windows\test-api.ps1` |
| Run Mac API test | `./scripts/unix/test-api.sh` |

## 10. Development Notes

Keep frontend and backend changes scoped to the requested task.

Follow [DevTrail Engineering Standards](./engineering-standards.md) for project conventions.

Use `NetworkService` for frontend API communication.

Use Angular signals for reactive UI state.

Keep backend modules feature-based.

Keep scripts quiet by default and print human-readable progress messages.
