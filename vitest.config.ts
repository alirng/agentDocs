import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@agentdocs0/core": new URL("./packages/core/src/index.ts", import.meta.url).pathname,
      "@agentdocs0/renderer-html": new URL("./packages/renderer-html/src/index.ts", import.meta.url).pathname,
      "@agentdocs0/themes": new URL("./packages/themes/src/index.ts", import.meta.url).pathname
    }
  },
  test: {
    include: ["packages/**/*.test.ts"],
    passWithNoTests: false
  }
});
