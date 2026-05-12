# Contributing

Thanks for helping build agentDocs.

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

Use Node 22. The repo is a pnpm workspace with packages under `packages/*`.

## Pull Requests

- Keep source documents readable as Markdown.
- Add tests for parser, renderer, or CLI behavior changes.
- Run `pnpm build:examples` when changing examples or rendering.
- Do not publish packages from feature branches.
