# Triage Board

Use this artifact when a human needs to bucket or reorder a set of issues, tasks, risks, or ideas.

<!--agd:artifact name="triage-board" height=620 export=triage-output.yaml-->
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: system-ui, sans-serif; margin: 16px; color: #111827; }
      main { display: grid; grid-template-columns: repeat(4, minmax(140px, 1fr)); gap: 12px; }
      section { border: 1px solid #d1d5db; border-radius: 12px; padding: 12px; min-height: 220px; background: #fff; }
      h2 { margin-top: 0; font-size: 18px; }
      .card { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; margin: 8px 0; padding: 8px; cursor: grab; }
      button { margin-top: 16px; padding: 8px 12px; }
    </style>
  </head>
  <body>
    <main>
      <section data-lane="now"><h2>Now</h2><div class="card" draggable="true">Replace sample items</div></section>
      <section data-lane="next"><h2>Next</h2></section>
      <section data-lane="later"><h2>Later</h2></section>
      <section data-lane="cut"><h2>Cut</h2></section>
    </main>
    <button id="export">Export YAML</button>
    <script>
      let dragged;
      document.addEventListener("dragstart", (event) => { dragged = event.target; });
      document.querySelectorAll("section").forEach((lane) => {
        lane.addEventListener("dragover", (event) => event.preventDefault());
        lane.addEventListener("drop", () => {
          if (dragged && dragged.classList.contains("card")) lane.appendChild(dragged);
        });
      });
      document.getElementById("export").addEventListener("click", () => {
        const lanes = [...document.querySelectorAll("section")].map((lane) => {
          const cards = [...lane.querySelectorAll(".card")].map((card) => card.textContent.trim());
          return `  ${lane.dataset.lane}: [${cards.join(", ")}]`;
        });
        window.agentdocs.export(`order:\n${lanes.join("\n")}\n`);
      });
    </script>
  </body>
</html>
```

```yaml
order:
  now: [Replace sample items]
  next: []
  later: []
  cut: []
```
<!--/agd:artifact-->
