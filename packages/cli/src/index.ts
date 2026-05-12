#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { parseAgentDoc, type AgentDocsDiagnostic } from "@agentdocs0/core";
import { renderHtml } from "@agentdocs0/renderer-html";
import { glob } from "tinyglobby";

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
  const { inputs, options } = parseArgs(argv);
  if (inputs.length === 0) fail("Usage: agentdocs build <input...> [--out file-or-dir]");
  const inputPaths = await expandInputs(inputs);
  if (inputPaths.length === 0) fail("No input files matched.");
  const strict = Boolean(options.strict);
  const outOption = stringOption(options.out);
  if (inputPaths.length > 1 && outOption && outOption.endsWith(".html")) {
    fail("--out must be a directory when building multiple input files.");
  }

  let hadErrors = false;
  for (const inputPath of inputPaths) {
    const markdown = await readFile(inputPath, "utf8");
    const ast = parseAgentDoc(markdown, { filePath: inputPath, strict });
    printDiagnostics(ast.diagnostics);
    if (ast.diagnostics.some((diagnostic) => diagnostic.severity === "error")) {
      hadErrors = true;
      if (strict) continue;
    }

    const out = outputPathFor(inputPath, outOption, inputPaths.length);
    const html = renderHtml(ast, {
      allowArtifacts: !Boolean(options["no-artifacts"]),
      noJs: Boolean(options["no-js"]),
      selfContained: options["self-contained"] !== false,
      theme: themeOption(options.theme)
    });
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, html);
    console.log(`Built ${out}`);
  }

  if (strict && hadErrors) process.exit(1);
}

async function validate(argv: string[]) {
  const { inputs, options } = parseArgs(argv);
  if (inputs.length === 0) fail("Usage: agentdocs validate <input...> [--strict]");
  const inputPaths = await expandInputs(inputs);
  if (inputPaths.length === 0) fail("No input files matched.");
  let diagnosticCount = 0;
  let hasErrors = false;
  for (const inputPath of inputPaths) {
    const markdown = await readFile(inputPath, "utf8");
    const ast = parseAgentDoc(markdown, { filePath: inputPath, strict: Boolean(options.strict) });
    diagnosticCount += ast.diagnostics.length;
    hasErrors ||= ast.diagnostics.some((diagnostic) => diagnostic.severity === "error");
    printDiagnostics(ast.diagnostics);
  }
  if (diagnosticCount === 0) console.log(`agentDocs validation passed (${inputPaths.length} file${inputPaths.length === 1 ? "" : "s"})`);
  if (hasErrors) process.exit(1);
}

async function preview(argv: string[]) {
  const { inputs } = parseArgs(argv);
  const input = inputs[0];
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

function parseArgs(argv: string[]): { inputs: string[]; options: CliOptions } {
  const options: CliOptions = {};
  const inputs: string[] = [];
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
    } else {
      inputs.push(arg);
    }
  }
  return { inputs, options };
}

function printDiagnostics(diagnostics: AgentDocsDiagnostic[]) {
  for (const diagnostic of diagnostics) {
    const label = diagnostic.blockType ? `Block: ${diagnostic.blockType}` : "Document";
    const location = `${diagnostic.filePath ? `${diagnostic.filePath}:` : ""}${diagnostic.line}`;
    console.error(`${diagnostic.severity.toUpperCase()} ${location} ${label}: ${diagnostic.issue}`);
    if (diagnostic.fix) console.error(`  Fix: ${diagnostic.fix}`);
  }
}

function defaultOutPath(inputPath: string): string {
  const ext = extname(inputPath);
  return ext ? inputPath.slice(0, -ext.length) + ".html" : `${inputPath}.html`;
}

function outputPathFor(inputPath: string, outOption: string | undefined, inputCount: number): string {
  if (!outOption) return defaultOutPath(inputPath);
  if (inputCount === 1 && outOption.endsWith(".html")) return outOption;
  return join(outOption, defaultHtmlName(inputPath));
}

function defaultHtmlName(inputPath: string): string {
  const fileName = inputPath.split(/[\\/]/).pop() ?? "document.agent.md";
  return fileName.replace(/(?:\.agent)?\.md$/i, ".html");
}

async function expandInputs(inputs: string[]): Promise<string[]> {
  const patterns = inputs.filter((input) => /[*?[\]{}]/.test(input));
  const direct = inputs.filter((input) => !/[*?[\]{}]/.test(input)).map((input) => resolve(input));
  const matched = patterns.length > 0 ? await glob(patterns, { absolute: true, onlyFiles: true }) : [];
  return [...new Set([...direct, ...matched])].sort();
}

function stringOption(value: string | boolean | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function themeOption(value: string | boolean | undefined): "default" | "repo" | "print" {
  if (value === "repo" || value === "print") return value;
  return "default";
}

function printHelp() {
  console.log(`agentdocs

Commands:
  build <input...>   Render agentDocs Markdown files to HTML
  validate <input...> Validate agentDocs Markdown files
  preview <input>    Build a local preview HTML file
  init               Create agentdocs.md if missing
  examples           Print bundled example paths
`);
}

function fail(message: string): never {
  console.error(message);
  throw new Error(message);
}
