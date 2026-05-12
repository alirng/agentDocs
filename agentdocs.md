# agentDocs Authoring Guide

Use this guide when writing `.agent.md` files for this repository.

## Default Rules

- Use ordinary Markdown for most prose.
- Use `.agent.md` for new agent-authored documents unless the user asks for plain `.md`.
- Keep the document readable in GitHub without an agentDocs renderer.
- Prefer short metadata and shallow blocks.
- Do not use raw HTML outside `artifact` blocks.
- Validate examples with `pnpm agentdocs validate <file>` once the CLI is available.

## Invisible Block Syntax

Use `agd:` HTML comment markers for most semantic blocks:

```md
<!--agd:decision status=proposed owner="Platform team"-->
Use agentDocs blocks for repo-native agent-authored docs.
<!--/agd:decision-->
```

The fallback content between markers must be useful as plain Markdown.

## Visible Blockquote Syntax

Use GitHub-supported alert markers when the fallback should be visibly highlighted:

```md
> [!WARNING]
> agentdocs: callout
> title: Main risk
>
> If the source stops being readable as Markdown, adoption will fail.
```

Only use GitHub's supported alert markers: `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, and `[!CAUTION]`.

## MVP Blocks

Use these blocks when they improve readability:

- `card`
- `callout`
- `metric`
- `comparison`
- `decision`
- `checklist`
- `timeline`
- `accordion`
- `table`
- `chart`
- `artifact`

Do not use `grid` or `tabs` yet. They are deferred until there is a fallback-safe syntax.

## Artifact Policy

Use `artifact` only when a fixed semantic block cannot express the task, such as:

- drag-and-drop triage boards
- prompt tuners with live preview
- animation sandboxes
- annotated diffs
- custom review tools

Artifacts must be self-contained HTML and must export durable state back to Markdown, YAML, or JSON when possible.

````md
<!--agd:artifact name="triage-board" height=600 export=triage-export.yaml-->
```html
<!doctype html>
<html>
  <body>
    <script>
      window.agentdocs.export("order:\n  now: []\n");
    </script>
  </body>
</html>
```
<!--/agd:artifact-->
````

The renderer runs artifacts in a sandboxed iframe. Do not rely on network access.
