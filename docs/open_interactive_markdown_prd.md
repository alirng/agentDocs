# PRD: agentDocs Markdown

## One-line description

**agentDocs** is an open-source Markdown-compatible document format for agent-authored plans, specs, reports, and interactive artifacts. Files stay readable as normal Markdown, use `.agent.md` when explicit detection helps, and upgrade into rich, self-contained HTML when opened with an agentDocs renderer.

---

## Naming

The agent terminology is the wedge and the wedge is the product. "Agent" describes the architecture and workflow the format is designed for: software that writes, edits, reviews, and hands off documents while using tools. If agentDocs becomes early infrastructure for that workflow, the naming convention becomes an asset rather than a liability.

### Locked naming decisions

| Surface | Value |
|---|---|
| Project / brand | `agentDocs` |
| Format | `agentDocs Markdown` on first mention, `agentDocs` thereafter |
| File convention | `.agent.md` |
| Plain Markdown support | `.md` files are also parsed if they contain agentDocs blocks |
| CLI binary | `agentdocs` |
| CLI alias | `agd` |
| npm publisher | `alirng0` |
| npm scope | `@agentdocs0/*` |
| GitHub repo | `github.com/alirng0/agentdocs` |
| Default block prefix | `agd:` |
| Visible block metadata key | `agentdocs:` |
| Authoring guide | `agentdocs.md` |
| Spec version key | `agentdocs-version: 0.1` |

Initial npm packages:

```txt
@agentdocs0/core
@agentdocs0/cli
@agentdocs0/renderer-html
@agentdocs0/themes
```

Install and usage:

```bash
npm i -g @agentdocs0/cli
agentdocs build doc.agent.md
agd validate doc.agent.md

npx @agentdocs0/cli build doc.agent.md
```

The scoped `npx` command is a little longer than `npx agentdocs`, but this cost appears only at install or first-run time. After installation, the user-facing command is still `agentdocs` or `agd`.

---

## Why Now

AI agents increasingly write plans, specs, reports, execution logs, PR summaries, technical documentation, and review artifacts. Most of this output is written in Markdown because it is cheap, readable, diffable, and repository-native.

The recent Karpathy / Thariq discussion around HTML as an agent output format exposes a real tension:

- HTML is much better for visual density, spatial comparison, interaction, SVG, small dashboards, mockups, slide decks, and bespoke review tools.
- Markdown is much better for token efficiency, authoring reliability, Git diffs, human editing, and repo-native workflows.

agentDocs exists to resolve that tension:

- Use Markdown as the durable source format.
- Use semantic blocks for common document structure.
- Use a sandboxed artifact escape hatch only when the task genuinely needs HTML-level expressiveness.
- Export to self-contained HTML for universal viewing.

---

## Problem

Plain Markdown is strong as a transport and authoring format, but weak as a visual interface:

- It is visually flat.
- It is poor for dashboards, timelines, decisions, status cards, comparisons, and progress tracking.
- It has limited interactivity.
- Long agent plans become walls of text.
- Important structure is implied by headings and bullets rather than explicitly represented.

Raw HTML solves visual richness but creates new problems:

- It is token-heavy for agents.
- It is noisy in Git diffs.
- It is harder for humans to edit.
- It is fragile when generated repeatedly by LLMs.
- It often requires CSS, JavaScript, divs, classes, and layout code.
- It is a render target, not a good default authoring format.

MDX, Markdoc, MDC, and component Markdown solve part of the problem, but are not universal:

- They usually require a framework, build step, or hosting environment.
- They are not ideal for standard repo docs.
- They often break plain Markdown readability.
- Existing Markdown previews in Cursor, VS Code, Obsidian, GitHub, and terminal viewers cannot render them fully.

The missing layer is a format that is:

- valid Markdown first
- low-token for agents
- readable by humans
- diffable in Git
- visually rich when rendered by a compatible renderer
- capable of interactive artifacts when needed
- exportable to self-contained HTML
- usable as a default document type inside repositories and agentic coding tools

---

## Product Thesis

The right solution is not to replace Markdown.

The right solution is to define a small semantic layer on top of Markdown that:

1. degrades cleanly in normal Markdown renderers
2. upgrades into rich UI in agentDocs-aware renderers
3. supports sandboxed HTML artifacts for the minority of cases where fixed blocks are not expressive enough
4. compiles into a standalone HTML file for universal viewing

Markdown remains the base protocol. Rich UI is progressive enhancement. HTML is used deliberately, not sprayed across the whole document.

---

## Core Principles

### 1. Markdown First

Every agentDocs document must remain useful as ordinary Markdown.

If someone opens a `.agent.md` or `.md` file in GitHub, Cursor, VS Code, Obsidian, a terminal Markdown viewer, or a plain text editor, they should still understand the document.

### 2. Spend Tokens Where They Matter

Most documents should be ordinary Markdown prose plus a few short `agd:` markers. HTML tokens should be spent only when the output needs bespoke interaction or layout that a semantic block cannot express.

### 3. Progressive Enhancement

The source document is the durable object. Rich rendering, interactivity, themes, and export are enhancements layered on top.

### 4. No Arbitrary Source Execution by Default

Standard semantic blocks never execute source-provided JavaScript. The only exception is the `artifact` block, which is isolated in a sandboxed iframe with a narrow messaging API.

### 5. Agent-Friendly, Human-Editable

Syntax must be easy for LLMs to emit reliably and easy for humans to edit manually. The format should prefer short metadata, readable fallback content, and shallow structures.

---

## Karpathy / Thariq Diagnosis

Karpathy's point is that asking an LLM to "structure your response as HTML" often produces a dramatically better reading and review experience than plain Markdown.

Thariq's "Unreasonable Effectiveness of HTML" examples go further. They are not just nicer documents. They are task-specific artifacts:

- side-by-side exploration grids
- annotated PR reviews
- module maps
- living design-system sheets
- animation sandboxes
- clickable flows
- SVG illustrations
- slide decks
- incident timelines
- drag-and-drop ticket triage boards
- feature-flag editors
- prompt tuners with live preview

A fixed vocabulary of cards, callouts, timelines, and charts cannot express all of those. A pure semantic-block format would answer the token problem but miss the real expressiveness that makes HTML compelling.

agentDocs therefore has two layers:

1. **Doc layer**: Markdown prose plus a small semantic block set. This covers most plans, specs, status reports, PR summaries, and research docs.
2. **Artifact layer**: a sandboxed inline HTML mini-app for the smaller number of cases where the agent needs to generate a bespoke interactive interface.

This is the central product decision. agentDocs should be a better Markdown for agent-authored documents and a safer container for agent-authored HTML artifacts.

---

## Token Economics

The project should publicly demonstrate the token advantage. The exact numbers should be verified with a repeatable tokenizer script before launch, but the expected pattern is clear.

### Token budget principle

| Output shape | Recommended format | Rationale |
|---|---|---|
| Normal prose | Markdown | Cheapest and most readable |
| Structured document section | `agd:` semantic block | Small metadata overhead, rich render |
| Tables and timelines | Markdown table inside `agd:` block | Fallback remains useful |
| Bespoke interaction | `agd:artifact` | HTML tokens are justified by interaction |
| Whole document as raw HTML | Avoid by default | Token-heavy, noisy, brittle |

### Example token comparison

Approximate token counts for equivalent intent:

| Example | Plain MD | agentDocs | MDX / component MD | Raw HTML |
|---|---:|---:|---:|---:|
| Small decision card | 55 | 70 | 120 | 260 |
| PRD section with cards and checklist | 420 | 500 | 850 | 1,800 |
| Status dashboard with metrics and timeline | 520 | 690 | 1,150 | 2,400 |
| Interactive ticket triage board | Not possible | 2,300 | 3,200+ | 2,200 |

The important result is not that agentDocs always uses fewer tokens than HTML. For a custom interactive artifact, it may use roughly the same number of HTML tokens as raw HTML. The win is that only the artifact is HTML. The surrounding plan, explanation, export state, and review notes remain Markdown.

### Per-block overhead budget

Semantic blocks should stay cheap:

| Block type | Target authoring overhead |
|---|---:|
| `card` | 2 marker lines + 0-3 metadata lines |
| `callout` | 2 marker lines + 1-3 metadata lines |
| `metric` | 2 marker lines + 2-5 metadata lines |
| `decision` | 2 marker lines + 1-4 metadata lines |
| `checklist` | 2 marker lines + optional title |
| `comparison` | 2 marker lines + Markdown table |
| `timeline` | 2 marker lines + Markdown table |
| `chart` | 2 marker lines + Markdown table |
| `artifact` | 2 marker lines + fenced HTML + optional export fence |

If a semantic block requires more syntax than the Markdown it replaces, it should not exist.

---

## Target Users

### Primary users

1. **AI coding agents**
   - write plans, specs, issue summaries, execution reports, PR summaries, and architecture docs
   - need a constrained, low-token output format
   - need a safer alternative to raw HTML for interactive outputs

2. **Developers**
   - want repo-native docs
   - want readable diffs
   - want Markdown compatibility
   - want better previews without turning docs into web apps

3. **Product and technical teams**
   - write PRDs, specs, roadmaps, retrospectives, decision logs, incident reports, and implementation plans
   - need visual structure without presentation overhead

4. **Open-source maintainers**
   - want generated reports that are easy to review
   - want agent-readable project documentation
   - want docs that still work on GitHub

### Secondary users

1. Researchers and analysts writing reports, memos, comparisons, and evidence tables.
2. Founders and operators writing strategy docs, investor notes, operating plans, and dashboards.
3. Non-technical readers opening exported `.html` files without installing anything.

---

## Goals

### Product goals

1. Create a Markdown-compatible semantic document format for agent-authored work.
2. Enable rich visual rendering without requiring raw HTML for normal documents.
3. Support sandboxed HTML artifacts for bespoke interactive outputs.
4. Keep documents readable in existing Markdown renderers.
5. Provide a CLI that converts `.agent.md` and compatible `.md` files into self-contained HTML.
6. Provide a small, opinionated set of semantic blocks for common agent-generated documents.
7. Make the format easy for LLMs to produce reliably.
8. Make the output easy for humans to edit manually.
9. Ship as open source with a clear public specification.
10. Make agentDocs viable as a default document type in repos and agentic coding tools.

### Adoption goals

1. Become a common format for AI-generated plans, specs, and review artifacts.
2. Be easy to add to any repository in under five minutes.
3. Work through npm, pnpm, yarn, Bun, and npx.
4. Ship an agent skill at the same time as the npm v0.1 packages.
5. Provide templates for common agent and developer workflows.
6. Publish examples that make the improvement over Markdown and raw HTML obvious.

---

## Non-Goals

agentDocs should not aim to be:

1. A replacement for Markdown.
2. A replacement for HTML.
3. A replacement for MDX or Markdoc.
4. A website framework.
5. A presentation framework.
6. A no-code app builder.
7. A runtime-heavy React/Vue/Svelte system.
8. A general-purpose UI programming language.
9. A complex schema language.
10. A tool that requires users to install a desktop app.
11. A proprietary document standard.
12. A Figma competitor.
13. A Notion competitor.
14. A database-backed workspace.
15. A charting library first.
16. A Markdown renderer that tries to support every possible extension.

The project should stay narrow:

> plain Markdown authoring, optional semantic blocks, sandboxed artifacts, rich local rendering, self-contained HTML export.

---

## Format Requirements

### Hard requirements

1. Files may use `.agent.md` for explicit detection.
2. Plain `.md` files must also work if they contain agentDocs blocks.
3. Documents must remain readable in normal Markdown renderers.
4. Rich blocks must have a plain Markdown fallback.
5. Syntax must be low-token and easy for LLMs to write.
6. Syntax must be easy for humans to edit.
7. Syntax must be Git-diff friendly.
8. Blocks must be nestable only where necessary.
9. Invalid blocks must fail gracefully.
10. Exported documents must not require network access by default.
11. Exported HTML must be self-contained by default.
12. The parser must support deterministic output.
13. Standard semantic blocks must avoid arbitrary JavaScript execution.
14. The `artifact` block must run only in a sandboxed iframe.
15. The block set must be small and opinionated.
16. Plain Markdown content must remain the dominant part of most documents.

### Compatibility requirement

agentDocs syntax must be based on constructs that normal Markdown renderers display legibly or ignore safely.

The default syntax uses HTML comments as invisible markers:

```md
<!--agd:card title="Agent handles" status=active-->
- Code scaffolding
- Test generation
- PR creation
<!--/agd:card-->
```

Why this works:

- GitHub and most Markdown renderers strip the comment markers.
- The fallback is a clean Markdown list.
- The agentDocs renderer can still detect the block boundaries.
- Git diffs remain concise.

For blocks where visible fallback matters, agentDocs also supports a GFM-alert-compatible blockquote tier:

```md
> [!IMPORTANT]
> agentdocs: decision
> status: proposed
> owner: Platform team
>
> Use agentDocs blocks for agent-authored docs in this repository.
```

Why this works:

- GitHub recognizes the alert marker and renders a clean callout.
- Other Markdown renderers display a readable blockquote.
- The `agentdocs:` metadata line tells the enhanced renderer which semantic component to use.

The old style below is not recommended:

```md
> [!agentdocs:decision]
```

GitHub does not treat arbitrary alert types as styled alerts, so this creates visible fallback noise.

---

## Syntax

### Default invisible marker syntax

```md
<!--agd:decision status=proposed owner="Platform team" priority=high-->
Use agentDocs blocks for agent-authored docs in this repository.
<!--/agd:decision-->
```

Rules:

- Opening marker: `<!--agd:<type> key=value key="quoted value"-->`
- Closing marker: `<!--/agd:<type>-->`
- Markers should be on their own lines.
- Content between markers must be valid Markdown.
- Unknown metadata keys are warnings by default and errors in strict mode.
- Unknown block types render as plain Markdown and produce validation warnings.

### Visible blockquote syntax

```md
> [!WARNING]
> agentdocs: risk
> title: Main risk
>
> If source documents stop being useful as Markdown, adoption will fail.
```

Rules:

- The alert marker must be one of GitHub's supported types: `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`.
- The semantic type lives in the `agentdocs:` metadata line.
- The visible tier is preferred for risks, warnings, notes, and decisions where fallback visibility matters.

### Document metadata

Documents may declare a spec version near the top:

```md
<!--agd:doc agentdocs-version=0.1 title="Launch PRD"-->
```

If omitted, renderers should assume the latest stable parser mode compatible with the installed version and emit a non-blocking warning in strict mode.

---

## Core Block Types

MVP should support only blocks that provide clear value for agent-generated documents and degrade cleanly in plain Markdown.

### 1. Card

Purpose: visually group a small section of content.

```md
<!--agd:card title="Agent handles" status=active-->
- Code scaffolding
- Test generation
- PR creation
<!--/agd:card-->
```

Plain Markdown fallback: the reader sees only the list.

### 2. Callout

Purpose: highlight warning, note, success, risk, or important information.

```md
> [!WARNING]
> agentdocs: callout
> title: Main risk
>
> If source documents stop being valid Markdown, adoption will fail.
```

Plain Markdown fallback: GitHub renders a native warning callout; other renderers show a readable blockquote.

### 3. Metric

Purpose: display a single metric or KPI.

```md
<!--agd:metric label="Active users" value=49 delta="+11.4%" period="vs previous 30 days"-->
<!--/agd:metric-->
```

Plain Markdown fallback: no visible content unless the author supplies a one-line fallback. For important metrics, prefer:

```md
<!--agd:metric label="Active users" value=49 delta="+11.4%" period="vs previous 30 days"-->
Active users: 49 (+11.4% vs previous 30 days)
<!--/agd:metric-->
```

### 4. Comparison

Purpose: compare options, roles, features, or trade-offs.

```md
<!--agd:comparison title="Agent vs Human Developers"-->
| Agent | Human |
|---|---|
| Writes scoped code | Defines architecture |
| Creates PRs | Reviews and merges |
| Runs tests | Owns production risk |
<!--/agd:comparison-->
```

Plain Markdown fallback: a normal table.

### 5. Decision

Purpose: capture a decision with owner, status, reasoning, and next action.

```md
<!--agd:decision status=proposed owner="Data/AI team" priority=high-->
Use agents for implementation acceleration, not autonomous production deployment.
<!--/agd:decision-->
```

Plain Markdown fallback: the decision sentence.

### 6. Checklist

Purpose: track tasks with owner and status.

```md
<!--agd:checklist title="Launch checklist"-->
- [ ] Create GitHub repo
- [ ] Publish npm package
- [ ] Add examples
- [ ] Create docs site
<!--/agd:checklist-->
```

Plain Markdown fallback: a normal task list.

### 7. Timeline

Purpose: show phased work.

```md
<!--agd:timeline title="MVP Roadmap"-->
| Phase | Target | Outcome |
|---|---|---|
| 0 | Week 1 | Spec and parser |
| 1 | Week 2 | CLI and HTML export |
| 2 | Week 3 | Default theme and examples |
<!--/agd:timeline-->
```

Plain Markdown fallback: a normal table.

### 8. Accordion

Purpose: collapse secondary details in enhanced renderers while leaving the content visible in Markdown.

```md
<!--agd:accordion title="Technical details"-->
The renderer parses agentDocs blocks, validates metadata, and converts each block into semantic HTML.
<!--/agd:accordion-->
```

Plain Markdown fallback: the detail text is visible.

### 9. Table

Purpose: render Markdown tables with improved styling, responsive layout, and optional sorting/filtering.

```md
<!--agd:table title="Feature priority" sortable=true-->
| Feature | Priority | Status |
|---|---:|---|
| CLI build | High | Required |
| Agent skill | High | Required |
| VS Code extension | Medium | Later |
<!--/agd:table-->
```

Plain Markdown fallback: a normal table.

### 10. Chart

Purpose: render simple charts from inline Markdown table data.

```md
<!--agd:chart type=bar title="Usage by document type"-->
| Type | Count |
|---|---:|
| PRDs | 24 |
| Plans | 18 |
| Reports | 12 |
<!--/agd:chart-->
```

Plain Markdown fallback: a readable table.

MVP chart support should be intentionally limited: bar, line, area, and pie. No complex dashboard builder.

### Deferred blocks

`grid` and `tabs` should not be MVP blocks. The earlier `[Section title]` sub-section syntax degrades like broken links in plain Markdown. They may return later only if they have a fallback-safe syntax.

---

## Artifact Layer

The artifact layer is the answer to "HTML is better than Markdown" when the output is not just a document but a small task-specific interface.

### Purpose

Use `artifact` when the agent needs to create something that cannot be expressed well as fixed semantic blocks:

- drag-and-drop triage boards
- prompt tuners with live preview
- animation sandboxes
- feature-flag editors
- side-by-side visual explorations
- clickable flows
- annotated diffs
- SVG-heavy diagrams
- custom review interfaces

Do not use `artifact` for ordinary cards, timelines, checklists, tables, or charts.

### Syntax

````md
<!--agd:artifact name="triage-board" height=600 export=triage-export.yaml-->
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: system-ui, sans-serif; }
    </style>
  </head>
  <body>
    <main id="board"></main>
    <script>
      function exportState(markdown) {
        window.agentdocs.export(markdown);
      }
    </script>
  </body>
</html>
```
<!--/agd:artifact-->

```yaml
# triage-export.yaml
order:
  now: [LIN-1, LIN-4]
  next: [LIN-7]
  later: []
  cut: []
```
````

Plain Markdown fallback: the artifact appears as a fenced HTML code block and the export state appears as YAML or JSON. The reader can still inspect and copy both.

Enhanced render: the HTML runs inside a sandboxed iframe. The renderer implements `window.agentdocs.export()` with `postMessage` under the hood. Exported state updates the sibling export block in the rendered view and can be copied back into the source document.

### Artifact API

The renderer should inject a tiny API into the iframe:

```ts
window.agentdocs = {
  export(content: string): void,
  getInput(): unknown,
  notify(event: { type: string; message?: string }): void
}
```

MVP only requires `export(content)`. `getInput()` and `notify()` may be no-ops until the artifact protocol stabilizes.

### Security constraints

Artifacts must run inside an iframe with:

```html
sandbox="allow-scripts"
```

The renderer must not include `allow-same-origin` by default. The iframe should receive a restrictive Content Security Policy. Network access should be blocked in exported documents unless the user explicitly enables it.

Artifacts widen the security surface. The authoring guide must instruct agents to use artifacts only when the task shape demands interactivity, not as a replacement for normal document structure.

---

## Document Types To Support

agentDocs should ship with templates for:

1. PRD
2. technical spec
3. architecture decision record
4. implementation plan
5. agent execution plan
6. PR summary
7. code review report
8. bug investigation report
9. research report
10. meeting notes
11. roadmap
12. status update
13. incident report
14. vendor comparison
15. interactive triage artifact
16. prompt tuning artifact

---

## Rendering Modes

### 1. Plain Markdown mode

No agentDocs renderer.

Expected behavior:

- Document remains readable.
- Invisible markers are stripped by many Markdown renderers or visible only in source.
- Visible blockquote tier renders as GFM alerts or readable blockquotes.
- All meaningful content remains visible.
- Artifacts appear as code fences.

### 2. Enhanced Markdown preview mode

Used by editor plugins.

Expected behavior:

- agentDocs blocks render as visual components.
- Artifacts render in sandboxed iframes.
- The original `.agent.md` or `.md` file remains unchanged unless the user explicitly applies an export.
- Validation warnings appear inline.

### 3. Static HTML export mode

Used by CLI.

Expected behavior:

- `agentdocs build doc.agent.md` produces `doc.html`.
- HTML includes all CSS inline by default.
- Required JavaScript is inline and small.
- Artifacts are bundled inline and sandboxed.
- File opens locally in any browser.
- No server, CDN, or network access is required.

### 4. Browser paste-and-render mode

Used by public demo.

Expected behavior:

- User pastes Markdown.
- Browser renders a rich document.
- User exports self-contained HTML.
- User can copy source or rendered artifact export state.

### 5. Repo docs mode

Used inside software repositories.

Expected behavior:

- Files stay as `.agent.md` or `.md`.
- GitHub still renders them readably.
- CI can render richer docs.
- Agents can write agentDocs syntax by default.

---

## CLI Requirements

### Basic commands

```bash
agentdocs build README.agent.md
agentdocs build docs/*.agent.md
agentdocs preview roadmap.agent.md
agentdocs validate roadmap.agent.md
agentdocs init
agentdocs examples

agd build README.agent.md
agd validate roadmap.agent.md
```

### Build options

```bash
agentdocs build roadmap.agent.md --out roadmap.html
agentdocs build roadmap.agent.md --theme default
agentdocs build roadmap.agent.md --self-contained
agentdocs build roadmap.agent.md --no-js
agentdocs build roadmap.agent.md --print
agentdocs build roadmap.agent.md --strict
agentdocs build roadmap.agent.md --allow-artifacts
agentdocs build roadmap.agent.md --no-artifacts
```

### Validation output

The validator should detect:

- unknown block types
- invalid metadata keys
- invalid chart data
- invalid table format
- unsupported nesting
- missing required fields
- unsafe content
- disallowed artifact capabilities
- broken links

Example:

```txt
agentDocs validation failed

roadmap.agent.md:42
Block: chart
Issue: missing required field "type"
Fix: add `type=bar`, `type=line`, `type=area`, or `type=pie`
```

---

## Package Structure

```txt
agentdocs/
  packages/
    core/             parser, AST, validation, schema
    renderer-html/    HTML renderer
    cli/              command line interface
    themes/           default themes
    web/              browser demo
    vscode/           VS Code/Cursor extension
    obsidian/         Obsidian plugin
  skills/
    agentdocs/        agent skill and instructions
  examples/
    prd.agent.md
    roadmap.agent.md
    agent-plan.agent.md
    architecture-decision.agent.md
    research-report.agent.md
    triage-board.agent.md
    prompt-tuner.agent.md
  docs/
    spec.md
    blocks.md
    artifacts.md
    cli.md
    agents.md
    compatibility.md
    security.md
  agentdocs.md
  README.md
  package.json
  LICENSE
```

---

## Technical Architecture

### Parser

Input:

```txt
Markdown string
```

Output:

```txt
agentDocs AST + standard Markdown AST
```

The parser should:

1. parse normal Markdown
2. detect `agd:` comment markers
3. detect visible blockquote-tier metadata
4. extract block type
5. parse metadata
6. parse inner Markdown content
7. identify artifact HTML fences and export fences
8. validate block schema
9. emit a structured AST

### Renderer

Input:

```txt
agentDocs AST
```

Output:

```txt
HTML string
```

The renderer should:

1. render normal Markdown as semantic HTML
2. render agentDocs semantic blocks as semantic components
3. render artifacts as sandboxed iframes
4. inject CSS theme
5. optionally inject small JavaScript for interactivity
6. support no-JS fallback where possible
7. produce standalone HTML by default

### Spec versioning

Documents may declare:

```md
<!--agd:doc agentdocs-version=0.1-->
```

Version policy:

- `0.x` versions may change syntax while the project is pre-1.0, but renderers should provide migration warnings.
- `1.x` must preserve parsing compatibility for existing `1.x` documents.
- Validators should support `--strict-version` to fail on unknown or newer spec versions.

### Streaming constraint

Agents write top-to-bottom. The parser and renderer should support streaming or partial rendering where practical.

Rules:

- A block type must be known from the opening marker.
- Metadata must live on the opening marker or the first lines of a visible blockquote.
- Blocks should not require scanning the whole document to understand local structure.
- Artifacts may defer execution until the closing marker and HTML fence are complete.

### Nested code fences

For normal semantic blocks, fenced code inside content works because the outer block is an HTML comment marker, not a fence.

For artifacts, documentation should recommend four-backtick outer examples when showing source examples inside Markdown docs:

````md
```html
<script>console.log("artifact")</script>
```
````

The parser must not confuse fenced HTML inside an artifact with the document's surrounding Markdown examples.

### Image and diagram handling

MVP policy:

- Normal Markdown images are allowed.
- Mermaid diagrams are allowed as fenced code blocks and may be enhanced by the renderer.
- Inline SVG is allowed in artifacts only.
- Self-contained export may inline local images as base64 when `--self-contained` is enabled.
- Remote images are preserved by default in normal builds but should be blocked or warned in strict offline mode.

### Security

The renderer should:

1. escape unsafe HTML by default in normal Markdown content
2. sanitize metadata fields
3. prevent script injection through titles, labels, and captions
4. avoid arbitrary JavaScript from standard semantic blocks
5. run artifacts only in sandboxed iframes
6. avoid remote asset loading by default in self-contained export
7. support strict mode for CI
8. document the artifact security model clearly

Source documents should not contain executable JavaScript outside `artifact` blocks.

Allowed:

```md
<!--agd:accordion title="Details"-->
The renderer provides disclosure behavior.
<!--/agd:accordion-->
```

Allowed only inside `artifact`:

```html
<script>
  window.agentdocs.export(markdown)
</script>
```

Not allowed in normal source Markdown:

```html
<script>alert("x")</script>
```

Recommended exported HTML CSP:

```txt
default-src 'none';
img-src 'self' data:;
style-src 'unsafe-inline';
script-src 'unsafe-inline';
frame-src 'self' data: blob:;
```

The final CSP will depend on whether artifacts are embedded via `srcdoc`, `blob:`, or generated `data:` URLs.

---

## Theme Requirements

MVP should include three themes:

1. **Default** — clean, modern, neutral.
2. **Repo** — GitHub-like, developer-native.
3. **Print** — PDF/print-friendly.

Theme constraints:

- no heavy dependencies
- accessible contrast
- responsive layout
- works on mobile
- works in local files
- readable without web fonts
- system font stack by default
- no remote assets by default

---

## Accessibility Requirements

agentDocs output should support:

1. semantic HTML
2. keyboard navigation
3. accessible accordions
4. readable color contrast
5. reduced-motion preference
6. table captions where appropriate
7. ARIA labels for interactive elements
8. print-friendly output
9. clear focus states
10. artifact iframe titles

Artifacts are harder to guarantee because they are custom HTML. The renderer should enforce iframe titles and provide warnings for missing labels where static analysis can detect them.

---

## Agent-Writing Requirements

agentDocs should include a canonical authoring guide:

```txt
agentdocs.md
```

This file does not replace `AGENTS.md`. A repository may use both:

- `AGENTS.md` tells agents how to work in the repo.
- `agentdocs.md` tells agents how to author agentDocs documents.

Recommended `AGENTS.md` pointer:

```txt
When writing PRDs, plans, reports, or review artifacts, follow ./agentdocs.md.
Use .agent.md for new agentDocs documents unless the user requests plain .md.
```

The `agentdocs.md` guide should explain:

1. use normal Markdown for most content
2. use semantic blocks only when they improve readability
3. use `artifact` only when the task needs bespoke interaction
4. never use raw HTML outside artifact blocks
5. prefer `card`, `decision`, `checklist`, `comparison`, `timeline`, and `table` blocks
6. keep metadata short
7. keep fallback content readable
8. do not nest deeply
9. validate before committing
10. export artifact state back to Markdown, YAML, or JSON

Example instruction:

```txt
When writing project plans, PRDs, implementation notes, status reports, or review artifacts, use agentDocs Markdown. Use standard Markdown for normal prose. Use `agd:` comment markers for cards, decisions, comparisons, metrics, timelines, tables, charts, and checklists. Use `artifact` only for custom interactive interfaces such as triage boards, prompt tuners, animation sandboxes, or annotated diff tools. The document must remain readable in normal Markdown renderers.
```

---

## GitHub Compatibility

GitHub is a first-class target.

Default invisible markers:

```md
<!--agd:decision status=approved owner="Platform team"-->
Use agentDocs blocks for agent-authored docs in this repository.
<!--/agd:decision-->
```

GitHub fallback: the user sees only the decision sentence.

Visible alert tier:

```md
> [!IMPORTANT]
> agentdocs: decision
> status: approved
> owner: Platform team
>
> Use agentDocs blocks for agent-authored docs in this repository.
```

GitHub fallback: the user sees a native GFM important callout.

This distinction is critical. Arbitrary alert types such as `[!agentdocs:decision]` are not supported by GitHub and should not be the default.

---

## Cursor / VS Code Compatibility

agentDocs should work in two layers:

### Without extension

- file opens as normal Markdown
- content is readable
- no special preview is required

### With extension

- semantic blocks render as interactive components in preview
- artifacts render in sandboxed iframes
- validation warnings appear inline
- commands are available:
  - Preview agentDocs Document
  - Export agentDocs HTML
  - Validate agentDocs Document
  - Insert agentDocs Block
  - Insert agentDocs Artifact

Cursor-specific value:

- agents can write `.agent.md` docs into repos
- humans can review them in normal Markdown
- enhanced preview makes agent plans more readable
- artifacts make HTML outputs safer and more portable
- PRDs, plans, execution notes, and custom review tools become structured but not proprietary

---

## Obsidian Compatibility

agentDocs should work in Obsidian as normal Markdown by default.

Optional plugin:

- render cards, decisions, callouts, timelines, metrics, and tables
- preserve source Markdown
- support local graph and search as normal
- avoid breaking standard Obsidian workflows
- disable artifact execution by default unless the vault owner opts in

---

## Self-Contained HTML Export

The exported HTML file should:

1. open locally in any browser
2. include all CSS inline
3. include required JavaScript inline
4. include all document content inline
5. sandbox artifacts
6. require no server
7. require no install for the reader
8. support print/export to PDF
9. work offline
10. have a small file size
11. optionally expose the source Markdown inside the file

Possible export structure:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Document title</title>
  <style>/* agentDocs CSS */</style>
</head>
<body>
  <main id="agentdocs-root">...</main>
  <script type="application/json" id="agentdocs-data">...</script>
  <script>/* small renderer/interactivity layer */</script>
</body>
</html>
```

Artifacts may be embedded with iframe `srcdoc` or generated blob URLs, depending on the final CSP and browser compatibility trade-offs.

---

## Data And Charting Model

MVP charts should use Markdown tables as the data source.

This preserves fallback readability.

```md
<!--agd:chart type=line title="Weekly active users"-->
| Week | Users |
|---|---:|
| W1 | 12 |
| W2 | 18 |
| W3 | 31 |
<!--/agd:chart-->
```

Plain Markdown fallback: readable table.

Enhanced render: chart.

No external data fetching in MVP. No arbitrary JavaScript. No complex BI dashboard behavior.

---

## File Extensions

agentDocs supports three usage patterns:

### 1. Explicit agentDocs Markdown

```txt
doc.agent.md
```

Best for tooling, CI, editor activation, and agent-authored docs.

### 2. Normal Markdown

```txt
doc.md
```

Best for gradual adoption. The parser detects `agd:` markers in normal Markdown.

### 3. Exported HTML

```txt
doc.html
```

Best for sharing with non-technical readers.

Recommendation:

- Use `.agent.md` for new agent-authored documents.
- Support `.md` wherever agentDocs syntax appears.
- Use `.html` only as generated output.

---

## Open-Source Strategy

### License

Use MIT.

Why:

- simple
- permissive
- widely accepted
- encourages adoption in commercial and open-source tools

Apache 2.0 remains an option if patent language becomes important.

### Repository

Initial repo:

```txt
github.com/alirng0/agentdocs
```

The repo should be a monorepo so examples, packages, docs, and the agent skill evolve together.

### Public positioning

Avoid framing it as another Markdown flavor.

Better positioning:

> The open document format for agent-authored plans, specs, reports, and artifacts.

Or:

> Markdown for agents. Rich documents and sandboxed artifacts when rendered.

Or:

> Plain Markdown in Git. Rich HTML at view time.

---

## Launch Plan

### Phase 0 — Specification (week 1)

Deliverables:

- public spec
- syntax frozen for v0.1
- token economics examples
- compatibility rules
- block examples
- artifact examples
- README
- `agentdocs.md` authoring guide

Success criteria:

- an LLM can produce valid `.agent.md` documents from the spec
- a human can understand an agentDocs file without a renderer
- examples render acceptably on GitHub
- the artifact model clearly answers the HTML-as-artifact use case

### Phase 1 — Parser, renderer, and CLI (weeks 2-3)

Deliverables:

- `@agentdocs0/core`
- `@agentdocs0/renderer-html`
- `@agentdocs0/cli`
- `agentdocs` and `agd` binaries
- parser
- validator
- static HTML export
- default theme
- artifact sandbox prototype

Success criteria:

- `agentdocs build file.agent.md` works
- output opens locally in browser
- semantic blocks render correctly
- artifacts render in sandboxed iframes
- invalid blocks produce useful errors

### Phase 2 — Agent skill (weeks 2-3, parallel with Phase 1)

Deliverables:

- `agentdocs` agent skill
- `agentdocs.md` authoring rules
- examples for Cursor, Claude Code, Codex-style workflows
- inline preview or preview command instructions
- "when to use artifact" guidance

Success criteria:

- teams can add agentDocs to a repo in under five minutes
- agents can write `.agent.md` plans by default
- users can render the output immediately via CLI or skill workflow
- artifact examples demonstrate Thariq-style HTML workflows safely

### Phase 3 — Editor previews (week 4)

Deliverables:

- VS Code extension
- Cursor compatibility
- Obsidian plugin prototype

Success criteria:

- docs render in editor preview
- validation works inline
- artifacts are opt-in and sandboxed
- developers can use agentDocs in normal repo workflows

### Phase 4 — CI surfaces (week 5+)

Deliverables:

- GitHub Action
- GitHub Pages publishing recipe
- PR comment links to rendered docs
- sample repo

Success criteria:

- `.agent.md` files can be rendered on every PR
- generated HTML is easy to share
- fallback Markdown remains readable in GitHub review

---

## MVP Scope

### Must have

1. `.agent.md` convention with `.md` compatibility.
2. `agd:` HTML-comment marker syntax.
3. GFM-alert-compatible visible syntax.
4. Parser for agentDocs blocks.
5. HTML renderer.
6. CLI build command.
7. Self-contained HTML export.
8. Default CSS theme.
9. Validation command.
10. Artifact block with sandboxed iframe rendering.
11. Core blocks:
    - card
    - callout
    - metric
    - comparison
    - decision
    - checklist
    - timeline
    - table
    - chart
    - accordion
12. Example documents.
13. `agentdocs.md` authoring guide.
14. Public spec.
15. MIT license.

### Should have

1. Browser demo.
2. GitHub Action.
3. Print theme.
4. VS Code/Cursor extension.
5. Obsidian plugin prototype.
6. Theme tokens.
7. Strict validation mode.
8. Export to PDF via browser print styling.
9. Artifact export-state copying.

### Could have

1. Mermaid enhancement.
2. CSV import for tables/charts.
3. Light/dark themes.
4. Copy buttons for code blocks.
5. Search inside exported HTML.
6. Table sorting/filtering.
7. Shareable web playground.
8. Doc templates.
9. Block insertion helper.
10. Fallback-safe `grid` and `tabs` designs.

### Should not have initially

1. Raw JavaScript in normal semantic blocks.
2. Remote API calls.
3. Authentication.
4. Database storage.
5. Multi-user collaboration.
6. Complex app-state management outside artifact iframes.
7. Heavy frontend framework dependency.
8. Full dashboard builder.
9. Real-time editing.
10. Proprietary hosting platform.

---

## Success Metrics

### Developer adoption

- npm downloads for `@agentdocs0/cli`
- GitHub stars
- number of repos using `.agent.md`
- number of rendered HTML exports
- number of editor extension installs

### Agent adoption

- agentDocs used in agent-written PRDs/plans
- `agentdocs.md` added to repositories
- agentDocs included in project templates
- agentDocs used by agentic coding workflows for execution plans and PR summaries

### Quality metrics

- percentage of examples that render correctly in GitHub fallback
- parser error rate
- invalid block rate from LLM-generated docs
- average token reduction versus equivalent raw HTML
- exported HTML file size
- accessibility score
- artifact sandbox violation rate

---

## Honest Risks

### Risk 1: GitHub fallback is misunderstood

GitHub does not support arbitrary alert types. `[!agentdocs:decision]` would render as visible noise, not a styled alert.

Mitigation:

- default to invisible `agd:` comment markers
- use only official GFM alert markers for visible blockquotes
- test every example on GitHub before launch

### Risk 2: The syntax becomes too custom

If agentDocs looks alien, people will not use it.

Mitigation:

- keep source close to Markdown
- keep metadata short
- avoid deep nesting
- keep block types few and obvious

### Risk 3: The renderer becomes too heavy

If exported HTML is large or slow, agentDocs loses the simplicity advantage.

Mitigation:

- no heavy framework in exported HTML
- semantic HTML and small JS
- no large charting dependency in MVP
- no-JS mode for semantic blocks where possible

### Risk 4: Artifacts weaken the "just Markdown" story

Artifacts are powerful but widen the security surface and can make documents harder to diff.

Mitigation:

- artifacts are one block type, not the default authoring mode
- agents use artifacts only for explicitly interactive tasks
- artifacts run in sandboxed iframes
- artifact state exports back to Markdown, YAML, or JSON
- CI can disable artifacts with `--no-artifacts`

### Risk 5: Not enough differentiation from MDX / Markdoc / MDC

If agentDocs is only "prettier Markdown blocks," it may not be compelling.

Mitigation:

- position around agent-authored workflows
- make GitHub fallback a hard requirement
- ship self-contained HTML export as a killer feature
- make sandboxed artifacts a first-class differentiator
- ship the agent skill alongside npm v0.1

### Risk 6: LLMs produce invalid syntax

Agents may omit closing markers, misspell metadata, or overuse artifacts.

Mitigation:

- simple block grammar
- short examples
- validator with clear fixes
- canonical `agentdocs.md` prompt
- strict mode for CI

---

## Competitive Landscape

agentDocs is adjacent to:

- Markdown
- GitHub Flavored Markdown
- MDX
- Markdoc
- Nuxt MDC
- Obsidian callouts
- GitHub Actions that convert Markdown to HTML
- Markdown preview extensions
- HTML artifact generation
- AI agent docs such as `AGENTS.md`

agentDocs should differentiate by combining:

1. Markdown compatibility
2. semantic visual blocks
3. low-token agent authoring
4. sandboxed interactive artifacts
5. standalone local HTML export
6. repo-native workflow
7. agent-skill distribution
8. open-source extensibility

---

## Example Full Document

```md
# AI Developer Operating Model

<!--agd:doc agentdocs-version=0.1-->

This document defines how AI development agents should be used inside the engineering workflow.

> [!IMPORTANT]
> agentdocs: callout
> title: Core principle
>
> Agents accelerate delivery. Humans own judgment, architecture, security, and production risk.

## Role split

<!--agd:comparison title="Agent vs Human Developers"-->
| Agent handles | Human handles |
|---|---|
| Code scaffolding | Architecture |
| Test generation | Product judgment |
| Refactors | Security review |
| PR creation | Production merge |
<!--/agd:comparison-->

## Required setup

<!--agd:checklist title="Infrastructure checklist"-->
- [ ] Dedicated machine or cloud runner
- [ ] GitHub repo access
- [ ] CI pipeline
- [ ] Agent runtime
- [ ] Human PR review process
<!--/agd:checklist-->

## Decision

<!--agd:decision status=proposed owner="Data/AI team" priority=high-->
Use AI agents to create implementation pull requests, but require human review before merge.
<!--/agd:decision-->

## Roadmap

<!--agd:timeline title="First 30 days"-->
| Phase | Target | Outcome |
|---|---|---|
| 1 | Week 1 | Runner and repo access |
| 2 | Week 2 | CI and PR workflow |
| 3 | Week 3 | First backlog tasks |
| 4 | Week 4 | Review metrics and expand scope |
<!--/agd:timeline-->
```

This remains readable as plain Markdown and becomes a richer visual document in the agentDocs renderer.

---

## Final Product Direction

agentDocs should not try to be everything.

It should become the cleanest open format for:

- AI-generated plans
- repo-native PRDs
- technical specs
- implementation reports
- decision logs
- structured research notes
- PR summaries
- review artifacts
- interactive-but-portable agent outputs

The winning constraint is compatibility:

> An agentDocs document is always Markdown first. Rich UI and artifacts are progressive enhancement.

That is what gives it a realistic chance of becoming a default document type in repositories and agentic coding tools.
