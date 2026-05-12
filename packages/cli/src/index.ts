#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { parseAgentDoc, type AgentDocsDiagnostic } from "@agentdocs0/core";
import { renderHtml } from "@agentdocs0/renderer-html";

interface CliOptions {
  [key: string]: string | boolean | undefined;
}

const args = process.argv.slice(2);

main(args).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main(argv: string[]) {
  const [command, ...rest] = argv;
  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "build") {
    await build(rest);
    return;
  }

  if (command === "validate") {
    await validate(rest);
    return;
  }

  if (command === "preview") {
    await preview(rest);
    return;
  }

  if (command === "init") {
    await init();
    return;
  }

  if (command === "examples") {
    printExamples();
    return;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exit(1);
}

async function build(argv: string[]) {
  const { input, options } = parseArgs(argv);
  if (!input) fail("Usage: agentdocs build <input> [--out file.html]");
  const inputPath = resolve(input);
  const markdown = await readFile(inputPath, "utf8");
  const strict = Boolean(options.strict);
  const ast = parseAgentDoc(markdown, { filePath: inputPath, strict });
  const diagnostics = ast.diagnostics;
  printDiagnostics(diagnostics);
  if (strict && diagnostics.some((diagnostic) => diagnostic.severity === "error")) {
    process.exit(1);
  }

  const out = String(options.out ?? defaultOutPath(inputPath));
  const html = renderHtml(ast, {
    allowArtifacts: options["no-artifacts"] ? false : true,
    noJs: Boolean(options["no-js"]),
    selfContained: options["self-contained"] !== false,
    theme: "default"
  });
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  console.log(`Built ${out}`);
}

async function validate(argv: string[]) {
  const { input, options } = parseArgs(argv);
  if (!input) fail("Usage: agentdocs validate <input> [--strict]");
  const inputPath = resolve(input);
  const markdown = await readFile(inputPath, "utf8");
  const ast = parseAgentDoc(markdown, { filePath: inputPath, strict: Boolean(options.strict) });
  printDiagnostics(ast.diagnostics);
  if (ast.diagnostics.length === 0) {
    console.log("agentDocs validation passed");
  }
  if (ast.diagnostics.some((diagnostic) => diagnostic.severity === "error")) {
    process.exit(1);
  }
}

async function preview(argv: string[]) {
  const { input } = parseArgs(argv);
  if (!input) fail("Usage: agentdocs preview <input>");
  const out = join(".agentdocs", "preview.html");
  await build([input, "--out", out]);
  console.log(`Preview written to ${out}`);
}

async function init() {
  await writeFile(
    "agentdocs.md",
    `# agentDocs Authoring Guide\n\nUse ordinary Markdown for most content. Use agd: blocks when they improve readability.\n`,
    { flag: "wx" }
  ).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "EEXIST") {
      console.log("agentdocs.md already exists; leaving it unchanged.");
      return;
    }
    throw error;
  });
}

function printExamples() {
  console.log(`examples/prd.agent.md
examples/roadmap.agent.md
examples/agent-plan.agent.md
examples/incident-report.agent.md
examples/triage-board.agent.md`);
}

function parseArgs(argv: string[]): { input?: string; options: CliOptions } {
  const options: CliOptions = {};
  let input: string | undefined;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index] ?? "";
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[index + 1];
      if (next && !next.startsWith("--")) {
        options[key] = next;
        index += 1;
      } else {
        options[key] = true;
      }
    } else if (!input) {
      input = arg;
    }
  }
  return { input, options };
}

function printDiagnostics(diagnostics: AgentDocsDiagnostic[]) {
  for (const diagnostic of diagnostics) {
    const label = diagnostic.blockType ? `Block: ${diagnostic.blockType}` : "Document";
    console.error(`${diagnostic.severity.toUpperCase()} line ${diagnostic.line} ${label}: ${diagnostic.issue}`);
    if (diagnostic.fix) console.error(`  Fix: ${diagnostic.fix}`);
  }
}

function defaultOutPath(inputPath: string): string {
  const ext = extname(inputPath);
  return ext ? inputPath.slice(0, -ext.length) + ".html" : `${inputPath}.html`;
}

function printHelp() {
  console.log(`agentdocs

Commands:
  build <input>      Render an agentDocs Markdown file to HTML
  validate <input>   Validate an agentDocs Markdown file
  preview <input>    Build a local preview HTML file
  init               Create agentdocs.md if missing
  examples           Print bundled example paths
`);
}

function fail(message: string): never {
  console.error(message);
  throw new Error(message);
}
