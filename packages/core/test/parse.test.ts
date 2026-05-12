import { describe, expect, it } from "vitest";
import { parseAgentDoc } from "../src/index.js";

describe("parseAgentDoc", () => {
  it("parses comment marker blocks with metadata", () => {
    const ast = parseAgentDoc(`Intro

<!--agd:decision status=proposed owner="Platform team"-->
Use agentDocs.
<!--/agd:decision-->`);

    const block = ast.nodes.find((node) => node.kind === "block");
    expect(block).toMatchObject({
      kind: "block",
      type: "decision",
      metadata: {
        status: "proposed",
        owner: "Platform team"
      },
      content: "Use agentDocs."
    });
    expect(ast.diagnostics).toEqual([]);
  });

  it("parses visible GitHub alert blocks", () => {
    const ast = parseAgentDoc(`> [!WARNING]
> agentdocs: callout
> title: Main risk
>
> Keep fallback readable.`);

    const block = ast.nodes[0];
    expect(block).toMatchObject({
      kind: "block",
      type: "callout",
      syntax: "blockquote",
      metadata: {
        title: "Main risk"
      },
      content: "Keep fallback readable."
    });
  });

  it("maps visible risk aliases to callout blocks", () => {
    const ast = parseAgentDoc(`> [!WARNING]
> agentdocs: risk
>
> Risk body.`);

    const block = ast.nodes[0];
    expect(block).toMatchObject({
      kind: "block",
      type: "callout",
      metadata: {
        type: "risk"
      }
    });
  });

  it("reports unclosed blocks", () => {
    const ast = parseAgentDoc(`<!--agd:card title="Broken"-->
Missing close`);

    expect(ast.diagnostics[0]).toMatchObject({
      severity: "error",
      blockType: "card"
    });
  });

  it("ignores markers inside fenced code blocks", () => {
    const ast = parseAgentDoc(`\`\`\`md
<!--agd:card title="Not a block"-->
\`\`\`

<!--agd:decision status=approved-->
Actual block
<!--/agd:decision-->`);

    const blocks = ast.nodes.filter((node) => node.kind === "block");
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({ type: "decision" });
  });

  it("includes file paths in diagnostics", () => {
    const ast = parseAgentDoc(`<!--agd:unknown-->
Body
<!--/agd:unknown-->`, { filePath: "example.agent.md", strict: true });

    expect(ast.diagnostics[0]).toMatchObject({
      filePath: "example.agent.md",
      severity: "error"
    });
  });

  it("validates artifact html fences", () => {
    const ast = parseAgentDoc(`<!--agd:artifact name="demo"-->
No fence
<!--/agd:artifact-->`);

    expect(ast.diagnostics[0]).toMatchObject({
      severity: "error",
      blockType: "artifact"
    });
  });

  it("captures document version metadata", () => {
    const ast = parseAgentDoc(`<!--agd:doc agentdocs-version=0.1 title="Spec"-->

# Title`);

    expect(ast.version).toBe("0.1");
  });
});
