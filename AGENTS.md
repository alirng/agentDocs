# AGENTS.md

## Cursor Cloud specific instructions

### Repository status

This repository ("agentDocs — Markdown-compatible rich documents for AI agents and humans") is a TypeScript/pnpm monorepo for the agentDocs MVP.

### Intended stack

- Node.js 22
- pnpm workspaces
- TypeScript
- Vitest

### Environment

- Node.js is available (v22.x via nvm).
- Use pnpm for dependency installation and scripts.
- The tracked PRD is `docs/open_interactive_markdown_prd.md`.
- The agentDocs authoring guide is `agentdocs.md`.
- The repo-local agentDocs skill is `skills/agentdocs/SKILL.md`.

### Commands

Use the package scripts in `package.json`:

1. `pnpm install`
2. `pnpm build`
3. `pnpm test`
4. `pnpm typecheck`
5. `pnpm lint`
6. `pnpm skill:check`

When writing `.agent.md` documents, follow `agentdocs.md`.
When producing agent-authored plans, reports, PR summaries, or interactive artifacts, also follow `skills/agentdocs/SKILL.md`.
