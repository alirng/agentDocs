export const defaultTheme = `
:root {
  color-scheme: light dark;
  --agd-bg: #f7f7f8;
  --agd-surface: #ffffff;
  --agd-surface-muted: #f1f5f9;
  --agd-text: #111827;
  --agd-muted: #6b7280;
  --agd-border: #d1d5db;
  --agd-accent: #2563eb;
  --agd-accent-soft: #dbeafe;
  --agd-warning: #92400e;
  --agd-warning-soft: #fef3c7;
  --agd-danger: #991b1b;
  --agd-danger-soft: #fee2e2;
  --agd-success: #166534;
  --agd-success-soft: #dcfce7;
}

@media (prefers-color-scheme: dark) {
  :root {
    --agd-bg: #0f172a;
    --agd-surface: #111827;
    --agd-surface-muted: #1f2937;
    --agd-text: #f8fafc;
    --agd-muted: #9ca3af;
    --agd-border: #374151;
    --agd-accent: #60a5fa;
    --agd-accent-soft: #172554;
    --agd-warning: #fbbf24;
    --agd-warning-soft: #422006;
    --agd-danger: #fca5a5;
    --agd-danger-soft: #450a0a;
    --agd-success: #86efac;
    --agd-success-soft: #052e16;
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--agd-bg);
  color: var(--agd-text);
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.6;
}

.agentdocs-document {
  max-width: 980px;
  margin: 0 auto;
  padding: 48px 20px 80px;
}

.agentdocs-document h1,
.agentdocs-document h2,
.agentdocs-document h3 {
  line-height: 1.2;
}

.agentdocs-block {
  background: var(--agd-surface);
  border: 1px solid var(--agd-border);
  border-radius: 16px;
  margin: 20px 0;
  padding: 18px;
  box-shadow: 0 1px 2px rgb(15 23 42 / 8%);
}

.agentdocs-block-title {
  font-weight: 700;
  margin: 0 0 8px;
}

.agentdocs-meta {
  color: var(--agd-muted);
  font-size: 0.875rem;
}

.agentdocs-callout {
  border-left: 6px solid var(--agd-accent);
  background: var(--agd-accent-soft);
}

.agentdocs-callout[data-callout-type="warning"],
.agentdocs-callout[data-callout-type="caution"],
.agentdocs-callout[data-callout-type="risk"] {
  border-left-color: var(--agd-warning);
  background: var(--agd-warning-soft);
}

.agentdocs-callout[data-callout-type="success"] {
  border-left-color: var(--agd-success);
  background: var(--agd-success-soft);
}

.agentdocs-metric {
  display: inline-block;
  min-width: 180px;
}

.agentdocs-metric-value {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1;
}

.agentdocs-metric-delta {
  color: var(--agd-success);
  font-weight: 600;
}

.agentdocs-table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
}

th,
td {
  border: 1px solid var(--agd-border);
  padding: 8px 10px;
  text-align: left;
  vertical-align: top;
}

th {
  background: var(--agd-surface-muted);
}

code,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}

pre {
  background: var(--agd-surface-muted);
  border-radius: 12px;
  overflow-x: auto;
  padding: 14px;
}

.agentdocs-artifact-frame {
  width: 100%;
  border: 1px solid var(--agd-border);
  border-radius: 14px;
  background: white;
}

.agentdocs-artifact-output {
  min-height: 48px;
  white-space: pre-wrap;
}

@media print {
  body {
    background: white;
  }

  .agentdocs-document {
    max-width: none;
    padding: 0;
  }

  .agentdocs-block {
    break-inside: avoid;
    box-shadow: none;
  }
}
`;

export const themes = {
  default: defaultTheme,
  repo: defaultTheme,
  print: defaultTheme
} as const;

export type AgentDocsThemeName = keyof typeof themes;
