# Triage Board Artifact

This example uses an `artifact` block because drag-and-drop state is a better fit for HTML than fixed Markdown blocks.

<!--agd:artifact name="triage-board" height=420 export=triage-export.yaml-->
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: system-ui, sans-serif; margin: 16px; }
      main { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
      section { border: 1px solid #d1d5db; border-radius: 12px; padding: 12px; min-height: 160px; }
      button { margin-top: 16px; }
      .card { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; margin: 8px 0; padding: 8px; }
    </style>
  </head>
  <body>
    <main>
      <section><h2>Now</h2><div class="card">CLI build</div></section>
      <section><h2>Next</h2><div class="card">Editor preview</div></section>
      <section><h2>Later</h2><div class="card">Obsidian plugin</div></section>
    </main>
    <button onclick="window.agentdocs.export('order:\\n  now: [CLI build]\\n  next: [Editor preview]\\n  later: [Obsidian plugin]\\n')">Export YAML</button>
  </body>
</html>
```

```yaml
order:
  now: [CLI build]
  next: [Editor preview]
  later: [Obsidian plugin]
```
<!--/agd:artifact-->
