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

## Strict Mode

Strict mode should fail on:

- unknown block types
- missing required chart metadata
- unsafe script tags outside artifacts
- remote network references inside artifacts
- malformed artifact HTML fences
