# Annotated PR Review

Use this pattern when a code diff needs spatial notes, severity labels, and a Markdown summary reviewers can paste back into a PR.

<!--agd:artifact name="annotated-pr-review" height=620 export=review-summary.md-->
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: system-ui, sans-serif; margin: 16px; color: #111827; }
      .row { display: grid; grid-template-columns: 1fr 240px; gap: 12px; border-bottom: 1px solid #e5e7eb; padding: 10px 0; }
      code { white-space: pre-wrap; font-family: ui-monospace, monospace; }
      select, textarea { width: 100%; }
      textarea { min-height: 80px; }
      button { margin-top: 12px; padding: 8px 12px; }
    </style>
  </head>
  <body>
    <div class="row">
      <code>- old implementation\n+ new implementation</code>
      <label>Note<textarea data-note>Check whether this changes public behavior.</textarea><select data-severity><option>medium</option><option>high</option><option>low</option></select></label>
    </div>
    <button id="export">Export Review</button>
    <script>
      document.getElementById("export").addEventListener("click", () => {
        const notes = [...document.querySelectorAll("[data-note]")].map((note, index) => {
          const severity = document.querySelectorAll("[data-severity]")[index].value;
          return `- ${severity}: ${note.value.trim()}`;
        });
        window.agentdocs.export(`## Review Notes\n\n${notes.join("\n")}\n`);
      });
    </script>
  </body>
</html>
```

```md
## Review Notes

- medium: Check whether this changes public behavior.
```
<!--/agd:artifact-->
