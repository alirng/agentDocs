# agentDocs Artifacts

Artifacts are sandboxed HTML mini-apps for cases where a fixed semantic block is not expressive enough.

Use artifacts for:

- drag-and-drop triage boards
- prompt tuners
- animation sandboxes
- annotated diffs
- custom review tools

Do not use artifacts for normal cards, tables, timelines, or charts.

## Sandbox

Artifacts render in an iframe with:

```html
sandbox="allow-scripts"
```

The renderer does not add `allow-same-origin` by default.

## Export Bridge

Artifacts can call:

```js
window.agentdocs.export("status: done\n");
```

The renderer receives this with `postMessage` and displays the exported state in the rendered document.
