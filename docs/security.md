# agentDocs Security

agentDocs treats Markdown source as untrusted input.

## Standard Blocks

Standard semantic blocks do not execute JavaScript. Metadata and Markdown content are escaped or sanitized by the renderer.

Raw `<script>` tags outside `artifact` blocks are validation errors.

## Artifacts

Artifacts are the only place where source-provided JavaScript is allowed. They must render in sandboxed iframes with:

```html
sandbox="allow-scripts"
```

The renderer must not include `allow-same-origin` by default.

The parent document only accepts artifact export messages from the matching iframe window. Artifact exports are displayed in the rendered document and can be copied by the reader.

Artifacts should not depend on remote network access. In strict mode, remote `src=`, `href=`, and `fetch("https://...")` references are validation errors.

## Markdown Pipeline

The HTML renderer uses a Markdown/GFM pipeline with sanitization before stringifying HTML. This keeps ordinary Markdown rendering compatible with common Markdown features while avoiding raw script execution in standard document content.

## Strict Mode

Strict mode should fail on:

- unknown block types
- missing required chart metadata
- unsafe script tags outside artifacts
- remote network references inside artifacts
- malformed artifact HTML fences
