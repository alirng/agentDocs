---
name: agentdocs
description: Author, validate, and render agentDocs `.agent.md` documents. Use when writing AI-agent plans, PRDs, reports, review artifacts, or interactive HTML artifacts that should remain Markdown-readable and render to self-contained HTML.
---
# agentDocs

Use this skill when the output should be a durable repo document rather than a chat response: PRDs, implementation plans, architecture notes, PR summaries, incident reports, research docs, and bespoke interactive review artifacts.

agentDocs keeps Markdown as the source of truth and uses the CLI to render rich HTML. Write normal Markdown first. Add `agd:` semantic blocks only where structure improves scanning. Use `artifact` only when the task genuinely needs custom HTML interaction.

## Required Workflow

1. Make sure the repo toolchain is ready in fresh checkouts:

   ```bash
   pnpm install
   pnpm build
   ```

2. Write or update a `.agent.md` document.
3. Keep the fallback readable in GitHub and plain Markdown viewers.
4. Validate before finishing:

   ```bash
   pnpm agentdocs validate path/to/doc.agent.md --strict
   ```

5. Render a proof HTML when useful:

   ```bash
   pnpm agentdocs build path/to/doc.agent.md --out dist/path/to/doc.html
   ```

6. For multiple examples:

   ```bash
   pnpm agentdocs validate "examples/*.agent.md" --strict
   pnpm agentdocs build "examples/*.agent.md" --out dist/examples
   ```

## Block Selection

Prefer this order:

1. Plain Markdown prose.
2. Semantic blocks for stable document structure.
3. Artifact templates for task-specific interactivity.

Use semantic blocks for:

- `callout`: warnings, important context, notes.
- `decision`: explicit decision, owner, status, priority.
- `checklist`: launch or implementation tasks.
- `timeline`: phases, incident sequence, roadmap.
- `comparison`: trade-offs and option reviews.
- `table`: structured data.
- `chart`: simple table-backed visualizations.
- `metric`: a single KPI or count.
- `card`: grouping short related content.
- `accordion`: secondary details.

Do not use `grid` or `tabs`; they are intentionally deferred until fallback-safe syntax exists.

## Default Syntax

Use invisible comment markers for most blocks:

```md
<!--agd:decision status=proposed owner="Platform team" priority=high-->
Use agentDocs for repo-native agent-authored plans and reports.
<!--/agd:decision-->
```

Use GitHub-supported alerts when the fallback should be visibly highlighted:

```md
> [!WARNING]
> agentdocs: callout
> title: Main risk
>
> If the source stops being readable as Markdown, adoption fails.
```

Only use `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, or `[!CAUTION]`. Do not invent alert names such as `[!agentdocs:decision]`.

## Artifact Policy

Use `artifact` for interfaces that cannot be represented well by semantic blocks:

- ticket triage boards
- prompt tuners
- annotated diffs
- module maps
- implementation-plan explorers
- feature-flag editors
- animation sandboxes
- slide decks
- design-system sheets

Artifacts must:

- be self-contained HTML
- run without network access
- export durable state back to Markdown, YAML, JSON, or a patch/diff
- call `window.agentdocs.export(content)` for export state
- remain inspectable as fenced code in plain Markdown

Artifact skeleton:

````md
<!--agd:artifact name="example-artifact" height=560 export=artifact-output.yaml-->
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: system-ui, sans-serif; margin: 16px; }
    </style>
  </head>
  <body>
    <button onclick="window.agentdocs.export('status: done\n')">Export</button>
  </body>
</html>
```

```yaml
status: pending
```
<!--/agd:artifact-->
````

## Thariq-Style Templates

Use these templates as starting points:

- `templates/triage-board.agent.md`: drag/reorder prioritization with YAML export.
- `templates/prompt-tuner.agent.md`: editable prompt plus sample inputs and rendered output export.
- `templates/annotated-pr.agent.md`: diff review with severity notes and Markdown summary export.
- `templates/module-map.agent.md`: module boxes/arrows with selected-node notes export.

## Quality Bar

Before finishing, check:

- The `.agent.md` source is readable without rendering.
- Every table-backed block includes a Markdown table.
- Artifact source is not used for normal document layout.
- Artifact export state is useful to paste back into an agent or commit.
- `pnpm agentdocs validate ... --strict` passes.
- Rendered HTML is created for user-facing deliverables.
- Proof HTML in `dist/` is disposable by default and should not be committed unless the user explicitly asks for generated artifacts.

## When Not To Use agentDocs

Do not use this skill for:

- short chat answers
- code-only changes
- documents that must be pure CommonMark with no comment markers
- production web applications
- authenticated or networked interactive tools
