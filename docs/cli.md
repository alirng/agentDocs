# agentDocs CLI

## Build

```bash
agentdocs build examples/prd.agent.md --out dist/prd.html
```

## Validate

```bash
agentdocs validate examples/prd.agent.md
agentdocs validate examples/prd.agent.md --strict
```

## Preview

```bash
agentdocs preview examples/prd.agent.md
```

The MVP preview command writes `.agentdocs/preview.html`.

## Init

```bash
agentdocs init
```

Creates `agentdocs.md` if it does not already exist.
