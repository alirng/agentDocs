import { readFile } from "node:fs/promises";
import { join } from "node:path";

const packages = ["core", "themes", "renderer-html", "cli"];
let failed = false;

for (const name of packages) {
  const packagePath = join("packages", name, "package.json");
  const manifest = JSON.parse(await readFile(packagePath, "utf8"));
  const problems = [];

  if (!manifest.name?.startsWith("@agentdocs0/")) problems.push("name must use @agentdocs0 scope");
  if (manifest.private) problems.push("package must not be private");
  if (manifest.publishConfig?.access !== "public") problems.push("publishConfig.access must be public");
  if (!Array.isArray(manifest.files) || !manifest.files.includes("dist")) problems.push("files must include dist");
  if (!manifest.exports?.["."]) problems.push("exports[.] is required");
  if (!manifest.repository?.url?.includes("github.com/alirng/agentDocs")) {
    problems.push("repository URL must point to github.com/alirng/agentDocs");
  }

  if (problems.length > 0) {
    failed = true;
    console.error(`${packagePath}:`);
    for (const problem of problems) console.error(`  - ${problem}`);
  }
}

if (failed) process.exit(1);
console.log("Package metadata is ready for prerelease checks.");
