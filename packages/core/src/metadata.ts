import type { AgentDocsMetadata, AgentDocsMetadataValue } from "./types.js";

const metadataTokenPattern = /([\w-]+)=("([^"]*)"|'([^']*)'|[^\s]+)/g;

export function parseInlineMetadata(input: string): AgentDocsMetadata {
  const metadata: AgentDocsMetadata = {};
  for (const match of input.matchAll(metadataTokenPattern)) {
    const key = match[1];
    if (!key) continue;
    const rawValue = match[3] ?? match[4] ?? match[2] ?? "";
    metadata[key] = coerceMetadataValue(rawValue);
  }
  return metadata;
}

export function parseMetadataLine(line: string): [string, AgentDocsMetadataValue] | null {
  const index = line.indexOf(":");
  if (index === -1) return null;
  const key = line.slice(0, index).trim();
  const value = line.slice(index + 1).trim();
  if (!key) return null;
  return [key, coerceMetadataValue(value)];
}

function coerceMetadataValue(value: string): AgentDocsMetadataValue {
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}
