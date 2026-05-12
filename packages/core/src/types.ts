export const AGENTDOCS_BLOCK_TYPES = [
  "doc",
  "card",
  "callout",
  "metric",
  "comparison",
  "decision",
  "checklist",
  "timeline",
  "accordion",
  "table",
  "chart",
  "artifact"
] as const;

export type AgentDocsBlockType = (typeof AGENTDOCS_BLOCK_TYPES)[number];

export type AgentDocsMetadataValue = string | number | boolean;

export type AgentDocsMetadata = Record<string, AgentDocsMetadataValue>;

export type AgentDocsSyntax = "comment" | "blockquote";

export type AgentDocsSeverity = "warning" | "error";

export interface AgentDocsDiagnostic {
  severity: AgentDocsSeverity;
  line: number;
  blockType?: string;
  issue: string;
  fix?: string;
}

export interface AgentDocsTextNode {
  kind: "text";
  line: number;
  value: string;
}

export interface AgentDocsBlockNode {
  kind: "block";
  type: string;
  line: number;
  syntax: AgentDocsSyntax;
  metadata: AgentDocsMetadata;
  content: string;
  raw: string;
}

export type AgentDocsNode = AgentDocsTextNode | AgentDocsBlockNode;

export interface AgentDocsAst {
  type: "agentDocs";
  version?: string;
  nodes: AgentDocsNode[];
  diagnostics: AgentDocsDiagnostic[];
}

export interface ParseAgentDocOptions {
  filePath?: string;
  strict?: boolean;
}

export interface ValidateAgentDocOptions {
  strict?: boolean;
}
