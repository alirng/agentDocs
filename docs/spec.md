# agentDocs Spec

agentDocs Markdown is ordinary Markdown plus a small set of semantic blocks.

## Version

Documents may declare:

```md
<!--agd:doc agentdocs-version=0.1 title="Document title"-->
```

## Invisible Syntax

```md
<!--agd:decision status=proposed-->
Use agentDocs for structured agent-authored docs.
<!--/agd:decision-->
```

The content between markers must remain useful as plain Markdown.

## Visible Syntax

```md
> [!IMPORTANT]
> agentdocs: decision
> status: proposed
>
> Use only GitHub-supported alert markers for visible fallback.
```

## AST Shape

The parser emits:

- text nodes for ordinary Markdown
- block nodes for `agd:` comment blocks
- block nodes for visible GitHub-alert syntax with `agentdocs:` metadata
- diagnostics for invalid or unsafe content

Diagnostics include:

- severity
- file path when supplied by the caller
- line number
- block type when applicable
- issue
- suggested fix
