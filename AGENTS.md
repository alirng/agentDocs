# AGENTS.md

## Cursor Cloud specific instructions

### Repository status

This repository ("agentDocs — Markdown-compatible rich documents for AI agents and humans") is a newly initialized project with no source code yet. It contains only `README.md`, `.gitignore`, and `LICENSE`.

### Intended stack

The `.gitignore` covers Node.js, TypeScript, and several frameworks (Next.js, Nuxt, Vite, SvelteKit, Docusaurus, Gatsby). The actual framework has not been chosen yet.

### Environment

- Node.js is available (v22.x via nvm).
- No `package.json` or lockfile exists, so there are no dependencies to install.
- There are no lint, test, build, or run commands available until source code is added.

### When code is added

Once source code and a `package.json` are committed, future agents should:

1. Install dependencies using the package manager matching the lockfile (`package-lock.json` → npm, `yarn.lock` → yarn, `pnpm-lock.yaml` → pnpm).
2. Check `package.json` scripts for `dev`, `lint`, `test`, and `build` commands.
3. Update the VM environment update script accordingly.
