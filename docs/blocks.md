# agentDocs Blocks

MVP blocks:

- `doc`
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

`grid` and `tabs` are intentionally deferred until they have a fallback-safe syntax.

## Table-backed Blocks

`comparison`, `timeline`, `table`, and `chart` should use Markdown tables so GitHub fallback stays useful.

```md
<!--agd:timeline title="MVP roadmap"-->
| Phase | Outcome |
|---|---|
| 1 | Parser |
| 2 | Renderer |
<!--/agd:timeline-->
```
