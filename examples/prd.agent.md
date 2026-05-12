# agentDocs MVP PRD

<!--agd:doc agentdocs-version=0.1 title="agentDocs MVP PRD"-->

agentDocs turns Markdown-first agent output into richer self-contained HTML when rendered.

> [!IMPORTANT]
> agentdocs: callout
> title: MVP principle
>
> The source must remain readable as plain Markdown. Rich UI is progressive enhancement.

## Decision

<!--agd:decision status=approved owner="Project" priority=high-->
Build the MVP as a pnpm TypeScript monorepo with parser, renderer, CLI, examples, and docs.
<!--/agd:decision-->

## Launch checklist

<!--agd:checklist title="MVP checklist"-->
- [x] Define `.agent.md` syntax
- [ ] Implement parser and validator
- [ ] Render self-contained HTML
- [ ] Ship CLI
<!--/agd:checklist-->

## Priority comparison

<!--agd:comparison title="Format trade-offs"-->
| Format | Strength | Weakness |
|---|---|---|
| Markdown | Token-efficient and diffable | Visually flat |
| HTML | Rich and interactive | Token-heavy |
| agentDocs | Markdown source, rich render | Requires renderer |
<!--/agd:comparison-->
