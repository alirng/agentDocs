import { AGENTDOCS_BLOCK_TYPES } from "./types.js";
import type {
  AgentDocsAst,
  AgentDocsBlockNode,
  AgentDocsDiagnostic,
  ValidateAgentDocOptions
} from "./types.js";

const allowedTypes = new Set<string>(AGENTDOCS_BLOCK_TYPES);
const chartTypes = new Set(["bar", "line", "area", "pie"]);

export function validateAgentDoc(
  ast: AgentDocsAst,
  options: ValidateAgentDocOptions = {}
): AgentDocsDiagnostic[] {
  const diagnostics: AgentDocsDiagnostic[] = [];

  for (const node of ast.nodes) {
    if (node.kind === "text") {
      if (containsScript(node.value)) {
        diagnostics.push({
          severity: "error",
          line: node.line,
          issue: "Executable <script> tags are not allowed in normal Markdown",
          fix: "Move custom JavaScript into an agd:artifact block"
        });
      }
      continue;
    }

    validateBlock(node, diagnostics, options);
  }

  return diagnostics;
}

function validateBlock(
  block: AgentDocsBlockNode,
  diagnostics: AgentDocsDiagnostic[],
  options: ValidateAgentDocOptions
) {
  if (!allowedTypes.has(block.type)) {
    diagnostics.push({
      severity: options.strict ? "error" : "warning",
      line: block.line,
      blockType: block.type,
      issue: `Unknown block type "${block.type}"`,
      fix: "Use one of the MVP block types or remove the agentDocs marker"
    });
  }

  if (block.type !== "artifact" && containsScript(block.content)) {
    diagnostics.push({
      severity: "error",
      line: block.line,
      blockType: block.type,
      issue: "Executable <script> tags are only allowed inside artifact blocks",
      fix: "Use agd:artifact for custom HTML/JavaScript"
    });
  }

  if (block.type === "chart") validateChart(block, diagnostics);
  if (block.type === "table" || block.type === "timeline" || block.type === "comparison") {
    validateTableBackedBlock(block, diagnostics);
  }
  if (block.type === "metric") validateMetric(block, diagnostics, options);
  if (block.type === "artifact") validateArtifact(block, diagnostics, options);
}

function validateChart(block: AgentDocsBlockNode, diagnostics: AgentDocsDiagnostic[]) {
  const chartType = String(block.metadata["type"] ?? "");
  if (!chartTypes.has(chartType)) {
    diagnostics.push({
      severity: "error",
      line: block.line,
      blockType: block.type,
      issue: "Chart block is missing a supported type",
      fix: "Add type=bar, type=line, type=area, or type=pie"
    });
  }
  validateTableBackedBlock(block, diagnostics);
}

function validateTableBackedBlock(block: AgentDocsBlockNode, diagnostics: AgentDocsDiagnostic[]) {
  if (!hasMarkdownTable(block.content)) {
    diagnostics.push({
      severity: "warning",
      line: block.line,
      blockType: block.type,
      issue: `${block.type} should contain a Markdown table for fallback readability`,
      fix: "Add a Markdown table between the opening and closing markers"
    });
  }
}

function validateMetric(
  block: AgentDocsBlockNode,
  diagnostics: AgentDocsDiagnostic[],
  options: ValidateAgentDocOptions
) {
  if (block.metadata["label"] === undefined || block.metadata["value"] === undefined) {
    diagnostics.push({
      severity: options.strict ? "error" : "warning",
      line: block.line,
      blockType: block.type,
      issue: "Metric block should include label and value metadata",
      fix: "Add label=\"...\" and value=..."
    });
  }
}

function validateArtifact(
  block: AgentDocsBlockNode,
  diagnostics: AgentDocsDiagnostic[],
  options: ValidateAgentDocOptions
) {
  if (!/```html\s*[\s\S]*?```/.test(block.content)) {
    diagnostics.push({
      severity: "error",
      line: block.line,
      blockType: block.type,
      issue: "Artifact block must contain a fenced html code block",
      fix: "Add a ```html fenced block inside the artifact"
    });
  }

  if (options.strict && /https?:\/\//i.test(block.content)) {
    diagnostics.push({
      severity: "error",
      line: block.line,
      blockType: block.type,
      issue: "Remote network references are disallowed in strict artifact mode",
      fix: "Inline assets or remove remote references"
    });
  }
}

function hasMarkdownTable(content: string): boolean {
  const lines = content.split("\n");
  return lines.some((line, index) => {
    const next = lines[index + 1] ?? "";
    return line.trim().startsWith("|") && /^\s*\|?\s*:?-{3,}:?\s*\|/.test(next);
  });
}

function containsScript(content: string): boolean {
  return /<script\b/i.test(content);
}
