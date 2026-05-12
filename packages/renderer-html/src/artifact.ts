import type { AgentDocsBlockNode } from "@agentdocs0/core";
import { escapeAttribute, escapeHtml } from "./escape.js";

export function renderArtifact(block: AgentDocsBlockNode, index: number): string {
  const html = extractHtmlFence(block.content);
  if (!html) {
    return `<div class="agentdocs-block agentdocs-artifact"><p class="agentdocs-meta">Artifact is missing a fenced HTML block.</p></div>`;
  }

  const artifactId = `agentdocs-artifact-${index}`;
  const height = Number(block.metadata["height"] ?? 500) || 500;
  const bridgedHtml = injectBridge(html, artifactId);
  const exportTarget = block.metadata["export"];

  return `<section class="agentdocs-block agentdocs-artifact" id="${artifactId}">
    ${block.metadata["name"] ? `<p class="agentdocs-block-title">${escapeHtml(block.metadata["name"])}</p>` : ""}
    <iframe id="${artifactId}-frame" class="agentdocs-artifact-frame" title="${escapeAttribute(block.metadata["name"] ?? "agentDocs artifact")}" sandbox="allow-scripts" height="${height}" srcdoc="${escapeAttribute(bridgedHtml)}"></iframe>
    <details>
      <summary>Artifact export${exportTarget ? `: ${escapeHtml(exportTarget)}` : ""}</summary>
      <button type="button" data-agentdocs-copy="${artifactId}">Copy export</button>
      <pre class="agentdocs-artifact-output" data-agentdocs-artifact-output="${artifactId}">${escapeHtml(extractExportFallback(block.content))}</pre>
    </details>
  </section>`;
}

export function artifactRuntimeScript(): string {
  return `<script>
window.addEventListener("message", function(event) {
  var data = event.data || {};
  if (data.source !== "agentdocs-artifact" || data.type !== "export") return;
  var frame = document.getElementById(data.id + "-frame");
  if (!frame || frame.contentWindow !== event.source) return;
  var output = document.querySelector('[data-agentdocs-artifact-output="' + data.id + '"]');
  if (output) output.textContent = String(data.content || "");
});
document.addEventListener("click", function(event) {
  var target = event.target;
  if (!target || !target.getAttribute) return;
  var id = target.getAttribute("data-agentdocs-copy");
  if (!id) return;
  var output = document.querySelector('[data-agentdocs-artifact-output="' + id + '"]');
  if (!output || !navigator.clipboard) return;
  navigator.clipboard.writeText(output.textContent || "");
});
</script>`;
}

function extractHtmlFence(content: string): string | null {
  const match = content.match(/```html\s*\n([\s\S]*?)\n```/);
  return match?.[1] ?? null;
}

function extractExportFallback(content: string): string {
  const withoutHtml = content.replace(/```html\s*\n[\s\S]*?\n```/, "").trim();
  return withoutHtml;
}

function injectBridge(html: string, artifactId: string): string {
  const bridge = `<script>
window.agentdocs = {
  export: function(content) {
    window.parent.postMessage({
      source: "agentdocs-artifact",
      type: "export",
      id: ${JSON.stringify(artifactId)},
      content: String(content || "")
    }, "*");
  },
  getInput: function() { return null; },
  notify: function(event) {
    window.parent.postMessage({
      source: "agentdocs-artifact",
      type: "notify",
      id: ${JSON.stringify(artifactId)},
      event: event || {}
    }, "*");
  }
};
</script>`;

  if (html.includes("</head>")) return html.replace("</head>", `${bridge}</head>`);
  if (html.includes("<body>")) return html.replace("<body>", `<body>${bridge}`);
  return `${bridge}${html}`;
}
