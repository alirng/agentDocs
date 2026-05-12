import { mkdir, readdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";

await mkdir("dist/examples", { recursive: true });

const files = (await readdir("examples")).filter((file) => file.endsWith(".agent.md"));
for (const file of files) {
  const name = basename(file, ".agent.md");
  const result = spawnSync(
    "pnpm",
    ["agentdocs", "build", join("examples", file), "--out", join("dist/examples", `${name}.html`)],
    { stdio: "inherit" }
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}
