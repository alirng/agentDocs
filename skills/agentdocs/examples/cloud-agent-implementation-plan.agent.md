# Cloud Agent Implementation Plan

<!--agd:doc agentdocs-version=0.1 title="Cloud Agent Implementation Plan"-->

Use this example when a cloud agent needs to turn a task into a readable plan that can also render as self-contained HTML.

> [!IMPORTANT]
> agentdocs: callout
> title: Working rule
>
> Keep most content in Markdown. Use semantic blocks for structure. Use artifacts only for custom interaction.

## Decision

<!--agd:decision status=proposed owner="Cloud agent" priority=high-->
Implement the smallest verifiable change first, validate with package scripts, and render the final `.agent.md` summary to HTML.
<!--/agd:decision-->

## Execution checklist

<!--agd:checklist title="Cloud agent checklist"-->
- [ ] Read `AGENTS.md`
- [ ] Read `agentdocs.md`
- [ ] Implement scoped changes
- [ ] Run `pnpm agentdocs validate <doc> --strict`
- [ ] Run `pnpm agentdocs build <doc> --out dist/<doc>.html`
<!--/agd:checklist-->

## Handoff shape

<!--agd:table title="Handoff contents"-->
| Section | Purpose |
|---|---|
| Summary | What changed |
| Verification | Commands and results |
| Follow-up | What remains |
<!--/agd:table-->
