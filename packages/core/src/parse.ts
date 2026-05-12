import { parseInlineMetadata, parseMetadataLine } from "./metadata.js";
import type {
  AgentDocsAst,
  AgentDocsBlockNode,
  AgentDocsDiagnostic,
  AgentDocsMetadata,
  AgentDocsNode,
  ParseAgentDocOptions
} from "./types.js";
import { validateAgentDoc } from "./validate.js";

const openCommentPattern = /^\s*<!--agd:([\w-]+)(.*?)-->\s*$/;
const closeCommentPattern = /^\s*<!--\/agd:([\w-]+)-->\s*$/;
const visibleAlertPattern = /^\s*>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/;
const calloutAliases = new Set(["note", "tip", "important", "warning", "caution", "risk", "success"]);

export function parseAgentDoc(markdown: string, options: ParseAgentDocOptions = {}): AgentDocsAst {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const nodes: AgentDocsNode[] = [];
  const diagnostics: AgentDocsDiagnostic[] = [];
  let textBuffer: string[] = [];
  let textStartLine = 1;
  let index = 0;
  let version: string | undefined;

  const flushText = () => {
    if (textBuffer.length === 0) return;
    const value = textBuffer.join("\n");
    if (value.trim().length > 0) {
      nodes.push({ kind: "text", line: textStartLine, value });
    }
    textBuffer = [];
  };

  const pushTextLine = (line: string, lineNumber: number) => {
    if (textBuffer.length === 0) textStartLine = lineNumber;
    textBuffer.push(line);
  };

  while (index < lines.length) {
    const line = lines[index] ?? "";
    const lineNumber = index + 1;
    const openMatch = line.match(openCommentPattern);

    if (openMatch) {
      flushText();
      const rawType = openMatch[1] ?? "unknown";
      const rawMetadata = openMatch[2] ?? "";
      const metadata = parseInlineMetadata(rawMetadata.trim());
      const normalized = normalizeBlockType(rawType, metadata);

      if (normalized.type === "doc") {
        version = stringifyMetadata(metadata["agentdocs-version"]);
        nodes.push({
          kind: "block",
          type: normalized.type,
          line: lineNumber,
          syntax: "comment",
          metadata,
          content: "",
          raw: line
        });
        index += 1;
        continue;
      }

      const closingIndex = findClosingComment(lines, index + 1, rawType);
      if (closingIndex === -1) {
        diagnostics.push({
          severity: "error",
          line: lineNumber,
          blockType: rawType,
          issue: `Missing closing marker for agd:${rawType}`,
          fix: `Add <!--/agd:${rawType}-->`
        });
        pushTextLine(line, lineNumber);
        index += 1;
        continue;
      }

      const contentLines = lines.slice(index + 1, closingIndex);
      const rawLines = lines.slice(index, closingIndex + 1);
      nodes.push({
        kind: "block",
        type: normalized.type,
        line: lineNumber,
        syntax: "comment",
        metadata: normalized.metadata,
        content: contentLines.join("\n"),
        raw: rawLines.join("\n")
      });
      index = closingIndex + 1;
      continue;
    }

    const visibleMatch = line.match(visibleAlertPattern);
    if (visibleMatch) {
      const parsed = parseVisibleBlockquote(lines, index);
      if (parsed) {
        flushText();
        nodes.push(parsed.node);
        index = parsed.nextIndex;
        continue;
      }
    }

    pushTextLine(line, lineNumber);
    index += 1;
  }

  flushText();

  const ast: AgentDocsAst = {
    type: "agentDocs",
    version,
    nodes,
    diagnostics
  };
  ast.diagnostics.push(...validateAgentDoc(ast, { strict: options.strict }));
  return ast;
}

function findClosingComment(lines: string[], startIndex: number, type: string): number {
  for (let index = startIndex; index < lines.length; index += 1) {
    const closeMatch = (lines[index] ?? "").match(closeCommentPattern);
    if (closeMatch?.[1] === type) return index;
  }
  return -1;
}

function parseVisibleBlockquote(
  lines: string[],
  startIndex: number
): { node: AgentDocsBlockNode; nextIndex: number } | null {
  const collected: string[] = [];
  let index = startIndex;
  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (line.startsWith(">") || line.trim() === "") {
      collected.push(line);
      index += 1;
      continue;
    }
    break;
  }

  const stripped = collected.map((line) => line.replace(/^\s*>\s?/, ""));
  const metadata: AgentDocsMetadata = {};
  let contentStart = -1;
  let rawType: string | undefined;

  for (let offset = 1; offset < stripped.length; offset += 1) {
    const strippedLine = stripped[offset] ?? "";
    if (strippedLine.trim() === "") {
      contentStart = offset + 1;
      break;
    }
    const metadataLine = parseMetadataLine(strippedLine);
    if (!metadataLine) continue;
    const [key, value] = metadataLine;
    if (key === "agentdocs") {
      rawType = String(value);
    } else {
      metadata[key] = value;
    }
  }

  if (!rawType) return null;
  const normalized = normalizeBlockType(rawType, metadata);
  const content = stripped.slice(contentStart === -1 ? stripped.length : contentStart).join("\n");

  return {
    node: {
      kind: "block",
      type: normalized.type,
      line: startIndex + 1,
      syntax: "blockquote",
      metadata: normalized.metadata,
      content,
      raw: collected.join("\n")
    },
    nextIndex: index
  };
}

function normalizeBlockType(
  rawType: string | undefined,
  metadata: AgentDocsMetadata
): { type: string; metadata: AgentDocsMetadata } {
  const type = (rawType ?? "unknown").toLowerCase();
  if (calloutAliases.has(type)) {
    return {
      type: "callout",
      metadata: {
        type,
        ...metadata
      }
    };
  }
  return { type, metadata };
}

function stringifyMetadata(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  return String(value);
}
