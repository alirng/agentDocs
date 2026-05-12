import { escapeHtml } from "./escape.js";

export function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const fence = line.match(/^```(\w+)?\s*$/);
    if (fence) {
      const lang = fence[1] ?? "";
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index] ?? "")) {
        code.push(lines[index] ?? "");
        index += 1;
      }
      index += 1;
      html.push(`<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1]?.length ?? 1;
      html.push(`<h${level}>${renderInline(heading[2] ?? "")}</h${level}>`);
      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      const tableLines: string[] = [];
      while (index < lines.length && (lines[index] ?? "").trim().startsWith("|")) {
        tableLines.push(lines[index] ?? "");
        index += 1;
      }
      html.push(renderTable(tableLines));
      continue;
    }

    if (/^\s*[-*]\s+/.test(line) || /^\s*-\s+\[[ xX]\]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && (/^\s*[-*]\s+/.test(lines[index] ?? "") || /^\s*-\s+\[[ xX]\]\s+/.test(lines[index] ?? ""))) {
        const item = lines[index] ?? "";
        const task = item.match(/^\s*-\s+\[([ xX])\]\s+(.+)$/);
        if (task) {
          const checked = task[1]?.toLowerCase() === "x" ? " checked" : "";
          items.push(`<li><input type="checkbox" disabled${checked}> ${renderInline(task[2] ?? "")}</li>`);
        } else {
          items.push(`<li>${renderInline(item.replace(/^\s*[-*]\s+/, ""))}</li>`);
        }
        index += 1;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index] ?? "")) {
        items.push(`<li>${renderInline((lines[index] ?? "").replace(/^\s*\d+\.\s+/, ""))}</li>`);
        index += 1;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index] ?? "")) {
        quote.push((lines[index] ?? "").replace(/^\s*>\s?/, ""));
        index += 1;
      }
      html.push(`<blockquote>${renderMarkdown(quote.join("\n"))}</blockquote>`);
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length && (lines[index] ?? "").trim() !== "") {
      paragraph.push(lines[index] ?? "");
      index += 1;
    }
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
  }

  return html.join("\n");
}

export function renderInline(value: string): string {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function isTableStart(lines: string[], index: number): boolean {
  const current = (lines[index] ?? "").trim();
  const next = (lines[index + 1] ?? "").trim();
  return current.startsWith("|") && /^\|?\s*:?-{3,}:?\s*\|/.test(next);
}

function renderTable(lines: string[]): string {
  const rows = lines
    .filter((line, index) => index !== 1 && line.trim().startsWith("|"))
    .map((line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()));
  const [head = [], ...body] = rows;
  const headHtml = `<thead><tr>${head.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead>`;
  const bodyHtml = `<tbody>${body
    .map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`)
    .join("")}</tbody>`;
  return `<div class="agentdocs-table-wrap"><table>${headHtml}${bodyHtml}</table></div>`;
}
