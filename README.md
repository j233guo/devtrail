# DevTrail

DevTrail is a local-first AI development workspace for planning, decomposing, prompting, and documenting software development tasks.

It helps developers turn rough ideas into structured tasks, implementation plans, Codex prompts, code summaries, commit messages, and decision records, all stored locally in SQLite.

## Goals

- Create development projects and tasks
- Break down tasks with AI
- Generate implementation plans
- Generate Codex prompts
- Summarize code snippets
- Generate commit messages
- Record development decisions
- Store history locally in SQLite

## Tech Stack

- Frontend: Angular
- Backend: Fastify + TypeScript
- Database: SQLite
- AI Provider: DeepSeek first, other providers later
- Shell target: PowerShell 7 on Windows

## Development Principles

1. Local-first.
2. AI-assisted, not AI-chaotic.
3. Every AI output should be tied to a task.
4. Every task should produce useful developer artifacts.
5. Prompts should be reusable and copyable.
6. Windows-native workflow is a first-class goal.
7. Keep the MVP small, sharp, and personally useful.