# agentDocs

Markdown-compatible rich documents for AI agents and humans.

agentDocs is an open-source document format and toolchain for agent-authored plans, specs, reports, and interactive artifacts. Source files stay readable as Markdown (`.agent.md` or `.md`) and can be rendered into self-contained HTML.

## MVP Status

This repository has a local MVP:

- `@agentdocs0/core` parses and validates agentDocs Markdown.
- `@agentdocs0/renderer-html` renders self-contained HTML.
- `@agentdocs0/cli` exposes `agentdocs` and `agd`.
- `@agentdocs0/themes` provides default CSS.

## Quickstart

```bash
pnpm install
pnpm build
pnpm agentdocs validate "examples/*.agent.md" --strict
pnpm agentdocs build "examples/*.agent.md" --out dist/examples
```

## Syntax

Use invisible `agd:` markers for semantic blocks:

```md
<!--agd:decision status=proposed owner="Platform team"-->
Use agentDocs for repo-native agent-authored plans and reports.
<!--/agd:decision-->
```

Use GitHub-supported alerts for visible fallback:

```md
> [!WARNING]
> agentdocs: callout
> title: Main risk
>
> The source document must remain readable as plain Markdown.
```

Use `artifact` only for bespoke interactive HTML mini-apps:

````md
<!--agd:artifact name="triage-board" height=600 export=triage-export.yaml-->
```html
<!doctype html>
<html>
  <body>Interactive artifact here</body>
</html>
```
<!--/agd:artifact-->
````

## Documentation

- PRD: [docs/open_interactive_markdown_prd.md](docs/open_interactive_markdown_prd.md)
- Authoring guide: [agentdocs.md](agentdocs.md)
- CLI: [docs/cli.md](docs/cli.md)
- Security: [docs/security.md](docs/security.md)

## Development

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm build:examples
pnpm pack:check
```
