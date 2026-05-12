import type { AgentDocsBlockNode } from "@agentdocs0/core";
import { escapeAttribute, escapeHtml } from "./escape.js";

interface TableData {
  headers: string[];
  rows: string[][];
}

export function renderChart(block: AgentDocsBlockNode): string {
  const data = parseTable(block.content);
  const type = String(block.metadata["type"] ?? "bar");
  if (data.rows.length === 0) {
    return `<p class="agentdocs-meta">No chart data available.</p>`;
  }

  if (type === "pie") return renderPie(data);
  if (type === "line" || type === "area") return renderLine(data, type === "area");
  return renderBar(data);
}

function renderBar(data: TableData): string {
  const values = numericRows(data);
  const max = Math.max(...values.map((row) => row.value), 1);
  const width = 640;
  const rowHeight = 34;
  const height = values.length * rowHeight + 32;
  const bars = values
    .map((row, index) => {
      const y = index * rowHeight + 20;
      const barWidth = Math.max(1, (row.value / max) * 420);
      return `<g>
        <text x="0" y="${y + 16}" font-size="12" fill="currentColor">${escapeHtml(row.label)}</text>
        <rect x="150" y="${y}" width="${barWidth}" height="20" rx="4" fill="currentColor" opacity="0.22"></rect>
        <text x="${160 + barWidth}" y="${y + 15}" font-size="12" fill="currentColor">${escapeHtml(row.value)}</text>
      </g>`;
    })
    .join("");
  return `<svg role="img" viewBox="0 0 ${width} ${height}" width="100%" height="${height}" aria-label="${escapeAttribute(data.headers.join(" by "))}">${bars}</svg>`;
}

function renderLine(data: TableData, fill: boolean): string {
  const values = numericRows(data);
  const max = Math.max(...values.map((row) => row.value), 1);
  const width = 640;
  const height = 220;
  const step = values.length > 1 ? 560 / (values.length - 1) : 0;
  const points = values
    .map((row, index) => `${40 + index * step},${180 - (row.value / max) * 140}`)
    .join(" ");
  const fillPoints = fill ? `40,180 ${points} ${40 + (values.length - 1) * step},180` : "";
  return `<svg role="img" viewBox="0 0 ${width} ${height}" width="100%" height="${height}" aria-label="${escapeAttribute(data.headers.join(" by "))}">
    ${fill ? `<polygon points="${fillPoints}" fill="currentColor" opacity="0.12"></polygon>` : ""}
    <polyline points="${points}" fill="none" stroke="currentColor" stroke-width="3"></polyline>
  </svg>`;
}

function renderPie(data: TableData): string {
  const values = numericRows(data);
  const total = values.reduce((sum, row) => sum + row.value, 0) || 1;
  let offset = 0;
  const segments = values
    .map((row) => {
      const percent = row.value / total;
      const segment = `<circle r="70" cx="100" cy="100" fill="transparent" stroke="currentColor" stroke-width="44" stroke-dasharray="${percent * 439.82} 439.82" stroke-dashoffset="${-offset}" opacity="${0.25 + percent * 0.65}"></circle>`;
      offset += percent * 439.82;
      return segment;
    })
    .join("");
  const legend = values.map((row) => `<li>${escapeHtml(row.label)}: ${escapeHtml(row.value)}</li>`).join("");
  return `<div class="agentdocs-chart-pie"><svg role="img" viewBox="0 0 200 200" width="220" height="220">${segments}</svg><ul>${legend}</ul></div>`;
}

function parseTable(content: string): TableData {
  const lines = content.split("\n").filter((line) => line.trim().startsWith("|"));
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = splitRow(lines[0] ?? "");
  const rows = lines.slice(2).map(splitRow);
  return { headers, rows };
}

function splitRow(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function numericRows(data: TableData): Array<{ label: string; value: number }> {
  return data.rows.map((row) => ({
    label: row[0] ?? "",
    value: Number(row[1] ?? 0) || 0
  }));
}
