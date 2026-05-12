# agentDocs Skill

The agentDocs skill teaches agents when and how to author `.agent.md` files.

Skill entry point:

```txt
skills/agentdocs/SKILL.md
```

## What The Skill Does

- Chooses plain Markdown, semantic blocks, or artifacts based on the task.
- Tells agents to validate with `pnpm agentdocs validate ... --strict`.
- Tells agents to render proof HTML with `pnpm agentdocs build ...`.
- Provides artifact templates for interactive outputs inspired by HTML-agent workflows.

## Template Set

| Template | Use case |
|---|---|
| `triage-board.agent.md` | Drag/reorder prioritization with YAML export |
| `prompt-tuner.agent.md` | Editable prompt plus preview and export |
| `annotated-pr.agent.md` | Diff review with severity notes and Markdown export |
| `module-map.agent.md` | Visual code-path/module explanation with notes export |

## Cloud Agent Use

A cloud agent should:

1. Read `AGENTS.md`.
2. Read `agentdocs.md`.
3. Load `skills/agentdocs/SKILL.md` when producing plans, specs, reports, PR summaries, or interactive artifacts.
4. Prepare the local toolchain in fresh clones:

   ```bash
   pnpm install
   pnpm build
   ```

5. Write `.agent.md` output.
6. Run validation and render HTML:

   ```bash
   pnpm agentdocs validate path/to/doc.agent.md --strict
   pnpm agentdocs build path/to/doc.agent.md --out dist/doc.html
   ```

Generated proof HTML under `dist/` is disposable by default. Do not commit it unless the user explicitly asks for generated artifacts.

## Validation

Run:

```bash
pnpm skill:check
```

This validates all `.agent.md` files under `skills/agentdocs/`.
