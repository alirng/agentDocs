import { describe, expect, it } from "vitest";
import { parseAgentDoc } from "@agentdocs0/core";
import { renderHtml } from "../src/index.js";

describe("renderHtml", () => {
  it("renders semantic blocks into a self-contained document", () => {
    const ast = parseAgentDoc(`# Example

<!--agd:decision status=proposed title="Decision"-->
Use agentDocs.
<!--/agd:decision-->`);

    const html = renderHtml(ast);
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("agentdocs-document");
    expect(html).toContain("Use agentDocs.");
    expect(html).toContain("Decision");
  });

  it("renders artifacts as sandboxed iframes", () => {
    const ast = parseAgentDoc(`<!--agd:artifact name="Demo" height=320-->
\`\`\`html
<!doctype html>
<html><body><script>window.agentdocs.export("ok")</script></body></html>
\`\`\`
<!--/agd:artifact-->`);

    const html = renderHtml(ast);
    expect(html).toContain('sandbox="allow-scripts"');
    expect(html).not.toContain("allow-same-origin");
    expect(html).toContain("window.agentdocs");
  });
});
