# Module Map

Use this artifact when explaining unfamiliar code paths, entry points, dependencies, or ownership boundaries.

<!--agd:artifact name="module-map" height=560 export=module-map-notes.md-->
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: system-ui, sans-serif; margin: 16px; color: #111827; }
      svg { width: 100%; height: 340px; border: 1px solid #d1d5db; border-radius: 12px; }
      .box { fill: #f8fafc; stroke: #94a3b8; }
      text { font: 14px system-ui; }
      textarea { width: 100%; min-height: 80px; margin-top: 12px; }
      button { margin-top: 8px; padding: 8px 12px; }
    </style>
  </head>
  <body>
    <svg viewBox="0 0 700 340">
      <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#64748b"></path></marker></defs>
      <rect class="box" x="40" y="90" width="150" height="80" rx="12"></rect><text x="75" y="135">CLI</text>
      <rect class="box" x="275" y="90" width="150" height="80" rx="12"></rect><text x="305" y="135">Core parser</text>
      <rect class="box" x="510" y="90" width="150" height="80" rx="12"></rect><text x="530" y="135">Renderer</text>
      <line x1="190" y1="130" x2="275" y2="130" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"></line>
      <line x1="425" y1="130" x2="510" y2="130" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"></line>
    </svg>
    <textarea id="notes">CLI reads .agent.md, core parses blocks, renderer emits self-contained HTML.</textarea>
    <button id="export">Export Notes</button>
    <script>
      document.getElementById("export").addEventListener("click", () => {
        window.agentdocs.export("## Module Map Notes\n\n" + document.getElementById("notes").value.trim() + "\n");
      });
    </script>
  </body>
</html>
```

```md
## Module Map Notes

CLI reads .agent.md, core parses blocks, renderer emits self-contained HTML.
```
<!--/agd:artifact-->
