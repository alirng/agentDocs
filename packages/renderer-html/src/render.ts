import type { AgentDocsAst, AgentDocsBlockNode, AgentDocsMetadata } from "@agentdocs0/core";
import { themes, type AgentDocsThemeName } from "@agentdocs0/themes";
import { renderArtifact, artifactRuntimeScript } from "./artifact.js";
import { renderChart } from "./charts.js";
import { escapeAttribute, escapeHtml } from "./escape.js";
import { renderMarkdown } from "./markdown.js";

export interface RenderHtmlOptions {
  title?: string;
  theme?: AgentDocsThemeName;
  selfContained?: boolean;
  allowArtifacts?: boolean;
  noJs?: boolean;
}

export function renderHtml(ast: AgentDocsAst, options: RenderHtmlOptions = {}): string {
  const title = options.title ?? inferTitle(ast) ?? "agentDocs";
  const allowArtifacts = options.allowArtifacts ?? true;
  const body = ast.nodes
    .map((node, index) => {
      if (node.kind === "text") return renderMarkdown(node.value);
      if (node.type === "doc") return "";
      if (node.type === "artifact") {
        return allowArtifacts ? renderArtifact(node, index) : renderArtifactDisabled(node);
      }
      return renderBlock(node);
    })
    .join("\n");

  const scripts = options.noJs ? "" : artifactRuntimeScript();
  const css = themes[options.theme ?? "default"];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>${css}</style>
</head>
<body>
  <main class="agentdocs-document">
${body}
  </main>
  ${scripts}
</body>
</html>`;
}

function renderBlock(block: AgentDocsBlockNode): string {
  switch (block.type) {
    case "card":
      return wrapBlock(block, renderMarkdown(block.content));
    case "callout":
      return renderCallout(block);
    case "metric":
      return renderMetric(block);
    case "comparison":
    case "table":
      return wrapBlock(block, renderMarkdown(block.content), "agentdocs-table");
    case "timeline":
      return wrapBlock(block, renderMarkdown(block.content), "agentdocs-timeline");
    case "decision":
      return wrapBlock(block, renderMarkdown(block.content), "agentdocs-decision");
    case "checklist":
      return wrapBlock(block, renderMarkdown(block.content), "agentdocs-checklist");
    case "accordion":
      return renderAccordion(block);
    case "chart":
      return wrapBlock(block, renderChart(block), "agentdocs-chart");
    default:
      return renderMarkdown(block.content);
  }
}

function wrapBlock(block: AgentDocsBlockNode, content: string, extraClass = ""): string {
  return `<section class="agentdocs-block ${extraClass}" data-agentdocs-block="${escapeAttribute(block.type)}">
    ${renderTitle(block.metadata)}
    ${content}
  </section>`;
}

function renderCallout(block: AgentDocsBlockNode): string {
  const type = String(block.metadata["type"] ?? "note");
  return `<aside class="agentdocs-block agentdocs-callout" data-callout-type="${escapeAttribute(type)}">
    ${renderTitle(block.metadata)}
    ${renderMarkdown(block.content)}
  </aside>`;
}

function renderMetric(block: AgentDocsBlockNode): string {
  const label = block.metadata["label"] ?? "";
  const value = block.metadata["value"] ?? block.content.trim();
  const delta = block.metadata["delta"];
  const period = block.metadata["period"];
  return `<section class="agentdocs-block agentdocs-metric">
    <p class="agentdocs-meta">${escapeHtml(label)}</p>
    <div class="agentdocs-metric-value">${escapeHtml(value)}</div>
    ${delta ? `<div class="agentdocs-metric-delta">${escapeHtml(delta)}</div>` : ""}
    ${period ? `<p class="agentdocs-meta">${escapeHtml(period)}</p>` : ""}
  </section>`;
}

function renderAccordion(block: AgentDocsBlockNode): string {
  const title = block.metadata["title"] ?? "Details";
  return `<details class="agentdocs-block agentdocs-accordion">
    <summary>${escapeHtml(title)}</summary>
    ${renderMarkdown(block.content)}
  </details>`;
}

function renderArtifactDisabled(block: AgentDocsBlockNode): string {
  return `<section class="agentdocs-block agentdocs-artifact">
    ${renderTitle(block.metadata)}
    <p class="agentdocs-meta">Artifact rendering is disabled.</p>
    ${renderMarkdown(block.content)}
  </section>`;
}

function renderTitle(metadata: AgentDocsMetadata): string {
  return metadata["title"] ? `<p class="agentdocs-block-title">${escapeHtml(metadata["title"])}</p>` : "";
}

function inferTitle(ast: AgentDocsAst): string | undefined {
  for (const node of ast.nodes) {
    if (node.kind === "block" && node.type === "doc" && node.metadata["title"]) {
      return String(node.metadata["title"]);
    }
    if (node.kind === "text") {
      const match = node.value.match(/^#\s+(.+)$/m);
      if (match?.[1]) return match[1];
    }
  }
  return undefined;
}
