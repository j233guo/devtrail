# DevTrail Engineering Standards

## 1. Project Overview

DevTrail is a local-first AI development workspace. It helps developers manage development projects, tasks, implementation plans, Codex prompts, code summaries, commit messages, and development decisions.

DevTrail stores project history locally in SQLite so development context remains available on the developer's machine.

## 2. Current Tech Stack

- Frontend: Angular
- Backend: Fastify + TypeScript
- Database: SQLite
- AI provider: DeepSeek first; Ollama, Google, and OpenAI may be added later
- Package manager: npm
- Monorepo structure:
  - `frontend`
  - `backend`
  - `docs`
  - `scripts`

## 3. Product Roadmap

High-level roadmap:

- Phase 0: Project skeleton
- Phase 1: Projects + Tasks CRUD
- Phase 2: DeepSeek integration
- Phase 3: Task breakdown + implementation plan
- Phase 4: Codex Prompt Generator
- Phase 5: Snippets + Commit Message + Decision Log

Current Phase 1 breakdown:

- Projects backend CRUD
- Frontend network layer
- SCSS theme foundation
- App shell layout
- Projects list CRUD
- Project detail navigation
- Tasks backend CRUD
- Tasks frontend list/detail/workspace

## 4. Repository Structure Standards

Backend code is organized by feature modules. Frontend code is organized by layout, shared UI, core network/data services, and feature modules.

- Reusable UI components belong under `frontend/src/app/shared/ui`.
- Layout components belong under `frontend/src/app/layout`.
- Business feature components belong under `frontend/src/app/features`.

## 5. Backend Standards

- Use Fastify + TypeScript.
- Organize backend features under `backend/src/modules`.
- Put shared types and utilities under `backend/src/shared`.
- Put database code under `backend/src/db`.
- Do not introduce an ORM unless explicitly planned.
- SQLite migrations must be idempotent.
- Use `better-sqlite3`.
- Use NodeNext-compatible ESM imports with `.js` extensions where needed.
- Add short comments above data type definitions and exported functions.

## 6. API Response Contract

All backend endpoints must return `IApiResponse<T>`.

```ts
{
  code: string;
  message: string;
  data: T;
}
```

`code` is for programmatic handling. `message` is for frontend user feedback. `data` contains the business payload.

Do not return raw endpoint data outside this wrapper.

## 7. Naming Standards

- Every TypeScript interface name must start with `I`.
- API data fields should use `snake_case` to match backend/database schema.
- Avoid frontend-backend `camelCase`/`snake_case` mapping unless explicitly necessary.
- Create and update payloads should share the same payload interface when practical.
- Use `Payload` naming, for example `IProjectPayload`.

## 8. Project Data Standards

- Project `tech_stack` is stored in SQLite as JSON text.
- The API exposes `tech_stack` as `string[]`.
- The frontend uses `tech_stack` as `string[]`.
- The backend repository/data layer handles serialization and parsing.

## 9. Frontend Standards

- Use Angular standalone components.
- Use Angular signals as the preferred reactive state model.
- Keep templates and styles in separate files.
- Use SCSS, not CSS.
- Avoid inline templates and inline styles.
- Split components by responsibility.
- Presentational components should not make network requests.
- Container/page components may call services.
- Reusable network logic must go through `NetworkService`.
- Do not use `HttpClient` directly outside the network layer unless explicitly approved.

## 10. Frontend Network Layer

`NetworkService` is the central generic HTTP wrapper. It defines or owns API response-related models/enums such as `IApiResponse` and `ApiResponseCode`.

Feature services call `NetworkService` rather than `HttpClient` directly. Service-related interfaces can be colocated at the top of the related service file to reduce file count.

Add comments above interfaces and functions.

## 11. UI Component Standards

Reusable UI components belong under `shared/ui`.

Current reusable UI components include:

- Modal
- Confirm Dialog
- Dropdown Menu
- Toast

Modal should look like a large floating card. Confirm Dialog should use the reusable modal. Dropdown menus should close on outside click and Escape. Destructive actions should use danger styling.

Toasts appear in the upper-right, slide in from the right, auto-dismiss, and stack vertically.

## 12. Styling and Theme Standards

Use SCSS and CSS variables. Support light/dark theme preparation through `data-theme`.

Use semantic variables such as:

- `--color-bg`
- `--color-surface`
- `--color-text`
- `--color-border`
- `--color-primary`
- `--color-danger`
- `--shadow-card`
- `--radius-md`
- `--radius-lg`

Avoid hardcoded colors when theme variables exist. The visual style should be a modern productivity app inspired by macOS and Windows 11. Prefer rounded rectangles, soft cards, subtle borders, and gentle shadows.

## 13. Layout and Navigation Standards

The app shell includes:

- floating card sidebar
- slim integrated navbar
- main content area

The sidebar contains:

- app logo/title
- dashboard link
- collapsible projects section
- recent projects
- All Projects bordered button
- server health
- settings link

The navbar owns page title, breadcrumb/navigation, back button, and page-level actions.

Current navigation structure:

- `/projects`
- `/projects/:project_id`
- future: `/projects/:project_id/tasks/:task_id`

## 14. Project Frontend Standards

- Projects are displayed as cards, not tables.
- Project card hover should highlight and add shadow.
- Project actions such as Edit/Delete belong in a dropdown.
- Create/Edit Project uses modal.
- Delete uses confirm dialog.
- Project status uses dropdown selection.
- Project detail page should not be dominated by a large project info card.
- Project detail page should reserve most of the layout for tasks.

## 15. Script Standards

- Keep scripts organized by platform when cross-platform support exists.
- Windows scripts should use PowerShell 7.
- Unix scripts should use bash.
- Scripts should include:
  - header comment
  - purpose
  - usage
  - clear section comments
- Test scripts should print human-readable progress messages rather than verbose JSON by default.
- Scripts should avoid destructive process killing.
- Database reset scripts should show a friendly message if the database is locked by a running backend.

## 16. Codex / AI Coding Standards

- Keep changes focused on the requested scope.
- Do not modify unrelated frontend/backend/scripts/docs.
- Do not add external libraries unless explicitly requested.
- Do not rewrite architecture unless explicitly requested.
- Preserve existing project conventions.
- Keep code modular and maintainable.
- Prefer small, reviewable changes.
- If adding a new feature, update this standards document when the feature introduces new conventions.

## 17. Updating This Document

When a new architectural rule, UI rule, naming rule, or workflow rule is introduced, update this document.

This document should remain the source of truth for DevTrail engineering conventions.
