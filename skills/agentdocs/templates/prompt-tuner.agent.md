# Prompt Tuner

Use this artifact when a human needs to edit a prompt and inspect multiple sample outputs before committing the final prompt.

<!--agd:artifact name="prompt-tuner" height=640 export=prompt-output.md-->
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: system-ui, sans-serif; margin: 16px; color: #111827; }
      main { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      textarea { width: 100%; min-height: 320px; padding: 12px; font: 14px ui-monospace, monospace; }
      pre { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; white-space: pre-wrap; }
      button { margin-top: 12px; padding: 8px 12px; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <h2>Prompt</h2>
        <textarea id="prompt">Summarize {{topic}} for {{audience}} in three bullets.</textarea>
        <button id="export">Export Prompt</button>
      </section>
      <section>
        <h2>Preview</h2>
        <pre id="preview"></pre>
      </section>
    </main>
    <script>
      const prompt = document.getElementById("prompt");
      const preview = document.getElementById("preview");
      function render() {
        preview.textContent = prompt.value
          .replaceAll("{{topic}}", "agentDocs")
          .replaceAll("{{audience}}", "maintainers");
      }
      prompt.addEventListener("input", render);
      document.getElementById("export").addEventListener("click", () => {
        window.agentdocs.export("```txt\n" + prompt.value + "\n```\n");
      });
      render();
    </script>
  </body>
</html>
```

```txt
Summarize {{topic}} for {{audience}} in three bullets.
```
<!--/agd:artifact-->
