# agentDocs CLI

## Build

```bash
agentdocs build examples/prd.agent.md --out dist/prd.html
agentdocs build "examples/*.agent.md" --out dist/examples
```

When building multiple files, `--out` must be a directory.

## Validate

```bash
agentdocs validate examples/prd.agent.md
agentdocs validate "examples/*.agent.md" --strict
```

Successful output:

```txt
agentDocs validation passed (5 files)
```

Diagnostics include the file path, line, block type, issue, and suggested fix.

## Preview

```bash
agentdocs preview examples/prd.agent.md
```

The MVP preview command writes `.agentdocs/preview.html`.

## Flags

- `--strict` escalates stricter validation checks and exits non-zero on errors.
- `--theme default|repo|print` selects the built-in theme.
- `--no-js` omits the small runtime script.
- `--no-artifacts` renders artifact source as fallback content instead of an iframe.
- `--self-contained` is the default for local HTML output.

## Init

```bash
agentdocs init
```

Creates `agentdocs.md` if it does not already exist.
